//import Header from "./statics/Header.tsx"
import { Fragment } from "react/jsx-runtime"
import { Avatar } from '@mui/material'
//import EventCard from "./statics/EventCard.tsx"
import { deepPurple } from '@mui/material/colors'
import {Grid, Typography, Box, Button} from "@mui/material"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

// User data interface to format fetched account info
interface UserData {
    id: string
    username: string
    email: string
    phone: string
    address: string
}

/**
 * Creates a profile page for logged in user via UserData interface
 * @returns a profile page with a users events and information
 */
export default function Profile() {
    const [data, setData] = useState<UserData | null>(null)
    const [postData, setPostData] = useState([])
    const nav = useNavigate()

    // Fetch user account data 
    useEffect(() => {
            fetch("/api/account", {
                method: "GET",
                headers: {"Accept": "application/json"},
                credentials: "include"
            })
    .then((res) => {
      console.log("Status code:", res.status)
      return res.json()
    })
    .then((data) => {
      console.log("Data from /api/account:", data)
      // Set fetched data to state
      setData(data)
    })
    .catch((err) => {
      console.error("Fetch error:", err)
    })
}, [])

//     // Fetch user's posts 
//     useEffect(() => {
//         fetch("/api/user_events", {
//             method: "GET",
//             headers: {"Accept": "application/json"},
//             credentials: "include"
//         })
//     .then((res) => {
//         console.log("Status code:", res.status)
//         return res.json()
//     })
//     .then((postData) => {
//         console.log("Data from /api/user_events:", postData)
//         // Set fetched data to state
//         setPostData(postData)
//     })
//     .catch((err) => {
//         console.error("Fetch error:", err)
//     })
// }, [])

    return(
        <Fragment>
            {/* <Header pageName="Profile"></Header> */}
            <Grid
                display={"flex"}
                container direction={"column"}
                alignItems={"center"}
                justifyContent={"top"}
                spacing={3}
                sx={{minHeight: "100vh", mt: 8}}
                // bgcolor={"#2b4682ff"}
            >
                <Avatar
                    sx={{ 
                        width: 120, 
                        height: 120, 
                        bgcolor: deepPurple[500], 
                        fontSize: 60, 
                        marginTop: 5
                    }}
                >
                    {data?.username ? data.username[0].toUpperCase() : "?"}
                </Avatar>

                <Typography variant="h3">{data?.username ?? "Loading..."}</Typography>
                <Typography variant="h6">Email: {data?.email ?? "Loading..."}</Typography>
                <Typography variant="h6">Phone Number: {data?.phone ?? "Loading..."}</Typography>
                <Typography variant="h6">Address: {data?.address ?? "Loading..."}</Typography>

                <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    justifyContent="center"
                    minHeight="60vh"
                    gap={2}
                    mb={2}
                >
                    {/* <Button 
                        variant="contained" 
                        color="primary" 
                        size="large"
                        onClick={async () => {
                            nav("/create_event")
                        }}
                    >
                        Create Event
                    </Button> */}
                    {/* {postData.slice().reverse().map((post) => (
                    <Grid display={"flex"} justifyContent={"center"} mt={2}>
                        <EventCard
                            userID={post["user_id"]}
                            eventID={post["id"]}
                            eventTitle={post["title"]}
                            eventDescription={post["content"]}
                            eventPhotoUrl={post["image_url"]}
                            eventLikes={post["likes"]}
                            eventTimestamp={post["timestamp"]}
                            eventLocation={[post["latitude"], post["longitude"]]}
                        />
                    </Grid>
                ))} */}
                </Box>
            </Grid>
        </Fragment>
    )
}