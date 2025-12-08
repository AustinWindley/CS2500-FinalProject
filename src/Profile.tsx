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
export default function Profile() {
    const [userData, setUserData] = useState<UserData | null>(null)
    const [booksData, setBooksData] = useState([])
    const nav = useNavigate()

    // Fetch user account data 
    useEffect(() => {
        fetch("/api/account", {
            method: "GET",
            headers: {"Accept": "application/json"},
            credentials: "include"
        })
        .then((res) => {
        console.log("Status code:", res.status)
        return res.json()
        })
        .then((data) => {
        console.log("Data from /api/account:", data)
        // Set fetched data to state
        setUserData(data)
        })
        .catch((err) => {
        console.error("Fetch error:", err)
        })
    }, [])

    // Fetch user's checked out books
    useEffect(() => {
        fetch("api/user_books", {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setBooksData(data)}
        )
    }, [])

    return(
        <Fragment>
            <Header pageName="Profile"/>
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
                    <Avatar
                        sx={{ 
                            width: 120, 
                            height: 120, 
                            bgcolor: deepPurple[500], 
                            fontSize: 60, 
                            marginTop: 5,
                        }}
                    >
                        {userData?.username ? userData.username[0].toUpperCase() : "?"}
                    </Avatar>

                    <Typography variant="h3">{userData?.username ?? "Loading..."}</Typography>
                    <Typography variant="h6">Email: {userData?.email ?? "Loading..."}</Typography>
                    <Typography variant="h6">Phone Number: {userData?.phone ?? "Loading..."}</Typography>
                    <Typography variant="h6">Address: {userData?.address ?? "Loading..."}</Typography>
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
                    {booksData.length !== 0 ? (
                        <Typography variant="h4" textAlign={"center"}>Books Currently Checked Out:</Typography>
                    ) : (
                        <Typography variant="h4">No Books Currently Checked Out</Typography>
                    )}
                    
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
        </Fragment>
    )
}