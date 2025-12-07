import { useState, useEffect } from "react"
import { Box } from "@mui/material"
import BookCard from "./statics/BookCard.tsx"
import { Masonry } from "@mui/lab"
import { TextField } from "@mui/material"
import { Autocomplete } from "@mui/material"
import { CircularProgress } from "@mui/material"
export default function BookSearch() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [inputValue, setInputValue] = useState("")

    useEffect(() => {
        fetch("api/books", {
            headers: {"Accept": "application/json"}
        }).then(
            res => res.json()
        ).then(
            data => {setData(data), setLoading(false)}
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

    async function handleSubmit(event: React.FormEvent<HTMLDivElement>) {
        event.preventDefault()
        setInputValue(event.target[0].value)
        //console.log(event.target[0].value)
        const formData = new FormData()
        formData.append("title", inputValue)
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
            return response.ok
        } catch (error) {
            console.error('Error during search:', error)
            return false
        }
    }


    return (
        <>
            <Autocomplete
                value={inputValue}
                id="book-search"
                freeSolo
                options={data.map((option) => option["bookTitle"])}
                renderInput={(params) => <TextField {...params} component="form" onSubmit={(event) => {handleSubmit(event)}}>Search for a Book..."</TextField> }
                // onSubmit={async (event) => handleSubmit(event)}
            />

            {loading === true ? (
                <Box sx={{display: "flex"}}>
                    <CircularProgress size={100}/>
                </Box>
            ) : (
                <Masonry columns={{xl: 4, md: 3, sm: 2, xs: 1}} spacing={2} sequential>
                    {data.map((book) => (
                        <BookCard
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