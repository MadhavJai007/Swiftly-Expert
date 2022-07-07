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



const ChapterLessonForm = ({selectedChapter, setSelectedChapter, selectedLesson, setSelectedLesson}) => {

  // renders the options for the lesson selector dropdown
  const LessonOptions = selectedChapter.lessons.map(lesson => {
    return (<MenuItem key={lesson.lesson_id} value={lesson.lesson_id}>
      {lesson.lesson_title}
    </MenuItem>)
    // <option key={lesson.lesson_id} value={lesson.lesson_id}>
    //     {lesson.lesson_title}
    // </option>
  })

  return (
    <Box sx={{display: "flex", flexDirection: "row", width: '90%'}}>
      <Box sx={{backgroundColor: 'red', width: '80%',p: 1, m: 1,}} >
        s
      </Box>

      {/* Lesson drop down  */}
      <Box sx={{backgroundColor: 'blue', width: '20%',p: 1, m: 1, display: 'flex', flexDirection: 'column'}}>
        <Typography sx={{textAlign: 'center', fontSize: 'h6.fontSize', fontWeight: 'bold'}}>Lessons</Typography>
        <Select
          sx={{
            m: 2,
            minWidth: 125,
          }}
          id="chap-lesson-select"
          displayEmpty
          value={selectedLesson ? selectedLesson.lesson_title : '' }
          // onChange={(e) => onInputChange(e, 'chapter','chapter_difficulty', 0)}
          renderValue={(value) => {
            if (value == '') {
              return 'Select a lesson'
            }
            console.log(value)
            return value;
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