

import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { collection, doc, setDoc, getDocs, getDoc, addDoc, listCollections } from 'firebase/firestore'
import {db} from '../firebase';

import { chapterObj, templateLesson} from './models/chapterModel';
import { renderingLessonList } from './widgets/LessonList';
import ChapterSummaryForm from './widgets/ChapterSummaryForm';
import ChapterDrawer from './widgets/ChapterDrawer';
import SwiftlyAppBar from './widgets/SwiftlyAppBar';
import { renderChapterCards } from './widgets/ChapterCards';
import * as dashboardViewModel from './viewmodels/DashboardViewModel';
import { Container, Box, Paper, Grid, useMediaQuery, CssBaseline, AppBar, IconButton, Typography, SpeedDialAction, useTheme, Tab, Tabs, Backdrop, CircularProgress } from '@mui/material';
import SpeedDial, { SpeedDialProps } from '@mui/material/SpeedDial';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Menu as MenuIcon, Add as SpeedDialIcon, Close as CrossIcon, ArticleOutlined as LessonIcon, MenuBookOutlined as ChapterIcon, Refresh } from '@mui/icons-material'; 
import PropTypes from 'prop-types';

// const tabSections = tabs;

const Dashboard = (props) => {
    const [error, setError] = useState("")
    const [chapterList, setChapterList] = useState([]);
    const [chaptersRetrieved, setChaptersRetrieved] = useState(false)
    const [lessonContentRetrieved, setLessonContentRetrieved] = useState(false)
    const [selectedChapter, setSelectedChapter] = useState(chapterObj)
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [originalLessonContent, setOriginalLessonContent] = useState(null)
    const [updatedLesson, setUpdatedLesson] = useState(null)
    const [lessonContentList, setLessonContentList] = useState(null)
    const [isCreatingChapter, setIsCreatingChapter] = useState(true)
    const [openTab, setOpenTab] = useState(0);
    const [sampleImg, setSampleImg] = useState(null)
    const {currentUser, logout} = useAuth()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const history = useHistory()
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // bool flag representing dark mode preference in browser.


    // temp state variables
    const [showLoadingOverlay, setShowLoadingOverlay] = useState(false)

    // calls logout handler
    const handleLogout = dashboardViewModel.logoutHandler(setError, logout, history)    

    // function that gets the chapters associated to the currently logged in user
    const getAuthorsChapters = dashboardViewModel.retrieveChapters(setChapterList, setChaptersRetrieved)

    // function that gets the lessons associated to the currently chosen chapter (chosen chapter specified in selectedChapter state)
    const getChapterLessons = dashboardViewModel.getCurrChapterLessons(selectedChapter, setSelectedChapter, setLessonContentRetrieved)

    /* 
    function that is triggered when a chapter tile on the right panel is clicked. 
    Retrieves chapter into and is set in selectedChapter state variable
    */
    const getChapter = dashboardViewModel.getSelectedChapterDetails(setLessonContentRetrieved, setSelectedChapter, setOpenTab, setSelectedLesson, setIsCreatingChapter, setShowLoadingOverlay, setDrawerOpen)

    // general purpose text input handler that updates different text state variables appropriately
    const onInputChange = dashboardViewModel.dashboardTextInputHandler(selectedChapter, setSelectedChapter, selectedLesson, setSelectedLesson)

    // mini function that just clears states that are related to chapter editor panel
    const resetChapterStates = dashboardViewModel.resetChaptersAndLessons(setSelectedChapter, setSelectedLesson, setLessonContentRetrieved, setOriginalLessonContent, setLessonContentList, setIsCreatingChapter, setOpenTab)

    // creates a blank lesson and adds it to the chapter's lesson list
    const createBlankLesson = dashboardViewModel.generateNewLesson(isCreatingChapter, selectedChapter, setSelectedChapter, setSelectedLesson)

    // Function that publishes the chapter
    const publishChapter = dashboardViewModel.generateAndPublishChapter(chapterList, resetChapterStates, getAuthorsChapters, isCreatingChapter)

    // function used to insert new content into existing lessons.
    const insertContent = dashboardViewModel.insertAndDeleteBlocks(selectedLesson, setSelectedLesson, sampleImg)

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

    // renders the options for the lesson selector dropdown
    const lessonOptions = selectedChapter.lessons.map(lesson => {
        return <option key={lesson.lesson_id} value={lesson.lesson_id}>
            {lesson.lesson_title}
        </option>
    })


    // Grabs file from computer
    const fileSelectedHandler = async (event, content_index) => {
        event.preventDefault();
        let selectedFile = event.target.files[0] 
        let tempLesson = {...selectedLesson}
        if (selectedFile != null){
            try{
                var imageData = await getBase64(selectedFile);
                tempLesson.lesson_content[content_index] = imageData;
                // used a state variable called updatedLesson. used its associated function (setUpdatedLesson) to set the value of the updated lesson
                setUpdatedLesson(tempLesson);
                console.log(selectedLesson)
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
    useEffect(()=>{ 
        console.log(currentUser.email)
        // if a currentUser exists (logged in)
        
        if(currentUser && chapterList.length === 0){
            getAuthorsChapters(false)
        }

        getBase64FromUrl('https://pbs.twimg.com/profile_images/1026981625291190272/35O2KIRX_400x400.jpg')
        .then(res => {
            console.log(res)
            setSampleImg(res)
        })
        
    },[])

    // triggers following code when selectedChapter state variable changes in value at any point
    useEffect(() => {
        console.log(selectedChapter)
    }, [selectedChapter])

    /* only render lesson content when lesson is selected or update, 
     except when the selectedLesson state is set to null when the page is being rendered for the first tiem */
    useEffect(() => {
        if(selectedLesson){
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

                    {/* nav bar on the top */}
                    <SwiftlyAppBar handleLogout={handleLogout} />

                    {/* Chapter drawer */}
                    <ChapterDrawer drawerOpen={drawerOpen} setDrawerOpen={setDrawerOpen} chapterCards={chapterCards}  />

                    {/* <Box
                    component="main"
                    sx={{
                        backgroundColor: (theme) => 
                        theme.palette.mode === 'dark'
                            ? theme.palette.grey[100]
                            : theme.palette.grey[900],
                        flexGrow: 1,
                        height: '90vh',
                        width: '50vw',
                        overflow: 'auto',
                        marginTop: 4
                    }}
                    ></Box> */}

                    {/* TODO: Extract speed dial as seperate component. */}
                    {/* <Box sx={{ position: 'relative', mt: 3, height: 320}}>
                    </Box> */}

                    
                    {/* Title and chapter drawer button */}
                    <Box sx={{display: 'flex', flexDirection: 'row', p: 1, m: 1}}>
                       
                        {/* Title */}
                        <Box sx={{ width: '95%'}}>
                            <Typography sx={{mt: 2, mb: 3, pl: '5%', textAlign: 'center'}} variant={'h5'}>Editing panel</Typography>
                        </Box>

                        {/* open button for chapter drawer */}
                        <Box sx={{  width: '5%', display: 'flex', justifyContent: 'flex-end'}} >
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="end"
                                onClick={() => setDrawerOpen(true)}
                                sx={{ px: 3}}
                            >
                                <MenuIcon />
                            </IconButton>
                        </Box>
                        
                    </Box>
                    

                    {/* Editor panel box */}
                    <Box sx={{ display: 'flex', flexGrow: 1, minHeight: '77vh', justifyContent: 'center', bgcolor: '#1c1e26',  p: 1, m: 1}}>

                        {/* Tab pickers */}
                        <Tabs orientation='vertical' variant='scrollable' aria-label="editing tabs" sx={{borderRight: 1, borderColor: 'divider'}} value={openTab} 
                            onChange={(e, newValue) => {
                                console.log(newValue);
                                setOpenTab(newValue);
                            }} 
                        >
                            <Tab label="Summary"></Tab>
                            <Tab label="Lessons"></Tab>
                            <Tab label="Playground"></Tab>
                        </Tabs>
                        
                        {/* summary tab form  */}
                        {openTab === 0 && (
                            <ChapterSummaryForm onInputChange={onInputChange} selectedChapter={selectedChapter} setSelectedChapter={setSelectedChapter} />
                        )}
                        {openTab === 1 && (
                            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, p: 1, m: 1, alignItems: 'center'}}>
                                <Typography>Update the lessons of the chapter</Typography>    
                                
                            </Box>
                        )}
                        {openTab === 2 && (
                            <Box sx={{display: 'flex', flexDirection: 'column', flexGrow: 1, p: 1, m: 1, alignItems: 'center'}}>
                                <Typography>Playground editor coming Soon ™</Typography>    
                            </Box>
                        )}
                        
                        {/*  Floating button that has options to create new chapter or lesson */}
                        <SpeedDial
                            ariaLabel="Create speedDial"
                            sx={{ position: 'absolute', bottom: '5vh', left: '70px' }}
                            icon={<SpeedDialIcon openIcon={<CrossIcon/>} />}
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
                            />
                            {/* {actions.map((action) => (
                                <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={action.name}
                                />
                            ))} */}
                        </SpeedDial>
                    
                    </Box>
                    
                </Box>

            </Container>
        </ThemeProvider>

      </>
    );
}

export default Dashboard
