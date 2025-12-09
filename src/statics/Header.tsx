import {AppBar, Box, Toolbar, Typography, Button, IconButton, Grid, Tabs, Tab, Slide} from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { useState, useEffect } from "react"
import { useNavigate, useLocation } from "react-router-dom"

interface Props {
    pageName: string
}

/**
 * Returns the header that sits on top of each page
 * 
 * @param props pass in pageName to update name in appbar
 * 
 * @returns The appbar that holds the menu icon, page title, and account button
 *  as well as a pop out menu that holds the page navigation tabs
 */
export default function Header(props: Props) {
    const [auth, setAuth] = useState(false)
    const [menuChecked, setMenuChecked] = useState(false)
    const [loginChecked, setLoginChecked] = useState(false)
    const nav = useNavigate()


    useEffect(() => {
        fetch("/api/account", {
            headers: {"Accept": "application/json"}
        }).then(
            res => {
                if (res.status === 401) {
                    setAuth(false)
                } else {
                    setAuth(true)
                }
            }
        )
    }, [])

    const handleMenu = () => {
        if (loginChecked === true) {
            setLoginChecked((prev) => !prev)
        }
        setMenuChecked((prev) => !prev)
    }

    const handleLogin = () => {
        if (menuChecked === true) {
            setMenuChecked((prev) => !prev)
        }
        setLoginChecked((prev) => !prev)
    }

    const location = useLocation()

    const menu = (
        <Grid 
            sx={{width: "100vw", height: 100}} 
            display={"flex"} direction={"row"} 
            justifyContent={"center"} 
            alignItems={"center"}
            position={"fixed"}
            bgcolor={'#6b5bb4ff'}
            zIndex={1950}
        >
            <Tabs centered>
                <Tab
                    label={<Typography variant="h5">Home</Typography>}
                    //value={"/home"}
                    sx={{textTransform: "none"}}
                    onClick={() => {nav("/home")}}
                />
                <Tab
                    label={<Typography variant="h5">Book Search</Typography>}
                    //value={"/books"}
                    sx={{textTransform: "none"}}
                    onClick={() => {nav("/books")}}
                />
            </Tabs>
        </Grid>
    )

    const login = (
        <Grid 
            sx={{width: "100vw", height: 100}} 
            display={"flex"} direction={"row"} 
            justifyContent={"center"} 
            alignItems={"center"}
            position={"fixed"}
            bgcolor={"#6b5bb4ff"}
            zIndex={1950}
        >
            <Tabs centered>
                {auth === true ?(
                <>
                    <Tab
                        label={<Typography variant="h5">Profile</Typography>}
                        //value={"/profile"}
                        sx={{textTransform: "none"}}
                        onClick={() => {nav("/profile")}}
                    />
                    <Tab
                        label={<Typography variant="h5">Logout</Typography>}
                        //value={"/logout"}
                        sx={{textTransform: "none"}}
                        onClick={() => {nav("/logout")}}
                    />
                </> 
                ) : (
                <>
                    <Tab
                        label={<Typography variant="h5">Login</Typography>}
                        //value={"/login"}
                        sx={{textTransform: "none"}}
                        onClick={() => {nav("/login")}}
                    />
                    <Tab
                        label={<Typography variant="h5">Signup</Typography>}
                        //value={"/signup"}
                        sx={{textTransform: "none"}}
                        onClick={() => {nav("/signup")}}
                    />
                </>
                )}
                
            </Tabs>
        </Grid>
    )

    return (
        <Box sx={{ flexgrow: 1 }}>
            <AppBar position="fixed" sx={{zIndex: 2000, bgcolor: "#5741BE"}}>
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        aria-controls="header-menu"
                        aria-haspopup="true"
                        onClick={handleMenu}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        {props.pageName}
                    </Typography>
                    <Button color="inherit" onClick={handleLogin}>Account</Button>
                </Toolbar>
            </AppBar>
            <Slide in={menuChecked}>{menu}</Slide>
            <Slide in={loginChecked}>{login}</Slide>
        </Box>
    )
}