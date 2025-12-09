import { Box, Typography, Tabs, Tab, Slide, Grid } from "@mui/material"
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { FilterList } from "@mui/icons-material"
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
            <Tabs centered orientation="vertical">
                {props.currentPage === "/books" ? (
                    <>
                        <Tab
                            label={<Typography variant="h5">Search By Author</Typography>}
                            //value={"/author_books"}
                            sx={{textTransform: "none"}}
                            onClick={() => {setPage("/author_books"); nav("/author_books")}}
                        />
                        <Divider />
                    </>
                ) : props.currentPage === "/author_books" &&(
                    <>
                        <Tab
                            label={<Typography variant="h5">Search By Title</Typography>}
                            //value={"/books"}
                            sx={{textTransform: "none"}}
                            onClick={() => {setPage("/books"); nav("/books")}}
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
                    <IconButton onClick={() => {handleOpenVisibility(); handleBarOpen();}} sx={{bgcolor: "#6b5bb4ff"}}>
                        <ArrowForwardIosIcon />
                    </IconButton>
                </Box>
            </Slide>
        </Box>
    )

}