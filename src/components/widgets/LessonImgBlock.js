import React, {useState} from 'react';
import { Box, Card, CardHeader, CardMedia, IconButton, Button, Menu, MenuItem, Paper, Typography } from '@mui/material';
import {Add as AddIcon, Delete as DeleteIcon, MoreVert as ThreeDotsIcon} from '@mui/icons-material';

const LessonImgBlock = (props) => {
    
    return (
        <Box>

                <Paper sx={{display: "flex", justifyContent: 'space-between', borderStyle: "solid", borderWidth: '1px', borderColor: '#525252'}}>
                    <input
                        accept="image/*"
                        style={{display: 'none'}}
                        id="contained-button-file"
                        type="file"
                        onClick={() => {
                            console.log(props.content_index)
                        }}
                        onChange={(e) => {
                            // console.log(i)
                            let cachedPosition = props.content_index
                            if(e.target.files[0] && e.target.files[0].size > 2200000){
                                alert("Image is too large!!")
                                console.log(e.target.files[0])
                            }
                            else{
                                props.fileSelectedHandler(e, props.content_index)
                            }
                            console.log(props.content_index)
                            console.log(cachedPosition)
                            
                        }}
                    />
                    <label htmlFor="contained-button-file">
                        <IconButton component="span" onClick={() => {
                            // console.log(i)
                            console.log(props.content_index)
                        }}>
                            <AddIcon />
                        </IconButton>
                    </label>
                    <Typography sx={{alignSelf: 'center'}}>
                        Image block
                    </Typography>
                    <IconButton size="large" onClick={(e) => props.insertContent(e, "delete", props.content_index, "before") }>
                        <DeleteIcon color="error"/>
                    </IconButton>
                </Paper>

            <Button onClick={() =>  window.open(props.imgData, '_blank', 'noopener,noreferrer')}>
                <Box sx={{ display: "flex", flexDirection: "row", borderStyle: "solid", borderWidth: '1px' }} >
                    <Card>
                        {/* CardMedia tag renders the image data */}
                        <CardMedia 
                            component={'img'}
                            image={props.imgData}
                            alt={props.imgAlt}
                        />
                    </Card>
                </Box>
            </Button>
        </Box>
    )
}

export default LessonImgBlock;