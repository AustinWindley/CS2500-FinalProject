import { Typography, Box, Grid, Paper, Button } from "@mui/material"
import { useLocation } from "react-router-dom"
import { useState, useEffect } from "react"

export default function BookPage() {
    const location = useLocation()
    const ISBN = location["pathname"].split("/").slice(2)
    const [data, setData] = useState([])

    useEffect(() => {
            fetch("api/books/"+ISBN, {
                headers: {"Accept": "application/json"}
            }).then(
                res => res.json()
            ).then(
                data => {setData(data[0]), console.log(data[0])}
            )
        }, [])

    function handleCheckout() {

    }

    return (
        <>
      
                <Grid container spacing={4}>
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
                        <Button type="submit" onClick={handleCheckout}>Check Out Book</Button>

                    </Grid>
                </Grid>

            
            
            

        </>
    )
}