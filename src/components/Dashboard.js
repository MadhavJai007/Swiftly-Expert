import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { collection, doc, setDoc, getDocs, getDoc, listCollections } from 'firebase/firestore'
import {db} from '../firebase';
// import Tabs from './widgets/Tabs';

const chapterObj = {
    chapter_id: "",
    chapter_title: "",
    chapter_desc: "",
    chapter_difficulty: 1,
    chapter_icon_name: "folder.circle",
    chapter_number: 0,
    chapter_length: 1,
    subscription_code: "N/A",
    chapter_author: "",
    lessons: [], // the lessons subcollection
    playground: [] // playgrounds subcollection
}

const tabSections = [
    {
        "number": 1,
        "tabTitle": "metadata"
    },
    {
        "number": 2,
        "tabTitle": "lessons"
    },
    {
        "number": 3,
        "tabTitle": "playground"
    }
]

const Dashboard = () => {
    const [error, setError] = useState("")
    const [chapterList, setChapterList] = useState([]);
    const [chaptersRetrieved, setChaptersRetrieved] = useState(false)
    const [lessonContentRetrieved, setLessonContentRetrieved] = useState(false)
    const [selectedChapter, setSelectedChapter] = useState(chapterObj)
    const [selectedLesson, setSelectedLesson] = useState(null)
    const [originalLessonContent, setOriginalLessonContent] = useState(null)
    const [updatedLesson, setUpdatedLesson] = useState(null)
    const [lessonContentList, setLessonContentList] = useState(null)
    const [openTab, setOpenTab] = useState(1);
    const [sampleImg, setSampleImg] = useState(null)
    const {currentUser, logout} = useAuth()
    const history = useHistory()

    const handleLogout = async () => {
        setError('')

        try {
            await logout()
            history.push('/login')
        }
        catch {
            setError('Failed to log out')
        }
    }    

    const getAuthorsChapters = async (isRefreshing) => {
        // if(isRefreshing) {
        //     setChaptersRetrieved(false)
        // }
        const querySnapshot = await getDocs(collection(db, "Chapters"));
        let _chapterList = []
        querySnapshot.forEach(doc => {
            _chapterList.push({
                chapterId: doc.id,
                chapterNumber: doc.data()["chapter_number"],
                chapterTitle: doc.data()["chapter_title"],
                chapterDesc: doc.data()["chapter_desc"],
                chapterDiff: doc.data()["chapter_difficulty"],
                chapterLength: doc.data()["chapter_length"],
                chapterSubCode: doc.data()["subscription_code"],
                chapterAuth: doc.data()["author"]
            })
        })
        setChapterList(_chapterList)
        setChaptersRetrieved(true)
    }

    const getChapterLessons = async () => {
        let chapterDocRef = doc(db, "Chapters", selectedChapter.chapter_id)
        const querySnapshot = await getDocs(collection(chapterDocRef, "lessons"))
        let lessons = []
        querySnapshot.forEach(doc => {
            lessons.push({
                "lesson_id": doc.id,
                "lesson_title":  doc.data().lesson_content[0],
                "lesson_content": doc.data().lesson_content
            })
        })
        setSelectedChapter({...selectedChapter, lessons: lessons});
        setLessonContentRetrieved(true)
    }

    const getChapter = async (docId) => {
        setLessonContentRetrieved(false)
        setSelectedChapter(chapterObj)
        setOpenTab(1)
        const chapterDocRef = doc(db, "Chapters", docId);
        const chapterDocSnap = await getDoc(chapterDocRef);
        if(chapterDocSnap.exists()) {
            // console.log("Document data:", chapterDocSnap.data());
            // let chapterNum = chapterList.length + 1;
            // let chapterId;
            // if(chapterNum >= 100){
            //     chapterId = `chapter_${chapterNum}`;
            // }
            // else if(chapterNum >= 10) {
            //     chapterId = `chapter_0${chapterNum}`;
            // }
            // else {
            //     chapterId = `chapter_00${chapterNum}`;
            // }

            // creating temp copy of the empty chapter object
            console.log(docId)
            let _chapterObj = {...chapterObj};
            _chapterObj.chapter_id = docId
            _chapterObj.chapter_title = chapterDocSnap.data().chapter_title
            _chapterObj.chapter_desc = chapterDocSnap.data().chapter_desc
            _chapterObj.chapter_difficulty = chapterDocSnap.data().chapter_difficulty
            _chapterObj.chapter_icon_name = chapterDocSnap.data().chapter_icon_name
            _chapterObj.chapter_number = chapterDocSnap.data().chapter_number
            _chapterObj.chapter_length = chapterDocSnap.data().chapter_length
            _chapterObj.subscription_code = chapterDocSnap.data().subscription_code
            _chapterObj.chapter_author = chapterDocSnap.data().author

            // console.log(chapterDocSnap.data().author)

            setSelectedChapter(_chapterObj)
            setSelectedLesson(null)
            
        } else {
            // this shouldnt happen
            console.log("Requested document not found!!")
        }
    }

    const onInputChange = (e, type, input, index) => {
        e.preventDefault();
        if(type === "chapter" ){
            let _chapterObj = {...selectedChapter}
            _chapterObj[`${input}`] = e.target.value
            setSelectedChapter(_chapterObj)
        }
        else if(type === "lesson") {
            let _lessonObj = {...selectedLesson}
            // only updating lesson title property and first element in lesson content (which is also lesson title)
            if(input==='lesson_title') {
                _lessonObj[`${input}`] = e.target.value
                _lessonObj['lesson_content'][0] = e.target.value
            }
            // updating specified index in lesson content array inside the selectedLesson
            else if (input==='lesson_content'){
                _lessonObj[`${input}`][index] = e.target.value
            }
            setSelectedLesson(_lessonObj)
        }
    }

    const onLessonSelect = (e) => {
        let lessonId = e.target.value;
        if(lessonId !== ""){
            var chosenLesson = selectedChapter.lessons.find(lesson => lesson.lesson_id === lessonId)
            setSelectedLesson(chosenLesson)
            setOriginalLessonContent(chosenLesson)
        }
    }

    const chapterCards = chapterList.map(chapter => {
        return <button  key={chapter.chapterId} onClick={() => { getChapter(chapter.chapterId) }}>
            <div className="shadow-lg rounded-xl max-w-xs p-4 bg-white dark:bg-gray-800 relative overflow-hidden"> 
                <div className="w-full h-full block">
                    <p className="text-gray-800 dark:text-white text-xl font-bold mb-2">
                        {chapter["chapterTitle"]}
                    </p>
                    <p className="text-gray-400 dark:text-gray-300 text-sm font-medium mb-2">
                       Created by: {chapter.chapterAuth}
                    </p>
                    <p className="text-gray-400 dark:text-gray-300 text-xs font-medium mb-2">
                        Approx. length: {chapter["chapterLength"] + " mins"}
                    </p>
                    <div className="flex dark:text-gray-200 items-center justify-between">
                        <p className="font-semibold">
                            Difficulty:
                        </p>
                        <p className="font-bold">
                            {chapter.chapterDiff}
                        </p>
                    </div>
                    <div className="w-full h-2 bg-gray-400 rounded-full mt-3 mb-6">
                        <div className={`w-${chapter.chapterDiff}/3 h-full text-center text-xs text-white ${chapter.chapterDiff > 1 ? (chapter.chapterDiff > 2 ? `bg-red-400` : `bg-yellow-400` ) : `bg-green-400`} rounded-full`}/>
                    </div>
                </div>
            </div>
        </button>
    })

    const tabs = tabSections.map(tab => {
        return <li className="mx-2 flex-auto text-center" key={tab.number}>
            <a
            className={
                "text-xs font-bold px-5 py-3 shadow-lg rounded block leading-normal " +
                (openTab === tab.number
                ? "text-white bg-green-500"
                : "text-green-600 bg-white")
            }
            onClick={e => {
                e.preventDefault();
                setOpenTab(tab.number)

                console.log(selectedChapter)
                console.log(selectedLesson)
                // console.log(lessonOptions)

                // If going to lessons tab and chapter is not nil, download lessons
                if(tab.number === 2 && selectedChapter.chapter_id !== "") {
                    if(!lessonContentRetrieved) {
                        console.log("loading the lession content")
                        getChapterLessons()
                    }
                }
                
                // TODO: SCRAP THIS
                // If going to chapter tab, and selected chapter is not nil, clear lessons
                // else if (tab.number === 1 && selectedChapter.chapter_id !== "") {
                //     if(lessonContentRetrieved){

                //     } 
                //     setSelectedChapter({...selectedChapter, lessons: []});
                // }
            }}
            >
                {tab.tabTitle}
            </a>
        </li>
    })


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

    // Function that updates the chapter
    const updateChapter = async(chapter) => { //, chapterID, chapterNum ,chapterTitle, subCode, chapterDesc, chapterLen, chapterDiff, chaptLessons) => {
        //(selectedChapter.chapter_id, selectedChapter.chapter_number,selectedChapter.chapter_title, selectedChapter.subscription_code, selectedChapter.chapter_desc, selectedChapter.chapter_length, selectedChapter.chapter_difficulty, selectedChapter.lessons)
        console.log(chapter)
        // let returnCode;
        let chaptersRefDoc = doc(db, "Chapters", chapter.chapter_id);
        let lessonsRefCollection = collection(chaptersRefDoc, "lessons")

        let validInput = true
        let chapterLength = parseInt(chapter.chapter_length)
        let chapterDifficulty = parseInt(chapter.chapter_difficulty)

        // Checking if chapter title and desc are not empty
        if (chapter.chapter_title.trim() == ""){
            validInput = false
        }

        if (chapter.chapter_desc.trim() == ""){
            validInput = false
        }

        // Only update doc if the data is valid
        if (validInput == true){
            var _chapter = chapter;
            // _chapter.lessons = selectedLesson;

            // console.log(_chapter);

            // TODO: check if user wants to upload just general info from metadata page, just lessons from lessons page or everything

            // for now upload everything

            await setDoc(chaptersRefDoc, {
                    "chapter_desc": chapter.chapter_desc,
                    "chapter_number": chapter.chapter_number,
                    "chapter_difficulty": chapterDifficulty,
                    "chapter_icon_name": "character.book.closed",
                    "chapter_length": chapterLength,
                    "chapter_title": chapter.chapter_title,
                    "subscription_code": chapter.subscription_code
                })
                .then(res => {
                    console.log(res);
                })
                .catch(err => {
                    // TODO: identify possible error code. None found so far
                    console.log(err); 
                    console.log({"code": "UNEXPECTED_UPLOAD_ERR", "details": "unexpected sign up error. contact an administrator. check console for more details"})
                })


            let chaptLessons = _chapter.lessons
            // Looping over each lesson and writing it to the lessons collection
            for (var i = 0; i < chaptLessons.length; i++){

                // Grabbing the specific lessonn
                let lessonsRefDoc = doc(lessonsRefCollection, chaptLessons[i].lesson_id)
                
                try {
                    let updateLessonsOperation = await setDoc(lessonsRefDoc, {
                        "lesson_content": chaptLessons[i].lesson_content
                    })
                    console.log(updateLessonsOperation)
                }
                catch(err) {
                    console.log("updating lessons failed")
                }
            }    



            // console.log(_selectedChapter)
            // console.log(_selectedChapter.lessons)
            // // Only updating chapter stuff (if user selects chapter tab, chaptLessons = [], so length is 0)
            // if (chaptLessons.length == 0){

            //     console.log("Updating: General Chapter")

            //     await setDoc(chaptersRefDoc, {
            //         "chapter_desc": chapterDesc,
            //         "chapter_number": chapterNum,
            //         "chapter_difficulty": chapterDifficulty,
            //         "chapter_icon_name": "character.book.closed",
            //         "chapter_length": chapterLength,
            //         "chapter_title": chapterTitle,
            //         "subscription_code": subCode
            //     })
            //     .then(res => {
            //         // console.log(res);
            //         returnCode = res;
            //     })
            //     .catch(err => {
            //         // TODO: identify possible error code. None found so far
            //         console.log(err); 
            //         returnCode = {"code": "UNEXPECTED_SIGNUP_ERR", "details": "unexpected sign up error. contact an administrator. check console for more details"};
            //     })
            // }

            // // Updating lesson stuff (not complete)
            // else if (chaptLessons.length != 0){

            //     console.log("Updating: Chapter Lessons")

            //     // Getting the chapter
            //     let chapterRefDoc = doc(db, "Chapters", "chapter_006");

            //     // Getting lessons collection
            //     let lessonsRefCollection = collection(chapterRefDoc, "lessons")
                
            
                // // Looping over each lesson and writing it to the lessons collection
                // for (var i = 0; i < chaptLessons.length; i++){

                //     // Grabbing the specific lessonn
                //     let lessonsRefDoc = doc(lessonsRefCollection, chaptLessons[i].lesson_id)
        
                //     await setDoc(lessonsRefDoc, {
                //         "lesson_content": chaptLessons[i].lesson_content
                //     })
                // }    
            // }
        }
    }

    // function used to insert new content into existing lessons.
    const insertContent = (e, type, index, placement) => {
        e.preventDefault()
        let _lessonContentList;

        // placement is always "after the specified index" except when inserting content before the first piece.
        if(placement == "after"){
            index += 1
            console.log(index)
        }
        // if the type of content being inserted is a paragraph
        if(type === "para") {
            _lessonContentList = selectedLesson.lesson_content;
            // insert new string that will act as the textbox's text (here its placeholder text)
            _lessonContentList.splice(index, 0, "New textbox")
            // console.log(originalLessonContent)
            setSelectedLesson({...selectedLesson, lesson_content: _lessonContentList})
            // console.log(originalLessonContent)
        }
        // if the type of content being inserted is an image
        else if (type === "img") {
            _lessonContentList = selectedLesson.lesson_content;
            // insert string of that will represent a dummy immage
            _lessonContentList.splice(index, 0, sampleImg)
            // console.log(_lessonContentList)
            setSelectedLesson({...selectedLesson, lesson_content: _lessonContentList})
        }
    }

    // function to render lesson content in html form
    const renderLessonContent = () => {
        const array = [];
        console.log("renderLessonContent() called")

        // Looping through lesson content
        for (var i = 1; i < selectedLesson.lesson_content.length; i++){
            let content_index = i;

            // put the add new content butttons before the first element. only happens once
            if(i === 1) { 
                array.push(
                    <div key={"before_first"} className = "flex flex-row items-center justify-center">
                    {/* New Paragraph */}
                        <div className="pt-5 px-2">
                            <button onClick={(e) => { 
                                    insertContent(e, "para", content_index, "before")
                                }} className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                Paragraph
                            </button>
                        </div>

                        {/* New Image */}
                        <div className="pt-5 px-2">
                            <button onClick={(e) => {
                                insertContent(e, "img", content_index, "before")
                            }} className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                Image
                            </button>
                        </div>
                    </div>
                )
            }

            // If the content starts with data:image/ it is an image
            if(selectedLesson.lesson_content[i].startsWith("data:image/")){
                
                
                // Push new UI into array
                array.push(
                    
                    <div key={`lesson_info_${i}`}>

                        {/* IMAGE STUFF */}
                         <div className = "flex flex-col items-center justify-center">

                            {/* This is the image */}
                            <img src={selectedLesson.lesson_content[i]} alt="Red dot" />

                            {/* This is the image picker */}
                            <div className="pt-2.5">
                                <input type="file" onChange={(e) => fileSelectedHandler(e, content_index)}/>
                                {/* <button onClick={() => {
                                    // if the updatedLesson is not null (only null by default)
                                    if(updatedLesson){
                                        console.log("ds???")
                                        // Calling setSelectedLesson and setting selectedLesson state with data in updatedLesson state (same lesson, just updated content)
                                        setSelectedLesson(updatedLesson)
                                    }
                                }}>Upload</button> */}
                            </div>
                        </div>   

                        {/* ADD NEW CONTENT AREA */}
                        <div key={i} className = "flex flex-row items-center justify-center">
                          
                          {/* New Paragraph */}
                            <div className="pt-5 px-2">
                                <button onClick={(e) => {
                                        insertContent(e, "para", content_index, "after")
                                    }} className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    Paragraph
                                </button>
                            </div>

                            {/* New Image */}
                            <div className="pt-5 px-2">
                                <button onClick={(e) => {
                                    insertContent(e, "img", content_index, "after")
                                }} className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    Image
                                </button>
                            </div>
                        </div>              
                    </div>
                )
                
            } 
            // else push a text area with the array element's text.
            else {
                array.push(
                    <div key={`lesson_info_${i}`} className="w-96">

                        {/* Text Area with content from lesson */}
                       <textarea value={selectedLesson.lesson_content[i]}
                            onChange={(e) => 
                                // console.log("later")
                                onInputChange(e,'lesson','lesson_content',content_index)
                            } 
                            className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                            placeholder="Enter something" 
                            rows="5" cols="40">
                        </textarea>

                        {/* ADD NEW CONTENT AREA */}
                        <div key={i} className = "flex flex-row items-center justify-center">
                            <div className="pt-5 px-2">
                                <button onClick={(e) => {
                                        insertContent(e, "para", content_index, "after")
                                    }} className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    Paragraph
                                </button>
                            </div>

                            {/* New Image */}
                            <div className="pt-5 px-2">
                                <button onClick={(e) => {
                                    insertContent(e, "img", content_index, "after")
                                }} className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                    Image
                                </button>
                            </div>

                          
                        </div>   
                    </div>
                )
            }
        }
        setLessonContentList(array)
    }

    const resetLesson = () => {
        console.log("resetting changes")
        console.log(originalLessonContent)
        setSelectedLesson(originalLessonContent)
    }

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

    useEffect(() => {
        console.log(originalLessonContent)
    }, [originalLessonContent])

    return (
      <>
        <div className="flex flex-col space-y-4 bg-darkCustom">
            <div className="flex justify-between pt-16 mb-0 mx-3">
                <div className="text-2xl">
                    <p className="text-white">Currently logged in as: <strong> {currentUser.email} </strong></p>
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
                                    <div className="flex flex-col font-sans space-y-6 items-center p-3">
                                        <div className="flex flex-row space-x-6">
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
                                                <button onClick={() => {resetLesson()}} 
                                                    className="py-2 px-4 flex justify-center items-center bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg "
                                                >
                                                    Reset
                                                </button>
                                            </div>
                            
                                        </div>
                                        <div className="flex flex-col space-y-9">
                                            
                                            {lessonContentList}
                                        </div>
                                    </div>
                                    :
                                    <div className="font-sans text-center p-3 font-bold text-xl">
                                        Select a lesson
                                    </div>
                                }
                            </div>
                            
                        </div>

                        <div className="w-40 static ">

                            <div className="text-2xl font-extrabold pb-5">
                                <button type="log out" onClick={handleLogout} className=" py-2 px-4 flex justify-center items-center bg-blue-500 hover:bg-blue-700 focus:ring-blue-500 focus:ring-offset-blue-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Create Chapter
                                </button>
                            </div>
                            <button type="button" onClick={() => {

                                // If selected chapter is not an empty string --> then user is updating a chapter
                                if (selectedChapter.chapter_id != ""){
                                    updateChapter(selectedChapter) //(selectedChapter.chapter_id, selectedChapter.chapter_number,selectedChapter.chapter_title, selectedChapter.subscription_code, selectedChapter.chapter_desc, selectedChapter.chapter_length, selectedChapter.chapter_difficulty, selectedChapter.lessons)
                                // Else, then user is creating a new chapter                                    
                                }else{

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
                            {chapterCards.length > 0 ? chapterCards : "Loading chapters..."}
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
            
                
                
            </div>
            
            
        </div>

      </>
    );
}

export default Dashboard
