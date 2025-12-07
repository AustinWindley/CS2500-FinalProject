import { Card, CardContent, CardMedia, CardActionArea, Typography, Box, Paper } from "@mui/material"
import { useState } from "react"
interface Props {
    ISBN: string
    bookTitle: string
    authorName: string
    yearPublished: number
    imageURL: string
}

export default function BookCard(props: Props) {
    const [paperElevation, setPaperElevation] = useState(5)



    return (
        <Box width={250}>
            <Paper elevation={paperElevation}>    
                <Card>
                    <CardActionArea onMouseOver={() => setPaperElevation(10)} onMouseOut={() => setPaperElevation(5)}>
                        <CardContent sx={{display: "flex", flexDirection:"row", justifyContent:"space-around"}}>
                            <CardMedia 
                                style={{height: 150, width: 150, borderRadius: 4}}
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