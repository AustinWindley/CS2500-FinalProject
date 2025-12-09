import { Typography, Box, Grid, Paper, Button } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import { useState, useEffect } from "react"
import Header from "./statics/Header.tsx"

export default function BookPage() {
    const location = useLocation()
    const ISBN = location["pathname"].split("/").slice(2)
    const [bookData, setBookData] = useState([])
    const [authorName, setAuthorName] = useState("")
    const [ownership, setOwnership] = useState("")
    const nav = useNavigate()

    useEffect(() => {
        fetch("api/books/"+ISBN, {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setBookData(data[0])}
        )
    }, [])

    useEffect(() => {
        fetch("api/author/"+ISBN, {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.text()
        ).then(
            data => {setAuthorName(data[0]["authorName"]), console.log(data)}
        )
    }, [])

    useEffect(() => {
        fetch("api/ownership_check/"+ISBN, {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setOwnership(data)}
        )
    }, [])

    const formattedTimestamp = new Date(bookData.dateCheckedOut)
    //console.log(bookData)
    //console.log(bookData.authorName)
    //console.log(bookData.authorName)
    // setAuthorName(bookData.authorName)
    

    function handleCheckout(event: React.FormEvent<HTMLButtonElement>) {
        event.preventDefault()

        try {
            fetch("/api/checkout/"+bookData.ISBN, {
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
            fetch("/api/return/"+bookData.ISBN, {
                method: "POST",
            }) 
            nav("/profile")
        } catch (error) {
            return new Response(null, { status: 500, statusText: "Network error"})
        }
    }

    return (
        <>
            <Header pageName={bookData.bookTitle} />
            <Paper elevation={5}>
                <Grid container spacing={4} mt={8} padding={5}>
                    <Grid 
                        component={"img"} 
                        src={bookData.imageURL}
                        size={4}
                        border={"solid 2px"}
                        borderRadius={1}
                    />
                    <Grid 
                        size={8}
                        display={"flex"}
                        flexDirection={"column"}
                    >
                        <Typography variant="h3">{bookData.bookTitle}</Typography>
                        <Box display={"flex"}>
                            <Typography variant="h4">Written by {bookData.authorName}</Typography>
                        </Box>
                        
                        <Typography variant="h4">ISBN: {bookData.ISBN}</Typography>
                        <Typography variant="h5">Released: {bookData.yearPublished}</Typography>

                        {bookData.dateCheckedOut ? (
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
            </Paper>
        </>
    )
}