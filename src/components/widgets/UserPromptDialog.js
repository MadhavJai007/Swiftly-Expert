import * as React from 'react';
import { Container, Box, Paper, Grid, useMediaQuery, 
  ListItem, ListItemText, List,
  CssBaseline, Button, IconButton, Typography, SpeedDialAction, useTheme, Tab, Tabs, Backdrop, CircularProgress,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle, } from '@mui/material';
import JSONPretty from 'react-json-pretty'


    // general use dialog box compoenent.
function UserPromptDialog(props) {
    const {onClose, open} = props; // the dialog box's close handler and open state.
    const {dialogTitle, dialogDesc, moreDetails} = props;  // The dialog box's title and description text
    const {confirmAction, cancelAction} = props; // The confirm and cancel button's functions
    

    const handleClose = () => {
        onClose();
    }

    const renderRows = () => {
      let detailsArr = []
      console.log(moreDetails)
      if(moreDetails !== undefined && moreDetails !== "none"){
        let info = {
          "Profanity_count" : moreDetails.profanity_count,
          "Chapter_lessons": [],
          "Chapter_playgrounds":[],
        }
        if(moreDetails.profanity_details.chapterTitleProfanity.length > 0){
          info["Chapter_title"] = {
            found_in: "Chapter title",
            content: moreDetails.profanity_details.chapterTitleProfanity
          }
        }
        if(moreDetails.profanity_details.chapterDescProfanity.length > 0){
          info["Chapter_description"] = {
            found_in: "Chapter description",
            content: moreDetails.profanity_details.chapterDescProfanity
          }
        }
        if(moreDetails.profanity_details.chapterLessonsProfanity.length > 0){
          moreDetails.profanity_details.chapterLessonsProfanity.forEach(entry => {
            if(entry.isTitle){
              info.Chapter_lessons.push({
                Lesson_id: entry.lesson_id,
                found_in:  "Lesson title",
                content: entry.profaneContent
              })
            }
            else{
              info.Chapter_lessons.push({
                Lesson_id: entry.lesson_id,
                found_in: "Lesson content",
                content: entry.profaneContent
              })
            }
          });
        }
        if(moreDetails.profanity_details.chapterPlaygroundProfanity.length > 0){
          moreDetails.profanity_details.chapterPlaygroundProfanity.forEach(entry => {
            if(entry.isTitle){
              info.Chapter_playgrounds.push({
                question_id: entry.question_id,
                found_in:  "Question title",
                content: entry.profaneContent
              })
            }
            else if(entry.isDesc){
              info.Chapter_playgrounds.push({
                question_id: entry.question_id,
                found_in:  "question description",
                content: entry.profaneContent
              })
            }
            else{
              info.Chapter_playgrounds.push({
                question_id: entry.question_id,
                found_in: "question options",
                option_number: (entry.optionIndex + 1),
                content: entry.profaneContent
              })
            }
          });
        }
        return <JSONPretty id="more-details" data={info}></JSONPretty>
      }
      else{
        return <br/>
      }

    

      // return <ListItem>
      //   <ListItemText>cum</ListItemText>
      // </ListItem>
      // if(moreDetails !== ''){
      //   let chapTitleDetails = moreDetails.profanityDetails.chapterTitleProfanity.map(word => {
      //     return(
      //     <ListItem>
      //       <ListItemText>
      //         {`Chapter title: ${word}`}
      //       </ListItemText>
      //     </ListItem>
      //     )
      //   })
  
      //   detailsArr.concat(chapTitleDetails)
      //    console.log("cum guzzler")
      //   return detailsArr
      // }
      // else {
      //   console.log('gimme your cum')
      //   return <ListItem>
      //       <ListItemText>cum</ListItemText>
      //     </ListItem>
      // }
      
    }

    const jsonMoreDetails = renderRows();

    return (
        <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogTitle id="alert-dialog-title">
          {dialogTitle}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {dialogDesc}
          </DialogContentText>
        </DialogContent>
        <Box sx={{mx: 3}}>
          {jsonMoreDetails}
        </Box>
        
        <DialogActions>
          {/* If there is no comfirm or cancel method provided, the close dialog action will trigger by default */}
          <Button onClick={cancelAction ? cancelAction : handleClose}>Cancel</Button>
          <Button onClick={confirmAction ? confirmAction : handleClose} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    )


}

export default UserPromptDialog;

