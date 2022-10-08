import React, {useState, useEffect} from "react";
import ResetLessonDialog from "./UserPromptDialog";
import {
  Container,
  Box,
  Typography,
  Divider,
  TextField,
  Select,
  MenuItem,
  Button,
  IconButton,
} from "@mui/material";
import { DeleteOutline as DeleteIcon } from "@mui/icons-material";

// Lesson editor interface widget.
const ChapterLessonForm = ({onInputChange, selectedChapter, setSelectedChapter, selectedLesson, setSelectedLesson, originalLessonContent, setOriginalLessonContent, lessonContentList, deleteLesson}) => {

  const [showResetDialog, setShowResetDialog] = useState(false)

  // method that is used by dialog box when closed.
  const closeResetDialog = () => {
    setShowResetDialog(false)
  }

  // method that will reset lesson before edits were made.
  const resetLesson = () => {
    
    // console.log("THIS IS THE OG LESSON CONTENT")
    // console.log(originalLessonContent)
    // console.log("AND THIS IS THE MODIFIED LESSON")
    console.log(selectedLesson)
    // setTimeout(()=> setSelectedLesson(originalLessonContent), 150)
    // setTimeout(()=> console.log(selectedLesson.lesson_content), 200)
    setSelectedLesson(originalLessonContent)
    setShowResetDialog(false)


    // OR setLessonContentList directly from here
  }

  const handleDeleteAction = () => {
    let clonedChapter = selectedChapter
    let lessonsArray = clonedChapter.lessons
    console.log(lessonsArray)
    let originalLesson = lessonsArray.find(lesson => lesson.lesson_id ==  selectedLesson.lesson_id )
    let originalLessonIndex = lessonsArray.indexOf(originalLesson)
    setSelectedLesson(null)
    deleteLesson(lessonsArray[originalLessonIndex].lesson_id)
    lessonsArray.splice(originalLessonIndex, 1)
    setSelectedChapter({ ...selectedChapter, lessons: lessonsArray})
  }

  // renders the options for the lesson selector dropdown
  const LessonOptions = selectedChapter.lessons.map(lesson => {
    return (<MenuItem key={lesson.lesson_id} value={lesson}>
      {lesson.lesson_title}
    </MenuItem>)
  })

  // handler that triggers when a lesson is selected from the dropdown in the second tab of the editor panel
  const onLessonSelect = (e) => {
    let lessonObj = e.target.value;
    
    // if(lessonObj !== ""){
        var chosenLesson = selectedChapter.lessons.find(lesson => lesson.lesson_id == lessonObj['lesson_id'])
        setSelectedLesson(chosenLesson)
        setOriginalLessonContent(chosenLesson)
    // }
  }

  // componentDidMount hook 
  useEffect(() => {
    console.log("mounted lesson form")
  }, [])

  return (
    <Box sx={{display: "flex", flexDirection: "row", width: '90%', maxHeight: '77vh'}}>
      
      {/* Reset confirmation box */}
      <ResetLessonDialog 
        open={showResetDialog}      
        onClose={closeResetDialog}
        dialogTitle={'Reset lesson?'}
        dialogDesc={'Resetting lesson will restore the most recent version saved online.'}
        confirmAction={resetLesson}
        cancelAction={null}
      />

      {/* lesson list panel */}
      <Box sx={{ width: '80%', overflow: 'auto'}}>
        <Box sx={{p: 1, m: 1,}} >
          {selectedLesson ? 
            <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flexGrow: 1,
              p: 1,
              m: 1,
              alignItems: "center",
            }}>
              <Typography variant="h5" sx={{fontWeight: 'bold'}}>
                Create your lesson here
              </Typography>
              <Box
                sx={{
                  "& .MuiTextField-root": {
                    m: 2,
                    mt: 4,
                    width: "25ch",
                  },
                  
                }}
              >
                <TextField
                  disabled
                  id="lesson_id_txt"
                  label="Lesson ID"
                  value={selectedLesson.lesson_id} 
                />
                <TextField
                  id="lesson_title_txt"
                  label="Lesson title"
                  value={selectedLesson.lesson_title}
                  onChange={(e) => onInputChange(e, 'lesson','lesson_title', 0)}
                    //onInputChange(e, 'chapter','subscription_code', 0)}
                />
                <Button onClick={() => {setShowResetDialog(true)}}>Reset</Button>
                <IconButton color="error" size="large" onClick={() => handleDeleteAction()}>
                  <DeleteIcon fontSize="inherit"/>
                </IconButton>
              </Box>

              {/* Lesson content in list form */}

              <Box sx={{ width: '80%'}}>
                {lessonContentList}
                
              </Box>
            </Box> 
          : 
            <Typography sx={{textAlign: 'center', fontSize: 'h6.fontSize', fontWeight: 'bold'}}>
              Select/Create a lesson.
            </Typography> 
          } 
        </Box>
      </Box>

      <Divider orientation="vertical" />

      {/* Lesson drop down section  */}
      <Box sx={{ maxWidth: '20%', minWidth: '20%', p: 1, m: 1, display: 'flex', flexDirection: 'column'}}>
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