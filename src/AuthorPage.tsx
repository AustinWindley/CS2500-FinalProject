import Header from "./statics/Header.tsx"
import { Fragment } from "react/jsx-runtime"
import { Avatar } from '@mui/material'
//import EventCard from "./statics/EventCard.tsx"
import { deepPurple } from '@mui/material/colors'
import {Grid, Typography, Box, Button} from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import BookCard from "./statics/BookCard.tsx"

// User data interface to format fetched account info
interface UserData {
    id: string
    username: string
    email: string
    phone: string
    address: string
}

/**
 * Creates a profile page for logged in user via UserData interface
 * @returns a profile page with a users events and information
 */
export default function AuthorPage() {
    const [data, setData] = useState([])
    const authorName = location["pathname"].split("/").slice(3)
    const [booksData, setBooksData] = useState([])
    const nav = useNavigate()

    // Fetch author info
    useEffect(() => {
        fetch("/Library/api/author/"+authorName, {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setData(data[0]), console.log(data[0])}
        )
    }, [])

    // Fetch author's books
    useEffect(() => {
        fetch("/Library/api/author_books", {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setBooksData(data)}
        )
    }, [])

    return(
        <>
            <Header pageName={authorName[0]}/>
            <Grid
                display={"flex"}
                container
                flexDirection={"row"}
                alignItems={"center"}
                //justifyContent={"center"}
                spacing={3}
                mt={8}
                //sx={{minHeight: "100vh", mt: 8}}
                // bgcolor={"#2b4682ff"}
            >
                <Grid
                    display={"flex"}
                    flexDirection={"column"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    size={6}
                >
                    <Typography variant="h3">{data.authorName}</Typography>
                    <Typography variant="h6">Email: {data.authorCountry}</Typography>
                </Grid>
                
                <Grid
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    gap={2}
                    mb={2}
                    size={6}
                    mt={8}
                >
                    <Typography variant="h4" textAlign={"center"}>Books Written:</Typography>
                    {booksData.map((book) => (
                        <BookCard
                            key={book["ISBN"]}
                            ISBN={book["ISBN"]} 
                            bookTitle={book["bookTitle"]} 
                            authorName={book["authorName"]}
                            yearPublished={book["yearPublished"]}
                            imageURL={book["imageURL"]}
                        />
                    ))}
                </Grid>
            </Grid>
        </>
    )
}