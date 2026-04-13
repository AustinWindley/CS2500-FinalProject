import { Card, CardContent, CardMedia, CardActionArea, Typography, Box, Paper } from "@mui/material"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
interface Props {
    ISBN: string
    bookTitle: string
    authorName: string
    yearPublished: number
    imageURL: string
}

export default function BookCard(props: Props) {
    const [paperElevation, setPaperElevation] = useState(5)
    const nav = useNavigate()


    return (
        <Box sx={{minWidth: 250, maxWidth:{md: "45vw", lg: "30vw"}}} zIndex={800}>
            <Paper elevation={paperElevation}>    
                <Card>
                    <CardActionArea 
                        onMouseOver={() => setPaperElevation(10)} 
                        onMouseOut={() => setPaperElevation(5)}
                        onClick={() => nav("/Library/books/" + props.ISBN)}
                    >
                        <CardContent sx={{display: "flex", flexDirection:"row", justifyContent:"space-around"}}>
                            <CardMedia 
                                style={{height: 150, width: 150, borderRadius: 4, marginRight: 15}}
                                component={"img"}
                                src={props.imageURL} 
                            />
                            <Box>
                                <Typography variant="h5">
                                    {props.bookTitle}
                                </Typography>
                                <Typography variant="h6">
                                    {props.authorName}
                                </Typography>
                            </Box>
                        </CardContent>
                    </CardActionArea>
                </Card>
            </Paper>
        </Box>
        

    )
    
}