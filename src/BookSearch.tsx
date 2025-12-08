import { useState, useEffect } from "react"
import { Box, Button, Grid, Typography } from "@mui/material"
import BookCard from "./statics/BookCard.tsx"
import { Masonry } from "@mui/lab"
import { TextField } from "@mui/material"
import { Autocomplete } from "@mui/material"
import { CircularProgress } from "@mui/material"
import { alpha } from "@mui/material"
import SideBar from "./statics/SideBar.tsx"
import Header from "./statics/Header.tsx"

export default function BookSearch() {
    const [allBooks, setAllBooks] = useState([])
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [noSearches, setNoSearches] = useState(true)

    // Load list of all books for autocomplete
    useEffect(() => {
        fetch("api/books", {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setAllBooks(data), setLoading(false)}
        )
    }, [])

    async function sendFormData(formData: FormData) {
        try {
            const response = await fetch("/api/book_search", {
                method: "POST",
                body: formData
            })
            try {
                const data = await response.clone().json()
                console.log(data)
                setData(data)
            } catch (e) {
                console.warn("Failed to parse JSON response", e)
            }
            return response
        } catch (error) {
            return new Response(null, { status: 500, statusText: "Network error" })
            }
    }

    async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault()
        setLoading(true)
        const formData = new FormData(event.currentTarget)
        
        console.log(formData)
        
        try {
            const response = await sendFormData(formData)
            
            setLoading(false)
            setNoSearches(false)
            return response.ok
        } catch (error) {
            console.error('Error during search:', error)
            setLoading(false)
            return false
        }
    }


    return (
        <>
            <Header pageName="Book Search"/>
            <Grid container display={"flex"} mt={8}>
                <Box zIndex={1900} mt={8}>
                    <SideBar currentPage="/books"/>
                </Box>
                <Grid 
                    display={"flex"}
                    mt={8}
                    justifyContent={"center"}
                    size={12}
                >
                    <Box>
                        <Box display={"flex"} flexDirection={"column"} textAlign={"center"}>
                            {noSearches &&(
                                <Typography variant="h2">Type Below to Search for a Book</Typography>
                            )}
                            <Box 
                                component="form" 
                                onSubmit={(event) => {handleSubmit(event)}}
                                action={"/api/book_search"}
                                display={"flex"}
                                flexDirection={"row"}
                                justifyContent={"center"}
                                noValidate
                                pt={4}
                                mb={4}
                            >
                                <Autocomplete
                                    id="book-search"
                                    freeSolo
                                    options={allBooks.map((option) => option["bookTitle"])}
                                    renderInput={(params) => <TextField {...params} name="title">Search for a Book...</TextField> }
                                    sx={{width: "80vw"}}
                                />
                                <Button type="submit">
                                    Search
                                </Button>
                            </Box>
                        </Box>
                        {loading === true ? (
                            <Box 
                                //position={"fixed"}
                                display={"flex"}
                                justifyContent={"center"}
                                alignItems={"center"}
                                width={"100vw"}
                                height={"100vh"}
                                mt={0} // move background up to cover search bar
                                //bgcolor={alpha("#232323", 0.1)}
                            >
                                <CircularProgress size={100} disableShrink/>
                            </Box>
                        ) : (
                            <Box 
                                display={"flex"}
                                justifyContent={"center"}
                                pl={6}
                                pr={6}
                            >
                                <Masonry 
                                    columns={{xl: 4, md: 3, sm: 2, xs: 1}} 
                                    spacing={2} 
                                    sequential                             
                                >
                                    {data.map((book) => (
                                        <BookCard
                                            key={book["ISBN"]}
                                            ISBN={book["ISBN"]} 
                                            bookTitle={book["bookTitle"]} 
                                            authorName={book["authorName"]}
                                            yearPublished={book["yearPublished"]}
                                            imageURL={book["imageURL"]}
                                        />
                                    ))}        
                                </Masonry>
                            </Box>
                        )}
                    </Box>
                </Grid>

            </Grid>
            
            
            
        </>
        
        
    )
}