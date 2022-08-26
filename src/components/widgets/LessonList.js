import { Button, Box, TextField, Card, CardHeader, CardMedia, CardContent, CardActionArea, Menu, MenuItem } from "@mui/material";
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
                        } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                            <AddIcon/>
                            Paragraph
                        </Button>

                        {/* New Image button */}
                        <Button variant="outlined" sx={{my: 1}} onClick={(e) => {
                            insertContent(e, "img", content_index, "before");
                        } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
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

                    <Box key={`lesson_info_${i}`} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center',}} >

                        <LessonImgBlock iconBtnId={`lesson_info_${i}_img_settings`} blockIndex={i} imgData={selectedLesson.lesson_content[i]} imgAlt={"bottom text"}/>

                        {/* ADD NEW CONTENT BUTTONS */}
                        <Box key={i} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>

                            {/* New Paragraph */}
                            <Button variant="outlined" sx={{my: 1}}  onClick={(e) => {
                                insertContent(e, "para", content_index, "after");
                            } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                <AddIcon/>
                                Paragraph
                            </Button>

                            {/* New Image */}
                            <Button variant="outlined" sx={{my: 1}}  onClick={(e) => {
                                insertContent(e, "img", content_index, "after");
                            } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
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
                        {/* <div className="flex flex-row justify-center space-x-4 "> */}
                        <Box sx={{ display: "flex", flexDirection: "row", p: 1, m: 1, width: '75%' }} >
                                <TextField
                                    label="Paragraph block"
                                    multiline
                                    rows={5}
                                    fullWidth
                                    placeholder="Enter something..."
                                    value={selectedLesson.lesson_content[i]}
                                    onChange={(e) => onInputChange(e, 'lesson', 'lesson_content', content_index)}
                                />
                            <Button variant='outlined' color="error" onClick={(e) => insertContent(e, "delete", content_index, "before") } sx={{ml: 3}}>
                                <DeleteIcon/>
                            </Button>
                        </Box>
                        {/* </div> */}
                        {/* ADD NEW CONTENT BUTTONS */}
                        <Box key={i} sx={{display: 'flex', flexDirection: 'column', alignItems: 'center'}}>
                            <Button variant="outlined" sx={{my: 1}} onClick={(e) => {
                                insertContent(e, "para", content_index, "after");
                            } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                <AddIcon/>
                                Paragraph
                            </Button>

                            {/* New Image */}
                            <Button variant="outlined" sx={{my: 1}} onClick={(e) => {
                                insertContent(e, "img", content_index, "after");
                            } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
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