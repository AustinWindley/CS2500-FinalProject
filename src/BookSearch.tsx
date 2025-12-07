import { useState, useEffect } from "react"
import { Box, Button } from "@mui/material"
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
    //const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        fetch("api/books", {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setAllBooks(data), setData(data), setLoading(false)}
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
            if (response.status === 401) {
                const errorData = await response.json()
                // if (errorData.error === "Not logged in") {
                //     alert("Post creation failed: Not logged in")
                //     return false
                // }
            }
            
            setLoading(false)
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
            <SideBar></SideBar>
            <Box 
                component="form" 
                onSubmit={(event) => {handleSubmit(event)}}
                action={"/api/book_search"}
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"center"}
                noValidate
                mt={8}
            >
                <Autocomplete
                    //value={inputValue}
                    id="book-search"
                    freeSolo
                    options={allBooks.map((option) => option["bookTitle"])}
                    renderInput={(params) => <TextField {...params} name="title">Search for a Book..."</TextField> }
                    sx={{width: "80vw"}}
                    // onSubmit={async (event) => handleSubmit(event)}
                />
                <Button type="submit">
                    Search
                </Button>
            </Box>
            {loading === true ? (
                <Box 
                    position={"fixed"}
                    display={"flex"}
                    justifyContent={"center"}
                    alignItems={"center"}
                    width={"100vw"}
                    height={"100vh"}
                    mt={-10} // move background up to cover search bar
                    bgcolor={alpha("#232323", 0.1)}
                >
                    <CircularProgress size={100}/>
                </Box>
            ) : (
                <Masonry columns={{xl: 4, md: 3, sm: 2, xs: 1}} spacing={2} sequential>
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

            )}
            
        </>
        
        
    )
}