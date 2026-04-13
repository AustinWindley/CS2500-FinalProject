import Header from "./statics/Header.tsx"
import { Fragment } from "react/jsx-runtime"
import { Grid, Typography, Container, Paper, Avatar, Box, TextField, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

/**
 * parses form data into a JSON object and
 * sends it to the backend /api/login endpoint
 * via a POST request
 * @param formData 
 * @returns Promise resolving to Response object
 */
async function sendFormData(formData: FormData) {
    try {
        const response = await fetch("/Library/api/login", {
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
 * @returns boolean indicating success of login
 */
async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    try {
        const response = await sendFormData(formData)
        if (response.status === 401) {
            const errorData = await response.json()
            if (errorData.error === "Invalid username or password") {
                alert("Login failed: Invalid username or password")
                return false
            }
        }
        return response.ok
    } catch (error) {
        console.error('Error during login:', error)
        return false
    }
}

export default function Login() {
    const nav = useNavigate()
    return(
        <Fragment>
            <Header pageName="Login" />
            {/* Had to put a grid container for header menu functionality */}
            <Grid container mt={8}>
                <Container maxWidth="xs">
                    <Paper elevation={10} sx={{ padding: 3, marginTop: 8 }}>
                        <Avatar sx={{
                            mx: "auto",
                            bgcolor: "secondary.main",
                            textAlign: "center",
                            mb: 1,
                            mt: 1
                        }}
                        ></Avatar>
                        <Typography component='h1' variant="h5" align="center" gutterBottom sx={{textAlign: "center"}}>
                            Login
                        </Typography>
                    <Box 
                        component="form" 
                        action={"/Library/api/login"}
                        // onSubmit send form data to backend and nav to account page
                        onSubmit={async (event) => {
                            const success = await handleSubmit(event) 
                            if (success) {
                                nav("/Library/profile")
                            }
                        }}
                        noValidate // not sure what this does
                        sx={{ mt: 1 }}>
                        <TextField 
                            placeholder="Enter username" 
                            label="Username" 
                            name="username" 
                            type="text"
                            fullWidth 
                            required
                            margin="normal"/>
                        <TextField 
                            placeholder="Enter password" 
                            label="Password" 
                            name="password" 
                            type="password" 
                            fullWidth 
                            required 
                            margin="normal"/>
                        <Button type="submit" color="primary" variant="contained" fullWidth sx={{ mt: 1, mb: 1 }}>
                            Sign In
                        </Button> 
                    </Box>
                </Paper>
            </Container>
        </Grid>
        </Fragment>
    )
}

