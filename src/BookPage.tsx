import { Typography, Box, Grid, Paper, Button } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Header from "./statics/Header.tsx"

export default function BookPage() {
    const location = useLocation()
    const ISBN = location["pathname"].split("/").slice(2)
    const [data, setData] = useState([])
    const [ownership, setOwnership] = useState("")
    const nav = useNavigate()

    useEffect(() => {
        fetch("api/books/"+ISBN, {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setData(data[0]), console.log(data[0])}
        )
    }, [])

    useEffect(() => {
        fetch("api/ownership_check/"+ISBN, {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setOwnership(data), console.log(ownership)}
        )
    }, [])

    const formattedTimestamp = new Date(data.dateCheckedOut)

    function handleCheckout(event: React.FormEvent<HTMLButtonElement>) {
        event.preventDefault()

        try {
            fetch("/api/checkout/"+data.ISBN, {
                method: "POST",
            }) 
            nav("/profile")
        } catch (error) {
            return new Response(null, { status: 500, statusText: "Network error"})
        }
    }

    function handleReturn(event: React.FormEvent<HTMLButtonElement>) {
        event.preventDefault()

        try {
            fetch("/api/return/"+data.ISBN, {
                method: "POST",
            }) 
            nav("/profile")
        } catch (error) {
            return new Response(null, { status: 500, statusText: "Network error"})
        }
    }

    return (
        <>
            <Header pageName={data.bookTitle} />
            <Grid container spacing={4} mt={8}>
                <Grid 
                    component={"img"} 
                    src={data.imageURL}
                    size={4}
                    border={"solid 2px"}
                    borderRadius={1}
                />
                <Grid 
                    size={8}
                    display={"flex"}
                    flexDirection={"column"}
                >
                    <Typography variant="h3">{data.bookTitle}</Typography>
                    <Typography variant="h4">Written by {data.authorName}</Typography>
                    <Typography variant="h4">ISBN: {data.ISBN}</Typography>

                    {data.dateCheckedOut ? (
                        <Typography variant="h6">{"Book checked out on: " + 
                            formattedTimestamp.toLocaleDateString() + " " + 
                            formattedTimestamp.toLocaleTimeString()}
                        </Typography>
                    ) : (
                        <Button type="submit" onClick={handleCheckout}>Check Out Book</Button>
                    )}
                    {ownership === "true" &&(
                        <Button type="submit" onClick={handleReturn}>Return Book</Button>
                    )}
                </Grid>
            </Grid>

            
            
            

        </>
    )
}