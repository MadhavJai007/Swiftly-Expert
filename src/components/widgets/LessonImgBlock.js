import React, {useState} from 'react';
import { Box, Card, CardHeader, CardMedia, IconButton, Menu, MenuItem } from '@mui/material';
import {MoreVert as ThreeDotsIcon} from '@mui/icons-material'

const LessonImgBlock = (props) => {

    const [anchorEl, setAnchorEl] = useState(null);
    const imgMenuOpen = Boolean(anchorEl)
    const handleImgOptionsPress = (event) => {
        setAnchorEl(event.currentTarget);
      };
    const handleMenuClose = () => {
        setAnchorEl(null)
    }

    return (
        <Box sx={{ display: "flex", flexDirection: "row", p: 1, m: 1, }} >
            <Card>
                <CardHeader
                    title="Image block"
                    titleTypographyProps={{fontSize: '18px'}}
                    subheader='Insert last modified date here(??)'
                    subheaderTypographyProps={{fontSize: '14px'}}
                    action={
                        <IconButton
                            id={props.iconBtnId}
                            aria-label="settings"
                            aria-controls={props.imgMenuOpen?`block-${props.blockIndex}-options-menu`:undefined}
                            aria-haspopup='true'
                            aria-expanded={props.imgMenuOpen?'true': undefined}
                            onClick={handleImgOptionsPress}
                        >
                            <ThreeDotsIcon/>
                        </IconButton>
                    }
                />
                {/* The options menu for the image block. Only visible when option button pressed */}
                <Menu
                    id={`block-${props.blockIndex}-options-menu`} /* Trying to give each menu a unique id */
                    anchorEl={anchorEl}
                    open={imgMenuOpen}
                    onClose={handleMenuClose}
                    MenuListProps={{
                        'aria-labelled-by': `${props.iconBtnId}`
                    }}
                > 
                    <MenuItem onClick={handleMenuClose} >Upload image</MenuItem>
                    <MenuItem onClick={handleMenuClose} >Delete</MenuItem>
                </Menu>
                
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