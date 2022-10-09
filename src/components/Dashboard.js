

import React, { useState, useEffect, useRef, MouseEvent } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { collection, doc, setDoc, getDocs, getDoc, addDoc, listCollections, arrayRemove } from 'firebase/firestore'
import {db} from '../firebase';

import { chapterObj, templateLesson} from './models/chapterModel';
import { userObject } from './models/expertUserModel';
import { renderingLessonList } from './widgets/LessonList';
import ChapterSummaryForm from './widgets/ChapterSummaryForm';
import ChapterLessonForm from './widgets/ChapterLessonForm';
import PlaygroundEditor from './widgets/PlaygroundEditor';
import ChapterDrawer from './widgets/ChapterDrawer';
import SwiftlyAppBar from './widgets/SwiftlyAppBar';
import UserPromptDialog from './widgets/UserPromptDialog';
import { renderChapterCards } from './widgets/ChapterCards';
import * as dashboardViewModel from './viewmodels/DashboardViewModel';
import {
  Container,
  Box,
  Paper,
  useMediaQuery,
  CssBaseline,
  Button,
  IconButton,
  Typography,
  SpeedDialAction,
  useTheme,
  Tab,
  Tabs,
  Backdrop,
  CircularProgress,
  Fab,
  MenuItem,
  TextField,
  FormControl,
  InputLabel,
  Select,
  List,
  ListItem,
  ListItemIcon,
  Checkbox,
  Divider
} from "@mui/material";
import SpeedDial, { SpeedDialProps } from '@mui/material/SpeedDial';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { 
    Menu as MenuIcon, 
    Add as SpeedDialIcon, 
    Close as CrossIcon, 
    ArticleOutlined as LessonIcon,
    MenuBookOutlined as ChapterIcon, 
    CloudUploadOutlined as UploadIcon, 
    RefreshOutlined as RefreshIcon, 
    AddOutlined as AddIcon, 
    RemoveCircleOutlined as RemoveIcon,
    QuizOutlined as QuestionIcon,    
} from '@mui/icons-material'; 
import PropTypes from 'prop-types';

// const tabSections = tabs;

const Dashboard = (props) => {
    const [error, setError] = useState("")
    const [chapterList, setChapterList] = useState([]);
    const [chaptersRetrieved, setChaptersRetrieved] = useState(false)
    const [lessonContentRetrieved, setLessonContentRetrieved] = useState(false)
    const [playgroundQuestionsRetrieved, setPlaygroundQuestionsRetrieved] = useState(false)
    const [selectedChapter, setSelectedChapter] = useState(chapterObj)
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [selectedPlaygroundQuestion, setSelectedPlaygroundQuestion] = useState(null)
    const [originalLessonContent, setOriginalLessonContent] = useState(null)
    const [updatedLesson, setUpdatedLesson] = useState(null)
    const [lessonContentList, setLessonContentList] = useState(null)
    const [isCreatingChapter, setIsCreatingChapter] = useState(true)
    const [openTab, setOpenTab] = useState(0);
    const [sampleImg, setSampleImg] = useState(null)
    const [profileDetails, setProfileDetails] = useState(userObject)
    const {currentUser, currentUsername, getUserProfileDetails, logout} = useAuth()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const [showLoadingOverlay, setShowLoadingOverlay] = useState(false)
    const [showPromptDialog, setShowPromptDialog] = useState(false)
    const [dialogTitleText, setDialogTitleText] = useState('')
    const [dialogDescText, setDialogDescText] = useState('')

    // playgroundEditor state vars
    const [mcqChecked, setMcqChecked] = useState([0]);

    const history = useHistory()
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // bool flag representing dark mode preference in browser.


    // put temp state variables here, for testing 

    // calls logout handler
    const handleLogout = dashboardViewModel.logoutHandler(setError, logout, history)    

    // function that gets the chapters associated to the currently logged in user
    const getAuthorsChapters = dashboardViewModel.retrieveChapters(setChapterList, setChaptersRetrieved, profileDetails)

    // function that gets the lessons associated to the currently chosen chapter (chosen chapter specified in selectedChapter state)
    const getChapterLessons = dashboardViewModel.getCurrChapterLessons(selectedChapter, setSelectedChapter, setLessonContentRetrieved, setShowLoadingOverlay)

    // funciton that gets the chapter's playground questions
    const getPlaygroundQuestions = dashboardViewModel.getChapterPlaygroundQuestions(selectedChapter, setSelectedChapter, setPlaygroundQuestionsRetrieved, setShowLoadingOverlay)

    /* 
    function that is triggered when a chapter tile on the right panel is clicked. 
    Retrieves chapter into and is set in selectedChapter state variable
    */
    const getChapter = dashboardViewModel.getSelectedChapterDetails(setLessonContentRetrieved, setPlaygroundQuestionsRetrieved, setSelectedChapter, setOpenTab, setSelectedLesson, setSelectedPlaygroundQuestion, setIsCreatingChapter, setShowLoadingOverlay, setDrawerOpen, setShowPromptDialog, setDialogTitleText, setDialogDescText)

    // general purpose text input handler that updates different text state variables appropriately
    const onInputChange = dashboardViewModel.dashboardTextInputHandler(selectedChapter, setSelectedChapter, selectedLesson, setSelectedLesson)

    // mini function that just clears states that are related to chapter editor panel
    const resetChapterStates = dashboardViewModel.resetChaptersAndLessons(setSelectedChapter, setSelectedLesson, setLessonContentRetrieved, setSelectedPlaygroundQuestion, setPlaygroundQuestionsRetrieved, setOriginalLessonContent, setLessonContentList, setIsCreatingChapter, setOpenTab)

    // creates a blank lesson and adds it to the chapter's lesson list
    const createBlankLesson = dashboardViewModel.generateNewLesson(isCreatingChapter, selectedChapter, setSelectedChapter, setSelectedLesson, setOriginalLessonContent)

    // Function that publishes the chapter
    const publishChapter = dashboardViewModel.generateAndPublishChapter( resetChapterStates, getAuthorsChapters, isCreatingChapter)

    // function to delete selected playground question
    const deletePlaygroundQuestion = dashboardViewModel.deletePlaygroundQuestion(selectedChapter, setShowLoadingOverlay, setShowPromptDialog, setDialogDescText, setDialogTitleText)

    //function to delete selecgted lesson
    const deleteLesson = dashboardViewModel.deleteLesson(selectedChapter, setShowLoadingOverlay, setShowPromptDialog, setDialogDescText, setDialogTitleText)

    // function to delete selcted chapter
    const deleteChapter = dashboardViewModel.deleteChapter(selectedChapter, setShowLoadingOverlay, setShowPromptDialog, setDialogDescText, setDialogTitleText)

    // function used to insert new content into existing lessons.
    const insertContent = dashboardViewModel.insertAndDeleteBlocks(selectedLesson, setSelectedLesson, sampleImg)

    // TODO: REMOVE THIS
    // handler that triggers when a lesson is selected from the dropdown in the second tab of the editor panel
    const onLessonSelect = (e) => {
        let lessonId = e.target.value;
        if(lessonId !== ""){
            var chosenLesson = selectedChapter.lessons.find(lesson => lesson.lesson_id === lessonId)
            setSelectedLesson(chosenLesson)
            setOriginalLessonContent(chosenLesson)
        }
    }

    // rendering a list of chapter cards to display them on right panel of website
    const chapterCards = renderChapterCards(chapterList, getChapter)

    // render tabs for the editor panel and store them in constant
    // const tabs = renderTabs(openTab, setOpenTab, selectedChapter, selectedLesson, lessonContentRetrieved, getChapterLessons)


    // Grabs file from computer
    const fileSelectedHandler = async (event, content_index) => {
        // event.preventDefault();
        let selectedFile = event.target.files[0]
        console.log(content_index)
        // console.log(await getBase64(selectedFile))
        let tempLesson = {...selectedLesson}
        console.log(tempLesson)
        if (selectedFile != null){
            try{
                var imageData = await getBase64(selectedFile);
                tempLesson.lesson_content[content_index] = imageData;
                console.log(tempLesson)
                // used a state variable called updatedLesson. used its associated function (setUpdatedLesson) to set the value of the updated lesson
              setSelectedLesson(tempLesson)
                renderLessonContent()
            }
            catch(err) {
                console.log("error uploading data")
            }
        }
    }

    // Function that converts file to base64
    function getBase64(file) {
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => resolve(reader.result);
          reader.onerror = error => reject(error);
        });
      }

    // convert image url (from online) to base64 format
    const getBase64FromUrl = async (url) => {
        const data = await fetch(url);
        const blob = await data.blob();
        return new Promise((resolve) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob); 
          reader.onloadend = () => {
            const base64data = reader.result;   
            resolve(base64data);
          }
        });
    }

    // function to render lesson content in html form
    const renderLessonContent = renderingLessonList(selectedLesson, insertContent, fileSelectedHandler, onInputChange, setLessonContentList)

    const closeUserPromptDialog = () => {
        setShowPromptDialog(false)
    }

    // const resetStudentProgress = dashboardViewModel.resetStudentPlaygroundProgress()

    // function called when the publish button is pressed
    const handlePublishAction = (profileDetails, selectedChapter, publishChapter, setShowPromptDialog, setDialogTitleText, setDialogDescText) => {
        let authorName = profileDetails.username;
    
        let publishMode = "add";
        if (selectedChapter.chapter_id != "") {
            publishMode = "update";
        }
    
        let publishPromise = publishChapter(selectedChapter, publishMode, authorName);
        publishPromise.then((res) => {
            console.log(res);
            if (res == 'CHAPTER_TITLE_MISSING') {
                setShowPromptDialog(true);
                setDialogTitleText('Chapter title missing!!');
                setDialogDescText('You forgot to include a title for the chapter...');
            }
            else if (res == 'CHAPTER_DESC_MISSING') {
                setShowPromptDialog(true);
                setDialogTitleText('Empty chapter description!!');
                setDialogDescText('Make sure to include a brief summary of this chapter.');
            }
            else if (res == 'CHAPTER_UPLOAD_FAILED') {
                setShowPromptDialog(true);
                setDialogTitleText('Chapter upload failed!!');
                setDialogDescText('Contact an admin');
            }
            else if (res == 'CHAPTER_PUBLISHED' || res == 'CHAPTER_UPDATED') {
                setShowPromptDialog(true);
                setDialogTitleText('Chapter has been published!');
                setDialogDescText(' ');
            }
        });
    }
    
    const resetLesson = () => {
        console.log("resetting changes")
        console.log(originalLessonContent)
        setSelectedLesson(originalLessonContent)
    }
    

    /*
        USE EFFECT HOOKS
        used to trigger something when a change to a state variable occurs
    */

    // acts as a component onMount method. triggers when the website and all its state variables initialize for the first time
    useEffect(async()=>{ 
        console.log(currentUser.email)
        console.log(currentUsername) // TODO: set the email's associated username trough a profile menu
        // if a currentUser exists (logged in)
        
        try {
            let response = await getUserProfileDetails(currentUser.email)
            setProfileDetails(response.userDetails)
        }
        catch(err){
            console.log("Error when executing getUserProfile function")
            console.log(err)
            setProfileDetails(null)
        }

        if(currentUser && chapterList.length === 0){
            // getAuthorsChapters(false)
        }

        getBase64FromUrl('https://pbs.twimg.com/profile_images/1026981625291190272/35O2KIRX_400x400.jpg')
        .then(res => {
            console.log(res)
            setSampleImg(res)
        })
        
    },[])


    useEffect(() => {
      return () => {
        if(profileDetails && profileDetails.country != '') {
            console.log('USER DETAILS')
            console.log(profileDetails)
        }
        else if(profileDetails.country == '') {
            console.log("its still blank user object.")
        }
        else {
            console.log('USER DETAILS ARE NULL. MEANS FUNCTION TO GET PROFILE DETAILS FAILED.')
        }
      };
    }, [profileDetails])

    // triggers following code when selectedChapter state variable changes in value at any point
    useEffect(() => {
        console.log(selectedChapter)
    }, [selectedChapter])

    /* only render lesson content when lesson is selected or update, 
     except when the selectedLesson state is set to null when the page is being rendered for the first tiem */
    useEffect(() => {
        if(selectedLesson){
            console.log("this is happening on lesson reset")
            renderLessonContent()
            console.log("lesson content re-rendered")
            console.log(selectedLesson)
        }
    }, [selectedLesson])

    // triggers following code when isCreatingChapter state variable changes in value at any point
    useEffect(() => {
        console.log(isCreatingChapter)
    }, [isCreatingChapter])

    // triggers following code when originalLessonContent state variable changes in value at any point
    useEffect(() => {
        console.log(originalLessonContent)
    }, [originalLessonContent])

    
    /* TEMP STUFF */
    const Panel = styled(Paper)(({theme}) => ({
        backgroundColor: prefersDarkMode ? '#262b32' : '#e6e6e6',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        // marginTop: theme.spacing(5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }))


    // this returns the JSX/HTML code that is responsible for rendering the main editor interface
    return (
      <>
        <ThemeProvider theme={props.theme} >
            <CssBaseline />
            
            {/* This container is only displayed if window size is less than large */}
            <Container maxWidth={false} fixed={false} sx={{...(useMediaQuery(props.theme.breakpoints.up('lg')) && { display: 'none' } ), minHeight: '100vh'}} >
                <Typography sx={{mt: 2, mb: 3, pl: '5%', textAlign: 'center', position: 'absolute', top: '30%'}} variant={'h5'}>Please increase your window size or use a desktop browser</Typography>
            </Container>

            {/* The editor is only displayed if the window size is large or greater */}
            <Container maxWidth={false} fixed={false} sx={{...(!useMediaQuery(props.theme.breakpoints.up('lg')) && { display: 'none' })}} >
                <Box >
                    {/* Loading screen overlay visible only when certain things are loading */}
                    <Backdrop
                        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
                        open={showLoadingOverlay}
                    >
                        <CircularProgress color="inherit" />
                    </Backdrop>

                    <UserPromptDialog 
                        open={showPromptDialog}      
                        onClose={closeUserPromptDialog}
                        dialogTitle={dialogTitleText}
                        dialogDesc={dialogDescText}
                    />

                    {/* nav bar on the top */}
                    <SwiftlyAppBar handleLogout={handleLogout} profileDetails={profileDetails} />

                    {/* Chapter drawer */}
                    <ChapterDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} chapterCards={chapterCards} getAuthorsChapters={getAuthorsChapters} />
                    
                    {/* Title and chapter drawer button */}
                    <Box sx={{display: 'flex', flexDirection: 'row', p: 1, m: 1}}>
                       
                        {/* Title */}
                        <Box sx={{ width: '95%'}}>
                            <Typography sx={{mt: 2, mb: 3, pl: '15%', textAlign: 'center'}} variant={'h5'}>Editing panel</Typography>
                        </Box>

                        {/* open button for chapter drawer */}
                        <Box sx={{  width: '5%', display: 'flex', justifyContent: 'flex-end'}} >
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={() => { 
                                    if(!chaptersRetrieved){
                                        console.log("chapter hasn't been retrieved yet. retrieving chapters...")
                                        getAuthorsChapters()
                                    }
                                    else if(chaptersRetrieved){
                                        console.log("chapter already retrieved.")
                                    }
                                    setDrawerOpen(true) 
                                }}
                                sx={{ px: 3}}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        
                    </Box>
                    

                    {/* Editor panel box */}
                    <Box sx={{ display: 'flex', flexGrow: 1, minHeight: '77vh', justifyContent: 'center', bgcolor: '#1c1e26',  p: 1, m: 1}}>

                        {/* Tab pickers */}
                        <Tabs orientation='vertical' variant='scrollable' aria-label="editing tabs" sx={{borderRight: 1, borderColor: 'divider', width: '11%'}} value={openTab} 
                            onChange={(e, newValue) => {
                                // TODO: extract to separate handler function
                                setOpenTab(newValue);
                                // if selectedChapter not null, download lessons for that chapter
                                if(newValue == 1 && selectedChapter.chapter_id != "") {
                                    // but only download lessons if they havent been fetched already
                                    if(!lessonContentRetrieved){
                                        console.log("loading the lesson options")
                                        getChapterLessons()
                                    }
                                }
                                else if(newValue == 2 && selectedChapter.chapter_id != "") {
                                    // only download playground questions if they werent fetched already
                                    if(!playgroundQuestionsRetrieved){
                                        console.log("loading the playground questions")
                                        getPlaygroundQuestions()
                                    }
                                }
                            }} 
                        >
                            <Tab label="Summary"></Tab>
                            <Tab label="Lessons"></Tab>
                            <Tab label="Playground"></Tab>
                        </Tabs>
                        
                        {/* summary tab form  */}
                        {openTab === 0 && (
                            <ChapterSummaryForm onInputChange={onInputChange} selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter} deleteChapter={deleteChapter} />
                        )}
                        {openTab === 1 && (
                            <ChapterLessonForm onInputChange={onInputChange} selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter} selectedLesson={selectedLesson} setSelectedLesson={setSelectedLesson} originalLessonContent={originalLessonContent} setOriginalLessonContent={setOriginalLessonContent} lessonContentList={lessonContentList} deleteLesson={deleteLesson}/>
                        )}
                        {openTab === 2 && (
                            <PlaygroundEditor selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter} selectedPlaygroundQuestion={selectedPlaygroundQuestion} setSelectedPlaygroundQuestion={setSelectedPlaygroundQuestion} mcqChecked={mcqChecked} setMcqChecked={setMcqChecked} deletePlaygroundQuestion={deletePlaygroundQuestion}/>
                        )}
                        
                         {/* TODO: Extract speed dial as seperate component. */}
                        {/*  Floating button that has options to create new chapter or lesson */}
                        <SpeedDial
                            ariaLabel="Create speedDial"
                            sx={{ position: 'absolute', bottom: '15vh', left: '3vw' }}
                            icon={<SpeedDialIcon />}
                            direction={'up'}
                        >
                            <SpeedDialAction
                                icon={<ChapterIcon/>}
                                tooltipTitle={'Create new chapter'}
                                onClick={resetChapterStates}
                            />
                            <SpeedDialAction
                                icon={<LessonIcon/>}
                                tooltipTitle={'Create mew lesson'}
                                onClick={() => {
                                    createBlankLesson()
                                    setOpenTab(1)
                                }}
                            />
                            <SpeedDialAction
                                icon={<QuestionIcon/>}
                                tooltipTitle={'Create new question'}
                                onClick={() => {
                                    setSelectedPlaygroundQuestion(null)
                                    setOpenTab(2)
                                }}
                            />
                        </SpeedDial>

                        {/* Publish chapter button */}
                        <Fab 
                            variant="extended" 
                            size='medium' 
                            color="success" 
                            sx={{position: 'absolute', bottom: '7vh', left: '3vw'}} 
                            aria-label="upload"
                            onClick={()=>{
                                handlePublishAction(profileDetails, selectedChapter, publishChapter, setShowPromptDialog, setDialogTitleText, setDialogDescText);
                                // console.log(selectedChapter)
                            }
                            }
                        >
                            <UploadIcon sx={{mr: 1}}/>
                            Publish
                        </Fab>

                    
                    </Box>
                    
                </Box>

            </Container>
        </ThemeProvider>

      </>
    );
}

export default Dashboard


