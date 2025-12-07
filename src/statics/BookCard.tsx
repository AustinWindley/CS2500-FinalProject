import { Card, CardContent, CardActionArea, Typography, Box, Paper } from "@mui/material"

interface Props {
    bookTitle: string
    bookAuthor: string
}

export default function BookCard(props: Props) {
    <Paper>
        <Card>
            <CardContent>
                <Typography>
                    {props.bookTitle}
                </Typography>
                <Typography>
                    {props.bookAuthor}
                </Typography>
            </CardContent>
        </Card>
    </Paper>
}