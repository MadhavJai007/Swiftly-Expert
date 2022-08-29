import React, {useState} from 'react';
import { Box, Card, CardHeader, CardMedia, IconButton, Menu, MenuItem } from '@mui/material';
import {MoreVert as ThreeDotsIcon} from '@mui/icons-material'

const LessonImgBlock = (props) => {
    
    return (
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
    )
}

export default LessonImgBlock;