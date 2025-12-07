//import Header from "./statics/Header.tsx"
import { Fragment } from "react/jsx-runtime"
import { Grid, Typography, Container, Paper, Avatar, Box, TextField, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

/**
 * parses form data into a JSON object and
 * sends it to the backend /api/users endpoint
 * via a POST request
 * @param formData 
 * @returns Promise resolving to Response object
 */
async function sendFormData(formData: FormData): Promise<Response> {
    try {
        const response = await fetch("/api/signup", {
            method: "POST",
            body: formData
        })
        try {
            const data = await response.clone().json()
            console.log(data)
        } catch (e) {
            console.warn("Failed to parse JSON response", e)
        }
        return response
    } catch (error) {
        return new Response(null, { status: 500, statusText: "Network error" })
    }
}

/**
 * Obtains form data from event and passes it to sendFormData()
 * @param event 
 * @returns boolean indicating success of signup
 */
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    try {
        const response = await sendFormData(formData)

        if (response.status === 400) {
            const errorData = await response.json()
            if (errorData.error === "Username already exists" ) {
                alert("Signup failed: Username already exists")
                return false
            }
        }
        return response.ok
    } catch (error) {
        console.error('Error during signup:', error)
        return false
    }
}

export default function Signup() {
    const nav = useNavigate()
    return(
        <Fragment>
            {/* <Header pageName="Signup"></Header> */}
            <Grid container mt={8}>
                <Container maxWidth="xs">
                    <Paper elevation={10} sx={{ padding: 3, marginTop: 10 }}>
                        <Avatar sx={{
                            mx: "auto",
                            bgcolor: "secondary.main",
                            textAlign: "center",
                            mb: 1,
                            mt: 1
                        }}
                        ></Avatar>
                        <Typography component='h1' variant="h5" align="center" gutterBottom sx={{textAlign: "center"}}>
                            Create Account
                        </Typography>
                        <Box 
                            component="form" 
                            action={"/api/users"}
                            onSubmit={async (event) => {
                                const success = await handleSubmit(event) 
                                if (success) { 
                                    nav("/profile")
                                }
                            }} 
                            noValidate // not sure what this does
                            sx={{ mt: 1 }}>
                            <TextField 
                                placeholder="Enter Username" 
                                label="Username" 
                                name="username" 
                                type="text"
                                fullWidth 
                                required
                                margin="normal"/>
                            <TextField 
                                placeholder="Enter a Secure Password" 
                                label="Password" 
                                name="password" 
                                type="password" 
                                fullWidth 
                                required 
                                margin="normal"/>
                            <TextField 
                                placeholder="Enter Email Address" 
                                label="Email"
                                name="email"
                                type= "text"
                                fullWidth 
                                required
                                margin="normal"/>
                            <TextField 
                                placeholder="Enter Phone Number" 
                                label="Phone Number"
                                name="phone" 
                                type="tel"
                                fullWidth 
                                required
                                margin="normal"/>
                            <TextField 
                                placeholder="Enter Mailing Address"
                                label="Address"
                                name="address"
                                type="text"
                                fullWidth 
                                required
                                margin="normal"/>
                            <Button type="submit" color="primary" variant="contained" fullWidth sx={{ mt: 1, mb: 1 }}>
                                Sign Up
                            </Button> 
                        </Box>
                    </Paper>
                </Container>
            </Grid>
        </Fragment>
    )
}