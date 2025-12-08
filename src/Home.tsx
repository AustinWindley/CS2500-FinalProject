import { Box, Typography } from "@mui/material"
import { Masonry } from "@mui/lab"
import Header from "./statics/Header.tsx"

export default function Home() {
    return (
        <>
            <Header pageName="Home" />
            <Box mt={8}>
                <Typography>
                    Library
                </Typography>
            </Box>
        </>
    )
}