import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { collection, doc, getDocs, getDoc, listCollections } from 'firebase/firestore'
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
    const [openTab, setOpenTab] = useState(1);
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
                chapterSubCode: doc.data()["subscription_code"]
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

            setSelectedChapter(_chapterObj)
            setSelectedLesson(null)

        } else {
            // this shouldnt happen
            console.log("Requested document not found!!")
        }
    }

    const onInputChange = (e, type, input) => {
        e.preventDefault();
        if(type === "chapter" ){
            let _chapterObj = {...selectedChapter}
            _chapterObj[`${input}`] = e.target.value
            setSelectedChapter(_chapterObj)
        }
        else if(type === "lesson") {
            let _lessonObj = {...selectedLesson}
            _lessonObj[`${input}`] = e.target.value
            setSelectedLesson(_lessonObj)
        }
    }

    const onLessonSelect = (e) => {
        let lessonId = e.target.value;
        if(lessonId !== ""){
            var chosenLesson = selectedChapter.lessons.find(lesson => lesson.lesson_id === lessonId)
            setSelectedLesson(chosenLesson)
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
                       Created by: {"Insert author name"}
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
                ? "text-white bg-red-600"
                : "text-red-600 bg-white")
            }
            onClick={e => {
                e.preventDefault();
                setOpenTab(tab.number)
                if(tab.number === 2 && selectedChapter.chapter_id !== "") {
                    if(!lessonContentRetrieved) {
                        console.log("loading the lession content")
                        getChapterLessons()
                    }
                }
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

    var state = {
        selectedFile: null
    }


    const fileSelectedHandler = event => {
        this.setState({
            selectedFile: event.target.files[0]
        })
    }

    const fileUploadHandler = (location) => {
        //selectedLesson.lesson_content[location] = "data:image/png;base64,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"
    }

    const lessonContent = () => {
        const array = [];
        for (var i = 1; i < selectedLesson.lesson_content.length; i++){
            if(selectedLesson.lesson_content[i].startsWith("data:image/png;base64,")){
                array.push(
                    <div key={`lesson_info_${i}`}>
                         <div className = "flex flex-col items-center justify-center">
                            <img src={selectedLesson.lesson_content[i]} alt="Red dot" />
                            {/* <input type="file" onChange={fileSelectedHandler}/>
                            <button onClick={fileUploadHandler(i)}>Upload</button> */}
                        </div>
                       
                    </div>
                )
            }else {
                array.push(
                    <div key={`lesson_info_${i}`} className="w-96">
                       <textarea value={selectedLesson.lesson_content[i]}
                        onChange={(e) => console.log("later")} 
                        className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" 
                         placeholder="Enter something" 
                         rows="5" cols="40">
                        </textarea>
                    </div>
                )
            }
        }

        return array;
    }

    useEffect(()=>{ 
        console.log(currentUser.email)
        // if a currentUser exists (logged in)
        
        if(currentUser && chapterList.length === 0){
            getAuthorsChapters(false)
        }
    },[])

    useEffect(() => {
        console.log(selectedChapter)
    }, [selectedChapter])

    useEffect(() => {
        console.log(selectedLesson)
    }, [selectedLesson])

    return (
      <>
        <div className="">

            <div className="flex flex-row space-x-4 m-3 h-screen">
                <div className="w-3/4 h-5/6 rounded-l-md bg-purple-200 overflow-auto">
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
                                    <input type="text" id="chapter-title" value={selectedChapter.chapter_title}  onChange={(e) => onInputChange(e, 'chapter', 'chapter_title')} className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="chapter_title" placeholder="Enter a title"/>
                                </div>
                                
                                <div className="relative w-40">
                                    <label className="text-gray-700">
                                        Subscription code
                                    </label>
                                    <input type="text" id="sub-code" value={selectedChapter.subscription_code}  onChange={(e) => onInputChange(e, 'chapter','subscription_code')} className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="sub_code" placeholder="Enter a code"/>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-gray-700"  >
                                Chapter Description
                                </label>
                                <textarea value={selectedChapter.chapter_desc} onChange={(e) => onInputChange(e, 'chapter','chapter_desc')} className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" id="chapter-desc" placeholder="Enter chapter description" name="chapter_desc" rows="5" cols="40">
                                </textarea>
                            </div>

                            <div>
                                <label className="text-gray-700" >
                                    Chapter length: {`~ ${selectedChapter.chapter_length} minutes`}
                                </label>
                                <br/>
                                {/* <input type="range" min="1" max="120" value="50" className="slider" id="chapter-length" /> */}
                                <input id="chapter-length" type="range" min="1" max="120" step="1" value={selectedChapter.chapter_length} onChange={(e) => onInputChange(e, 'chapter', 'chapter_length')} className="rounded-lg overflow-hidden appearance-none py-2 my-4 bg-gray-400 h-3 w-96"/>
                            </div>

                            <div>
                                <label className="text-gray-700" >
                                    Chapter Difficulty: {selectedChapter.chapter_difficulty < 3 ? (selectedChapter.chapter_difficulty < 2 ? "Easy" : "Medium") : "Hard"}
                                </label>
                                <br/>
                                {/* <input type="range" min="1" max="120" value="50" className="slider" id="chapter-length" /> */}
                                <input id="chapter-diff" type="range" min="1" max="3" step="1" value={selectedChapter.chapter_difficulty} onChange={(e) => onInputChange(e, 'chapter','chapter_difficulty')} className="rounded-lg overflow-hidden appearance-none py-2 my-4 bg-gray-400 h-3 w-96"/>
                            </div>
                        </div>
                        
                        <div className= {"flex flex-row " + (openTab === 2 ? "block" : "hidden")}>
                            <div className="pl-3 w-1/4 h-5/6 rounded-l-md bg-red-400 overflow-auto"> 
                                <div className="text-2xl my-7 text-left ">Lessons</div>
                                    <select id="lessons" onChange={(e)=>{onLessonSelect(e)}} className="block w-52 py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500" name="lessons">
                                        <option value="">
                                            Select a lesson
                                        </option>
                                        {lessonOptions}
                                    </select>
                                
                            </div>
                            <div className=" w-3/4 h-full rounded-r-md bg-blue-400 overflow-auto">
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
                                                <input type="text" id="chapter-title" value={selectedLesson.lesson_title}  onChange={(e) => onInputChange(e, 'lesson','lesson_title')} className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="lesson_title" placeholder="Enter a title"/>
                                            </div>
                                        </div>
                                        <div className="flex flex-col space-y-9">
                                            {lessonContent()}
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
                            <button type="button" className=" py-2 px-4 flex justify-center items-center bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                <svg width="20" height="20" fill="currentColor" className="mr-2" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1344 1472q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm256 0q0-26-19-45t-45-19-45 19-19 45 19 45 45 19 45-19 19-45zm128-224v320q0 40-28 68t-68 28h-1472q-40 0-68-28t-28-68v-320q0-40 28-68t68-28h427q21 56 70.5 92t110.5 36h256q61 0 110.5-36t70.5-92h427q40 0 68 28t28 68zm-325-648q-17 40-59 40h-256v448q0 26-19 45t-45 19h-256q-26 0-45-19t-19-45v-448h-256q-42 0-59-40-17-39 14-69l448-448q18-19 45-19t45 19l448 448q31 30 14 69z">
                                    </path>
                                </svg>
                                Upload
                            </button>
                        </div>
                    </div>

                    
                </div>
                <div className="w-1/4 h-5/6 rounded-r-md bg-blue-400 overflow-auto">
                    <div className="font-sans text-center p-3 font-bold text-2xl">
                        Your Chapters
                        <div className="flex flex-col justify-center items-stretch text-2xl font-bold space-y-4 pt-5 ">
                            {chapterCards.length > 0 ? chapterCards : "Loading chapters..."}
                        </div>
                    </div>
                </div>
            </div>
            <div className="">
            <div className="flex justify-between mx-3">
                <div className="text-2xl">
                    <p>Currently logged in as: <strong> {currentUser.email} </strong></p>
                </div>
                
                <div className="text-2xl font-extrabold pb-5">
                    <button type="log out" onClick={handleLogout} className=" py-2 px-4 flex justify-center items-center bg-red-600 hover:bg-red-700 focus:ring-red-500 focus:ring-offset-red-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                    Logout
                    </button>
                </div>
            </div>

                
            </div>
            
            
        </div>

      </>
    );
}

export default Dashboard
