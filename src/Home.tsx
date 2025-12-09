import { Box, Typography, Button } from "@mui/material"
import Header from "./statics/Header.tsx"
import { useNavigate } from "react-router-dom"
import library from './assets/library.jpg'

export default function Home() {
    const nav = useNavigate()

    function openLibrary(event: React.FormEvent<HTMLButtonElement>) {
        event.preventDefault()

        try {
            fetch("/api/create_database", {
                method: "POST",
            }) 
            nav("/books")
        } catch (error) {
            return new Response(null, { status: 500, statusText: "Network error"})
        }
    }

    return (
        <>
            <Header pageName="Home" />
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100vw"}
                height={"100vh"}
                sx={{backgroundImage: library}}
                pt={8}
            >
                <Typography variant="h1">Little Library</Typography>
                <Box>
                    <Button type="submit" onClick={openLibrary}>Open the Library</Button>
                </Box>
            </Box>
            
        </>
    )
}