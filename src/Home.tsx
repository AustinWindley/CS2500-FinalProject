import { Box, Typography, Button } from "@mui/material"
import Header from "./statics/Header.tsx"
import { useNavigate } from "react-router-dom"
import { Paper } from "@mui/material"

export default function Home() {
    const nav = useNavigate()

    function openLibrary(event: React.FormEvent<HTMLButtonElement>) {
        event.preventDefault()

        try {
            fetch("Libary/api/create_database", {
                method: "POST",
            }) 
            nav("/books")
        } catch (error) {
            return new Response(null, { status: 500, statusText: "Network error"})
        }
    }

    return (
        <>
            <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"center"}
                alignItems={"center"}
                width={"100vw"}
                height={"100vh"}
                sx={{backgroundImage: `url('/assets/library.jpg')`, backgroundSize: "cover"}}
            >
                <Paper elevation={10} sx={{borderRadius: 3}}>
                    <Box display={"flex"} flexDirection={"column"} padding={4} borderRadius={3}>
                        <Typography variant="h1">Little Library</Typography>
                        <Box alignSelf={"center"} bgcolor={"lightblue"} borderRadius={3}>
                            <Button type="submit" onClick={openLibrary}>Open the Library</Button>
                        </Box>
                    </Box>
                </Paper>
                
            </Box>  
        </>
    )
}