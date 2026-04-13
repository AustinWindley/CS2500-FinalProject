import Header from "./statics/Header.tsx"
import { Fragment } from "react/jsx-runtime"
import { useNavigate } from "react-router-dom"
import { Button, Grid } from "@mui/material"

/**
 * Allows user to log out of website or delete account
 * @returns logout page to log out of account or delete account
 */
export default function Logout() {
    const nav = useNavigate()

    const handleLogout = () => {
        fetch("/Library/api/logout", { method: "POST" })
        .then(() => {nav("/Libary/login")})
        .catch((err) => console.error("Logout error:", err))
    }

    const handleDeleteAccount = async() => {
        try {
            // If the user cancels, do not proceed
            if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
                return false
            }

            const response = await fetch("/Library/api/delete_user", { 
                method: "POST",
                headers: {"Content-Type": "application/json"},
                credentials: "include"
            })

            if (!response.ok) {
                console.error("Account deletion failed with status:", response.status)
                return false
            }

            const respData = await response.json()
            console.log("Account deletion response:", respData)
            return true
        } catch (error) {
            console.error("Account deletion error:", error)
            return false
        }
    }

    return(
        <Fragment>
            <Header pageName="Logout" />
            <Grid container mt={8} justifyContent={"center"}>
                <Grid
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="60vh"
                    gap={2}
                >
                    <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={handleLogout}
                    >
                        Logout
                    </Button>

                    <Button 
                        variant="outlined" 
                        color="error" 
                        size="large"
                        onClick={async () => {
                            const success = await handleDeleteAccount()
                            if (success) {
                                nav("/Library/signup")
                            }
                        }}
                    >
                        Delete Account
                    </Button>
                </Grid>
            </Grid>
        </Fragment>
    )
}