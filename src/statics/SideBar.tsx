import { Box, Typography, Tabs, Tab, Slide, Grid } from "@mui/material"
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"

interface Props {
    currentPage: string
}

/**
 * Sidebar on all event pages that allows event creation and maps access
 * @param props currentPage so sidebar knows which page it is on
 *   and can display tabs accordingly
 * @returns sidebar to be used on event pages
 */
export default function SideBar(props: Props) {
    const [auth, setAuth] = useState(false)
    const [page, setPage] = useState<string>()
    const [barChecked, setBarChecked] = useState(false)
    const [openArrowEnter, setOpenArrowEnter] = useState(false)
    const [openVisibility, setOpenVisibility] = useState("flex")
    const nav = useNavigate()

    const handleBarOpen = () => {
        setBarChecked(true)
        setTimeout(handleOpenArrowEnter, 400)
    }
    
    const handleOpenArrowEnter = () => {
        setOpenArrowEnter(true)
    }

    const handleBarClose = () => {
        setBarChecked(false)
        setTimeout(handleOpenArrowExit, 400)
    }

    const handleOpenArrowExit = () => {
        setOpenArrowEnter(false)
    }

    const handleOpenVisibility = () => {
        if (openVisibility === "none") {
            setOpenVisibility("flex")
        }
        if (openVisibility === "flex") {
            setOpenVisibility("none")
        }
    }

    useEffect(() => {
        fetch("/api/account", {
            headers: { "Accept": "application/json" }
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

    const sideBar = (
        <Box 
            sx={{width: 300, height: "100vh"}}
            display={"flex"} 
            flexDirection={"column"} 
            justifyContent={"start"} 
            alignItems={"center"}
            bgcolor={"#7967CB"}
            mt={-8}
            pt={8}
            position={"fixed"}
            zIndex={3000}
        >
            <Tabs value={page} centered orientation="vertical">
                {auth === true ? (
                <>
                    <Tab
                        label={<Typography variant="h5">Create Event</Typography>}
                        value={"/create_event"}
                        sx={{textTransform: "none"}}
                        onClick={() => {setPage("/create_event"); nav("/create_event")}}
                    />
                    <Divider />
                </>
                ) : (
                <>
                    <Tab
                        label={<Typography variant="h5">Create Event</Typography>}
                        value={"/create_event"}
                        sx={{textTransform: "none"}}
                        onClick={() => {setPage("/login"); nav("/login")}}
                    />  
                    <Divider />
                </>
                )} 

                {props.currentPage === "/events" ? (
                <>
                    <Tab
                        label={<Typography variant="h5">Display As Map</Typography>}
                        value={"/events/map"}
                        sx={{textTransform: "none"}}
                        onClick={() => {setPage("/events/map"); nav("/events/map")}}
                    />
                    <Divider />
                </>
                ) : props.currentPage === "/events/map" ? (
                <>
                    <Tab
                        label={<Typography variant="h5">Display As List</Typography>}
                        value={"/events"}
                        sx={{textTransform: "none"}}
                        onClick={() => {setPage("/events"); nav("/events")}}
                    />
                    <Divider />
                </>
                ) : props.currentPage === "/event" &&(
                <>
                    <Tab
                        label={<Typography variant="h5">Back to Events</Typography>}
                        value={"/events"}
                        sx={{textTransform: "none"}}
                        onClick={() => {setPage("/events"); nav("/events")}}
                    />
                    <Divider />
                </>
                )}
            </Tabs>
        </Box>
    )


    return (
        <Box display={"flex"} position={"fixed"}>
            <Slide in={barChecked} direction="right" timeout={400} appear={true}>
                <Grid 
                    display={"flex"} 
                    justifyContent={"start"} 
                    flexDirection={"row"}
                    size={12}
                >
                    <Grid position={"fixed"}>
                        {sideBar}
                    </Grid>
                    <Grid mt={50} ml={30}>
                        <IconButton onClick={() => {handleOpenVisibility(); handleBarClose();}} sx={{bgcolor: "#6b5bb4ff"}}>
                            <ArrowBackIosNewIcon />
                        </IconButton>
                    </Grid>
                </Grid>
            </Slide>
            <Slide in={!openArrowEnter} timeout={300} direction="right">
                <Box zIndex={0} mt={50} ml={1} position={"fixed"} display={openVisibility}>
                    <IconButton onClick={() => {handleOpenVisibility(); setTimeout(handleBarOpen);}} sx={{bgcolor: "#6b5bb4ff"}}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            </Slide>
        </Box>
    )

}