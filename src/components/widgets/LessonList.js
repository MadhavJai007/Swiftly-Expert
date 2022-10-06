import { Button, ButtonBase, Box, Paper, TextField, Typography, Card} from "@mui/material";
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import {Add as AddIcon, Delete as DeleteIcon, MoreVert as ThreeDotsIcon} from '@mui/icons-material';
import { fontSize } from "@mui/system";


import LessonImgBlock from "./LessonImgBlock";


// used to render the lesson list full of content blocks within  the dashboard's lesson tab
export const renderingLessonList = (selectedLesson, insertContent, fileSelectedHandler, onInputChange, setLessonContentList) => {
    return () => {
        const array = [];
        console.log("renderLessonContent() called");

        // Looping through lesson content
        for (var i = 1; i < selectedLesson.lesson_content.length; i++) {
            let content_index = i;

            // put the add new content butttons before the first element. only happens once
            if (i === 1) {
                array.push(
                    <Box key={"before_first"} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                        {/* New Paragraph button */}
                        <Button variant="outlined" sx={{my: 1}} onClick={(e) => {
                            insertContent(e, "para", content_index, "before");
                        } } >
                            <AddIcon/>
                            Paragraph
                        </Button>

                        {/* New Image button */}
                        <Button variant="outlined" sx={{my: 1}} onClick={(e) => {
                            insertContent(e, "img", content_index, "before");
                        } } >
                            <AddIcon/>
                            Image
                        </Button>
                    </Box>
                );
            }

            // If the content starts with data:image/ it is an image
            if (selectedLesson.lesson_content[i].startsWith("data:image/")) {

                // Push new UI into array
                array.push(

                    <Box key={`lesson_info_${i}`} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}} >
                        
                        <Box sx={{m: 1, p:1}}>
                            <Paper sx={{display: "flex", justifyContent: 'space-between', borderStyle: "solid", borderWidth: '1px', borderColor: '#525252'}} >
                                {/* <IconButton size="large"  >
                                    <AddIcon/>
                                </IconButton> */}
                                {/* <input type={'file'} onClick={(e) => {fileSelectedHandler(e, content_index)}}>
                                </input> */}
                                <input
                                    accept="image/*"
                                    style={{display: 'none'}}
                                    id="contained-button-file"
                                    type="file"
                                    onChange={(e) => {
                                        // console.log(content_index)
                                        fileSelectedHandler(e, content_index)
                                    }}
                                />

                                <label htmlFor="contained-button-file">
                                    <IconButton component="span" onClick={() => {
                                        // console.log(i)
                                        console.log(content_index)
                                    }}>
                                        <AddIcon />
                                    </IconButton>
                                </label>

                                <Typography sx={{alignSelf: 'center'}}>
                                    Image block
                                </Typography>
                                <IconButton size="large" onClick={(e) => insertContent(e, "delete", content_index, "before") }>
                                    <DeleteIcon color="error"/>
                                </IconButton>
                            </Paper>
                            {/* Img card block thing which shows the image */}
                            <Button onClick={() =>  window.open(selectedLesson.lesson_content[content_index], '_blank', 'noopener,noreferrer')}>
                                <LessonImgBlock imgData={selectedLesson.lesson_content[content_index]} imgAlt={"bottom text"}/>
                            </Button>
                        </Box>

                        {/* ADD NEW CONTENT BUTTONS */}
                        <Box key={i} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                            {/* New Paragraph */}
                            <Button variant="outlined" sx={{my: 1}}  onClick={(e) => {
                                insertContent(e, "para", content_index, "after");
                            } } >
                                <AddIcon/>
                                Paragraph
                            </Button>

                            {/* New Image */}
                            <Button variant="outlined" sx={{my: 1}}  onClick={(e) => {
                                insertContent(e, "img", content_index, "after");
                            } } >
                                <AddIcon/>
                                Image
                            </Button>
                        </Box>
                    </Box>
                );

            }

            // else push a text area with current index's text.
            else {
                array.push(
                    
                    <Box key={`lesson_info_${i}`} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', justifySelf: 'center',}} >                   
                        {/* Text Area with content from lesson */}

                        <Box sx={{ display: "flex", flexDirection: "column", p: 1, m: 1, width: '75%' }} >
                            <Paper sx={{display: "flex", justifyContent: 'space-between', borderStyle: "solid", borderWidth: '1px', borderColor: '#525252'  }} >
                                <Typography sx={{alignSelf: 'center', pl: 1}}>
                                    Paragraph block
                                </Typography>
                                <IconButton size="large" onClick={(e) => insertContent(e, "delete", content_index, "before") }>
                                    <DeleteIcon color="error"/>
                                </IconButton>
                            </Paper>
                            
                            <Card>
                                <TextField
                                   
                                    multiline
                                    rows={5}
                                    fullWidth
                                    placeholder="Enter something..."
                                    value={selectedLesson.lesson_content[i]}
                                    onChange={(e) => onInputChange(e, 'lesson', 'lesson_content', content_index)}
                                />
                            </Card>
                            
                        </Box>

                        {/* ADD NEW CONTENT BUTTONS */}
                        <Box key={i} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Button variant="outlined" sx={{my: 1}} onClick={(e) => {
                                insertContent(e, "para", content_index, "after");
                            } } >
                                <AddIcon/>
                                Paragraph
                            </Button>

                            {/* New Image */}
                            <Button variant="outlined" sx={{my: 1}} onClick={(e) => {
                                insertContent(e, "img", content_index, "after");
                            } } >
                                <AddIcon/>
                                Image
                            </Button>
                        </Box>
                    </Box>
                   
                );
            }
        }
        setLessonContentList(array);
    };
}