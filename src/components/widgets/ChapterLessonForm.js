import React from "react";
import {
  Container,
  Box,
  Paper,
  Grid,
  useMediaQuery,
  CssBaseline,
  AppBar,
  IconButton,
  Typography,
  SpeedDialAction,
  Divider,
  Drawer,
  Tab,
  Tabs,
  TextField,
  Slider,
  Input,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
} from "@mui/material";



const ChapterLessonForm = ({selectedChapter, setSelectedChapter, selectedLesson, setSelectedLesson, setOriginalLessonContent}) => {

  // renders the options for the lesson selector dropdown
  const LessonOptions = selectedChapter.lessons.map(lesson => {
    return (<MenuItem key={lesson.lesson_id} value={lesson}>
      {lesson.lesson_title}
    </MenuItem>)
  })

  // handler that triggers when a lesson is selected from the dropdown in the second tab of the editor panel
  const onLessonSelect = (e) => {
    let lessonObj = e.target.value;
    console.log("sdas")
    // if(lessonObj !== ""){
        var chosenLesson = selectedChapter.lessons.find(lesson => lesson.lesson_id == lessonObj['lesson_id'])
        setSelectedLesson(chosenLesson)
        setOriginalLessonContent(chosenLesson)
    // }
  }

  return (
    <Box sx={{display: "flex", flexDirection: "row", width: '90%'}}>
      <Box sx={{backgroundColor: 'red', width: '80%',p: 1, m: 1,}} >
        s
      </Box>

      {/* Lesson drop down  */}
      <Box sx={{backgroundColor: 'blue', maxWidth: '20%', minWidth: '20%', p: 1, m: 1, display: 'flex', flexDirection: 'column'}}>
        <Typography sx={{textAlign: 'center', fontSize: 'h6.fontSize', fontWeight: 'bold'}}>Lessons</Typography>
        <Select
          sx={{
            m: 2,
            minWidth: 125,
          }}
          id="chap-lesson-select"
          displayEmpty
          defaultValue={""}
          value={selectedLesson ? selectedLesson : '' }
          onChange={(e) => onLessonSelect(e)}
          renderValue={(value) => {
            if (value == '') {
              return 'Select a lesson'
            } else {
              return value.lesson_title;
            }
          }}
        >
          <MenuItem disabled value="">
            <em>{LessonOptions.length == 0 ? 'This chapter has no lessons!' : 'Select a lesson to edit.'}</em>
          </MenuItem>
          {LessonOptions}
        </Select>
      </Box>
    </Box>
  )
}

export default ChapterLessonForm;