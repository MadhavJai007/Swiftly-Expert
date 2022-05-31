import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { collection, doc, setDoc, getDocs, getDoc, addDoc, listCollections } from 'firebase/firestore'
import {db} from '../firebase';

import { chapterObj, templateLesson} from './models/chapterModel';
import { renderingLessonList } from './widgets/LessonList';
import { renderTabs } from './widgets/Tabs';
import SwiftlyAppBar from './widgets/SwiftlyAppBar';
import { renderChapterCards } from './widgets/ChapterCards';
import * as dashboardViewModel from './viewmodels/DashboardViewModel';
import { Container, Box, Paper, Grid, useMediaQuery, CssBaseline, AppBar, IconButton, Typography, SpeedDialAction, Divider, Drawer } from '@mui/material';
import SpeedDial, { SpeedDialProps } from '@mui/material/SpeedDial';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { Menu as MenuIcon, Add as SpeedDialIcon, Close as CrossIcon, ArticleOutlined as LessonIcon, MenuBookOutlined as ChapterIcon, Refresh } from '@mui/icons-material'; 
import { width } from '@mui/system';
// import Tabs from './widgets/Tabs';

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
    const [openTab, setOpenTab] = useState(1);
    const [sampleImg, setSampleImg] = useState(null)
    const {currentUser, logout} = useAuth()
    const [drawerOpen, setDrawerOpen] = useState(false)
    const history = useHistory()
    const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)'); // bool flag representing dark mode preference in browser.

    // calls logout handler
    const handleLogout = dashboardViewModel.logoutHandler(setError, logout, history)    

    // function that gets the chapters associated to the currently logged in user
    const getAuthorsChapters = dashboardViewModel.retrieveChapters(setChapterList, setChaptersRetrieved)

    // function that gets the lessons associated to the currently chosen chapter (chosen chapter specified in selectedChapter state)
    const getChapterLessons = dashboardViewModel.getCurrChapterLessons(selectedChapter, setSelectedChapter, setLessonContentRetrieved)

    /* 
    function that is triggered when a chapter tile on the right panel is clicked. 
    Retrieves metadata of the chapter and stores it in selectedChapter state variable
    */
    const getChapter = dashboardViewModel.getSelectedChapterDetails(setLessonContentRetrieved, setSelectedChapter, setOpenTab, setSelectedLesson, setIsCreatingChapter)

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
    const tabs = renderTabs(openTab, setOpenTab, selectedChapter, selectedLesson, lessonContentRetrieved, getChapterLessons)

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

    // chapter drawer
    

    const handleDrawerOpen = () => {
        setDrawerOpen(true);
    };

    const handleDrawerClose = () => {
        setDrawerOpen(false);
    };

    // speed dial options
    const actions = [
        { icon: <ChapterIcon />, name: 'Add Chapter' },
        { icon: <LessonIcon />, name: 'Add Lesson' },
    ];

    const Panel = styled(Paper)(({theme}) => ({
        backgroundColor: prefersDarkMode ? '#262b32' : '#e6e6e6',
        ...theme.typography.body2,
        padding: theme.spacing(1),
        // marginTop: theme.spacing(5),
        textAlign: 'center',
        color: theme.palette.text.secondary,
    }))

    // this returns the JSX/HTML code that is responsible for rendering the website
    return (
      <>
        <ThemeProvider theme={props.theme} >
            <Container maxWidth={false} fixed={false}>
                <Box >
                    <CssBaseline />
                    <SwiftlyAppBar/>

                    {/* Chapter drawer */}
                    <Drawer open={drawerOpen} anchor={'right'}>
                        
                        <Box sx={{display: 'flex', width: 480 } }>
                            {/* Close drawer and refresh button button */}
                            <Box sx={{ backgroundColor: '#0eb67b', display: 'flex', flexDirection: 'row', width: '100%', justifyContent: "space-between", mx: 'auto', alignItems: 'center'}}>
                                <IconButton
                                    color="inherit"
                                    aria-label="close drawer"
                                    
                                    onClick={handleDrawerClose}
                                    sx={{ ...(!drawerOpen && { display: 'none' }), width: 40, p: 2.5 }}
                                >
                                    <CrossIcon/>
                                </IconButton>
                                <Typography variant='h5' component={'h4'}>
                                    Your chapters
                                </Typography>
                                <IconButton
                                    color="inherit"
                                    aria-label="refresh drawer"
                                    
                                    onClick={handleDrawerClose}
                                    sx={{ ...(!drawerOpen && { display: 'none' }), width: 40, p: 2.5}}
                                >
                                    <Refresh/>
                                </IconButton>
                            </Box>
                            
                            <Box>

                            </Box>
                        </Box>
                    </Drawer>
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

                    {/* open button for chapter drawer */}
                    <IconButton
                        color="inherit"
                        aria-label="open drawer"
                        edge="end"
                        onClick={handleDrawerOpen}
                        sx={{ ...(drawerOpen && { display: 'none' }) }}
                    >
                        <MenuIcon />
                    </IconButton>


                    {/* TODO: Extract speed dial as seperate component. */}
                    <Box sx={{ position: 'relative', mt: 3, height: 320}}>
                        <SpeedDial
                            ariaLabel="Create speedDial"
                            sx={{ position: 'absolute', bottom: 16, left: 16 }}
                            icon={<SpeedDialIcon openIcon={<CrossIcon/>} />}
                            direction={'up'}
                        >
                            {actions.map((action) => (
                                <SpeedDialAction
                                key={action.name}
                                icon={action.icon}
                                tooltipTitle={"action.name"}
                                />
                            ))}
                        </SpeedDial>
                    </Box>

                </Box>
                
                <div className="flex flex-col space-y-4 bg-darkCustom">
                    <div className="flex justify-between pt-16 mb-0 mx-3">
                        <div className="text-2xl">
                            <p className="text-white">Currently logged in as: <strong> {JSON.stringify(currentUser.displayName)} </strong></p>
                        </div>
                        
                        <div className="text-2xl font-extrabold pb-5">
                            <button type="log out" onClick={handleLogout} className=" py-2 px-4 flex justify-center items-center shadow-lg bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                </svg>
                            Logout
                            </button>
                        </div>
                    </div>
                    <div className="flex flex-row space-x-4 m-3 h-screen pt-16 ">
                        <div className="w-3/4 h-5/6 rounded-l-md  bg-gray-300 overflow-auto">
                            <div className="font-sans text-center p-3 font-bold ">
                                <div className="text-2xl my-7">Editing panel</div>

                                {/* <Tabs color="red" /> */}

                                <div className="flex flex-wrap">
                                    <div className="w-full">
                                        <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row">
                                            {tabs}
                                        </ul>
                                    </div>
                                </div>

                                <div className={"flex flex-col items-center justify-center font-bold space-y-6 pt-5 " + (openTab === 1 ? "block" : "hidden")}>
                                    <div className="flex flex-row space-x-6">
                                        <div className="relative w-40">
                                            <label  className="text-gray-700">
                                                Chapter number
                                            </label>
                                            <input type="text" id="chapter-num" disabled={true} value={selectedChapter.chapter_number} name="chapter_num" placeholder="Not needed" className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-gray-200 text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" />
                                        </div>

                                        <div className="relative ">
                                            <label  className="text-gray-700">
                                                Chapter title
                                            </label>
                                            <input type="text" id="chapter-title" value={selectedChapter.chapter_title}  onChange={(e) => onInputChange(e, 'chapter', 'chapter_title', 0)} className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="chapter_title" placeholder="Enter a title"/>
                                        </div>
                                        
                                        <div className="relative w-40">
                                            <label className="text-gray-700">
                                                Subscription code
                                            </label>
                                            <input type="text" id="sub-code" value={selectedChapter.subscription_code}  onChange={(e) => onInputChange(e, 'chapter','subscription_code', 0)} className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="sub_code" placeholder="Enter a code"/>
                                        </div>
                                    </div>
                                    
                                    <div>
                                        <label className="text-gray-700"  >
                                        Chapter Description
                                        </label>
                                        <textarea value={selectedChapter.chapter_desc} onChange={(e) => onInputChange(e, 'chapter','chapter_desc', 0)} className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" id="chapter-desc" placeholder="Enter chapter description" name="chapter_desc" rows="5" cols="40">
                                        </textarea>
                                    </div>

                                    <div>
                                        <label className="text-gray-700" >
                                            Chapter length: {`~ ${selectedChapter.chapter_length} minutes`}
                                        </label>
                                        <br/>
                                        {/* <input type="range" min="1" max="120" value="50" className="slider" id="chapter-length" /> */}
                                        <input id="chapter-length" type="range" min="1" max="120" step="1" value={selectedChapter.chapter_length} onChange={(e) => onInputChange(e, 'chapter', 'chapter_length', 0)} className="rounded-lg overflow-hidden appearance-none py-2 my-4 bg-gray-400 h-3 w-96"/>
                                    </div>

                                    <div>
                                        <label className="text-gray-700" >
                                            Chapter Difficulty: {selectedChapter.chapter_difficulty < 3 ? (selectedChapter.chapter_difficulty < 2 ? "Easy" : "Medium") : "Hard"}
                                        </label>
                                        <br/>
                                        {/* <input type="range" min="1" max="120" value="50" className="slider" id="chapter-length" /> */}
                                        <input id="chapter-diff" type="range" min="1" max="3" step="1" value={selectedChapter.chapter_difficulty} onChange={(e) => onInputChange(e, 'chapter','chapter_difficulty', 0)} className="rounded-lg overflow-hidden appearance-none py-2 my-4 bg-gray-400 h-3 w-96"/>
                                    </div>
                                </div>
                                
                                <div className= {"flex flex-row " + (openTab === 2 ? "block" : "hidden")}>
                                    <div className="shadow-lg mb-8 pl-3 w-1/4 h-5/6 rounded-l-md bg-green-500 overflow-auto"> 
                                        <div className=" text-2xl my-7 text-left ">Lessons</div>
                                            <select id="lessons" onChange={(e)=>{
                                                    onLessonSelect(e);
                                                }} className="block mb-8 w-52 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" name="lessons">
                                                <option value="">
                                                    Select a lesson
                                                </option>
                                                {lessonOptions}
                                            </select>
                                        
                                    </div>
                                    <div className=" w-3/4 h-full rounded-r-md bg-gray-300 overflow-auto">
                                        {selectedLesson ? 
                                            <div className="font-sans space-y-6 items-center p-3">
                                                <div className="flex flex-row justify-center space-x-6">
                                                    <div className="w-40 text-xl" >
                                                        <label  className="text-gray-700">
                                                            Lesson ID
                                                        </label>
                                                        <input type="text" id="chapter-title" value={selectedLesson.lesson_id}  disabled={true} className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="lesson_title" placeholder="Enter a title"/>
                                                    </div>
                                                    <div className="w-72 text-xl" >
                                                        <label  className="text-gray-700">
                                                            Lesson title
                                                        </label>
                                                        <input type="text" id="chapter-title" value={selectedLesson.lesson_title}  onChange={(e) => onInputChange(e, 'lesson','lesson_title', 0)} className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="lesson_title" placeholder="Enter a title"/>
                                                    </div>
                                                    <div className="pt-7">
                                                        <button onClick={() => {
                                                                console.log(selectedChapter)
                                                                console.log(selectedLesson)
                                                            }
                                                        } 
                                                            className="py-2 px-4 flex justify-center items-center bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                                                        >
                                                            Reset
                                                        </button>
                                                    </div>
                                    
                                                </div>
                                                <div className="space-y-9">
                                                    
                                                    {lessonContentList}
                                                </div>
                                            </div>
                                            :
                                            <div className="font-sans text-center p-3 font-bold text-xl">
                                                {"Select a lesson"}
                                            </div>
                                        }
                                    </div>
                                    
                                </div>

                                <div className="w-40 static ">

                                    {openTab == 2 ? 
                                    <div className="text-2xl font-extrabold pb-5">
                                        <button onClick={() => {
                                                    // create a template lesson object and set it as selectedLesson
                                                    createBlankLesson()
                                                }
                                            } className=" py-2 px-4 flex justify-center items-center bg-purple-500 hover:bg-purple-700 focus:ring-purple-500 focus:ring-offset-purple-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                            </svg>
                                            Create lesson
                                        </button>
                                    </div>
                                    :
                                    <br/>
                                    }

                                    <div className="text-2xl font-extrabold pb-5">
                                        <button onClick={() => {
                                                // mini function that just clears states that are related to chapter editor panel
                                                resetChapterStates()
                                            }
                                        } className=" py-2 px-4 flex justify-center items-center bg-blue-500 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        Create Chapter
                                        </button>
                                    </div>
                                    <button type="button" onClick={() => {

                                        // If selected chapter is not an empty string --> then user is updating a chapter
                                        if (selectedChapter.chapter_id != ""){
                                            publishChapter(selectedChapter, "update") //(selectedChapter.chapter_id, selectedChapter.chapter_number,selectedChapter.chapter_title, selectedChapter.subscription_code, selectedChapter.chapter_desc, selectedChapter.chapter_length, selectedChapter.chapter_difficulty, selectedChapter.lessons)
                                        // Else, then user is creating a new chapter                                    
                                        }else{
                                            console.log("chapter id is empty")
                                            console.log("adding new chapter to firebase")
                                            publishChapter(selectedChapter, "add")
                                        }

                                    }} className=" py-2 px-4 flex justify-center items-center shadow-lg bg-green-500 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                        <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z">
                                            </path>
                                        </svg>
                                        Upload
                                    </button>
                                </div>
                            </div>

                            
                        </div>
                        <div className="w-1/4 h-5/6 rounded-r-md bg-gray-300 overflow-auto">
                            <div className="font-sans text-center p-3 font-bold text-2xl">
                                Your Chapters
                                <div className="flex flex-col justify-center items-stretch text-2xl font-bold space-y-4 pt-5 ">
                                    {/* Renders the chapter cards only whern chapters have been retrieved from firestore. otherwise show "loading" */}
                                    {chapterCards.length > 0 ? chapterCards : "Loading chapters..."}
                                </div>
                            </div>
                        </div>
                    </div>
                <div className="">
                
                    
                    
                </div>
                
                
                </div>
            </Container>
        </ThemeProvider>

      </>
    );
}

export default Dashboard
