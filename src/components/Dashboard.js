import React, { useState, useEffect, useRef } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'
import { collection, doc, getDocs, getDoc } from 'firebase/firestore'
import {db} from '../firebase';

const chapterObj = {
    chapter_title: "",
    chapter_desc: "",
    chapter_difficulty: 1,
    chapter_icon_name: "folder.circle",
    chapter_number: 0,
    chapter_length: 0,
    subscription_code: "N/A",
    lessons: [], // the lessons subcollection
    playground: [] // playgrounds subcollection
}

const Dashboard = () => {
    const [error, setError] = useState("")
    const [chapterList, setChapterList] = useState([]);
    const [chaptersRetrieved, setChaptersRetrieved] = useState(false)
    const [selectedChapter, setSelectedChapter] = useState(chapterObj)
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
        querySnapshot.forEach(doc => {
            chapterList.push({
                chapterId: doc.id,
                chapterNumber: doc.data()["chapter_number"],
                chapterTitle: doc.data()["chapter_title"],
                chapterDesc: doc.data()["chapter_desc"],
                chapterDiff: doc.data()["chapter_difficulty"],
                chapterLength: doc.data()["chapter_length"],
                chapterSubCode: doc.data()["subscription_code"]
            })
            // console.log(doc.id, " => ", doc.data())
        })
        setChaptersRetrieved(true)
    }

    const getChapter = async (docId) => {
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
            let _chapterObj = {...chapterObj};
            _chapterObj.chapter_title = chapterDocSnap.data().chapter_title
            _chapterObj.chapter_desc = chapterDocSnap.data().chapter_desc
            _chapterObj.chapter_difficulty = chapterDocSnap.data().chapter_difficulty
            _chapterObj.chapter_icon_name = chapterDocSnap.data().chapter_icon_name
            _chapterObj.chapter_number = chapterDocSnap.data().chapter_number
            _chapterObj.chapter_length = chapterDocSnap.data().chapter_length
            _chapterObj.subscription_code = chapterDocSnap.data().subscription_code

            setSelectedChapter(_chapterObj)

        } else {
            // this shouldnt happen
            console.log("Requested document not found!!")
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

    return (
      <>
        <div className="">

            <div className="flex flex-row space-x-4 m-3 h-screen">
                <div className="w-3/4 h-5/6 rounded-l-md bg-purple-200 overflow-auto">
                    <div className="font-sans text-center p-3 font-bold text-2xl">
                        Editing panel
                        {/* TODO: Include OnChange handling for form elements */}
                        <div className="flex flex-col items-center justify-center text-2xl font-bold space-y-6 pt-5 ">
                            <div className="relative ">
                                <label for="chapter-title" className="text-gray-700">
                                    Chapter title
                                </label>
                                <input type="text" id="chapter-title" value={selectedChapter.chapter_title} className="rounded-lg border-transparent flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 shadow-sm text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" name="chapter_title" placeholder="Enter a title"/>
                            </div>
                            <div>
                                <label class="text-gray-700" >
                                   Chapter Description
                                </label>
                                 <textarea value={selectedChapter.chapter_desc} class="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent" id="chapter_desc" placeholder="Enter chapter description" name="chapter_desc" rows="5" cols="40">
                                </textarea>
                            </div>
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
                <div className="text-2xl font-extrabold">
                    <button type="log out" onClick={handleLogout}>log out</button>
                </div>
            </div>
            </div>
            
        </div>

        {/* <div class="relative bg-white dark:bg-gray-800">
                <div class="flex flex-col sm:flex-row sm:justify-around">
                    
                </div>
            </div> */}

        {/* <div class="w-72 h-screen ">
                        
                        <div class="flex items-center justify-start mx-6 mt-10">
                            <img class="h-10" src="/icons/rocket.svg"/>
                            <span class="text-gray-600 dark:text-gray-300 ml-4 text-2xl font-bold">
                                Swiftly
                            </span>
                        </div>
                        <nav class="mt-10 px-6 ">
                            <a class="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-600 dark:text-gray-400 rounded-lg " href="#">
                                <svg width="20" height="20" fill="currentColor" class="m-auto" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1024 1131q0-64-9-117.5t-29.5-103-60.5-78-97-28.5q-6 4-30 18t-37.5 21.5-35.5 17.5-43 14.5-42 4.5-42-4.5-43-14.5-35.5-17.5-37.5-21.5-30-18q-57 0-97 28.5t-60.5 78-29.5 103-9 117.5 37 106.5 91 42.5h512q54 0 91-42.5t37-106.5zm-157-520q0-94-66.5-160.5t-160.5-66.5-160.5 66.5-66.5 160.5 66.5 160.5 160.5 66.5 160.5-66.5 66.5-160.5zm925 509v-64q0-14-9-23t-23-9h-576q-14 0-23 9t-9 23v64q0 14 9 23t23 9h576q14 0 23-9t9-23zm0-260v-56q0-15-10.5-25.5t-25.5-10.5h-568q-15 0-25.5 10.5t-10.5 25.5v56q0 15 10.5 25.5t25.5 10.5h568q15 0 25.5-10.5t10.5-25.5zm0-252v-64q0-14-9-23t-23-9h-576q-14 0-23 9t-9 23v64q0 14 9 23t23 9h576q14 0 23-9t9-23zm256-320v1216q0 66-47 113t-113 47h-352v-96q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v96h-768v-96q0-14-9-23t-23-9h-64q-14 0-23 9t-9 23v96h-352q-66 0-113-47t-47-113v-1216q0-66 47-113t113-47h1728q66 0 113 47t47 113z">
                                    </path>
                                </svg>
                                <span class="mx-4 text-lg font-normal">
                                    Your Chapters
                                </span>
                                <span class="flex-grow text-right">
                                </span>
                            </a>
                            <a class="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-800 dark:text-gray-100 rounded-lg bg-gray-100 dark:bg-gray-600" href="#">
                                <svg width="20" height="20" fill="currentColor" class="m-auto" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M685 483q16 0 27.5-11.5t11.5-27.5-11.5-27.5-27.5-11.5-27 11.5-11 27.5 11 27.5 27 11.5zm422 0q16 0 27-11.5t11-27.5-11-27.5-27-11.5-27.5 11.5-11.5 27.5 11.5 27.5 27.5 11.5zm-812 184q42 0 72 30t30 72v430q0 43-29.5 73t-72.5 30-73-30-30-73v-430q0-42 30-72t73-30zm1060 19v666q0 46-32 78t-77 32h-75v227q0 43-30 73t-73 30-73-30-30-73v-227h-138v227q0 43-30 73t-73 30q-42 0-72-30t-30-73l-1-227h-74q-46 0-78-32t-32-78v-666h918zm-232-405q107 55 171 153.5t64 215.5h-925q0-117 64-215.5t172-153.5l-71-131q-7-13 5-20 13-6 20 6l72 132q95-42 201-42t201 42l72-132q7-12 20-6 12 7 5 20zm477 488v430q0 43-30 73t-73 30q-42 0-72-30t-30-73v-430q0-43 30-72.5t72-29.5q43 0 73 29.5t30 72.5z">
                                    </path>
                                </svg>
                                <span class="mx-4 text-lg font-normal">
                                    Create new chapter
                                </span>
                                <span class="flex-grow text-right">
                                </span>
                            </a>
                            <a class="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-600 dark:text-gray-400 rounded-lg " href="#">
                                <svg width="20" height="20" fill="currentColor" class="m-auto" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M960 0l960 384v128h-128q0 26-20.5 45t-48.5 19h-1526q-28 0-48.5-19t-20.5-45h-128v-128zm-704 640h256v768h128v-768h256v768h128v-768h256v768h128v-768h256v768h59q28 0 48.5 19t20.5 45v64h-1664v-64q0-26 20.5-45t48.5-19h59v-768zm1595 960q28 0 48.5 19t20.5 45v128h-1920v-128q0-26 20.5-45t48.5-19h1782z">
                                    </path>
                                </svg>
                                <span class="mx-4 text-lg font-normal">
                                    Profile
                                </span>
                                <span class="flex-grow text-right">
                                    <button type="button" class="w-6 h-6 text-xs  rounded-full text-white bg-red-500">
                                        <span class="p-1">
                                            7
                                        </span>
                                    </button>
                                </span>
                            </a>
                            <a class="hover:text-gray-800 hover:bg-gray-100 flex items-center p-2 my-6 transition-colors dark:hover:text-white dark:hover:bg-gray-600 duration-200  text-gray-600 dark:text-gray-400 rounded-lg " href="#">
                                <svg width="20" height="20" class="m-auto" fill="currentColor" viewBox="0 0 2048 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1070 1178l306-564h-654l-306 564h654zm722-282q0 182-71 348t-191 286-286 191-348 71-348-71-286-191-191-286-71-348 71-348 191-286 286-191 348-71 348 71 286 191 191 286 71 348z">
                                    </path>
                                </svg>
                                <span class="mx-4 text-lg font-normal">
                                    Navigation
                                </span>
                                <span class="flex-grow text-right">
                                </span>
                            </a>
                        </nav>
                        <div class="absolute bottom-0 my-10">
                            <a class="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 transition-colors duration-200 flex items-center py-2 px-8" href="#">
                                <svg width="20" fill="currentColor" height="20" class="h-5 w-5" viewBox="0 0 1792 1792" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1088 1256v240q0 16-12 28t-28 12h-240q-16 0-28-12t-12-28v-240q0-16 12-28t28-12h240q16 0 28 12t12 28zm316-600q0 54-15.5 101t-35 76.5-55 59.5-57.5 43.5-61 35.5q-41 23-68.5 65t-27.5 67q0 17-12 32.5t-28 15.5h-240q-15 0-25.5-18.5t-10.5-37.5v-45q0-83 65-156.5t143-108.5q59-27 84-56t25-76q0-42-46.5-74t-107.5-32q-65 0-108 29-35 25-107 115-13 16-31 16-12 0-25-8l-164-125q-13-10-15.5-25t5.5-28q160-266 464-266 80 0 161 31t146 83 106 127.5 41 158.5z">
                                    </path>
                                </svg>
                                <span class="mx-4 font-medium">
                                <button type="log out" onClick={handleLogout}>Log out</button>
                                </span>
                            </a>
                        </div>
                    </div> */}

        {/* <label className="block text-left max-w-md mx-auto">
                        <span className="text-gray-700">Text description</span>
                        <textarea
                            className="form-textarea mt-1 block w-full"
                            rows="3"
                            placeholder="Enter some long form content."
                        ></textarea>
                    </label> */}

        {/* <div className="md:flex flex-col md:flex-row md:min-h-screen w-full bg-darkCustom">
                <div className="flex flex-col w-full md:w-64 text-gray-700 bg-white dark-mode:text-gray-200 dark-mode:bg-gray-800 flex-shrink-0">
                    <div className="flex-shrink-0 px-8 py-4 flex flex-row items-center justify-between">
                    <a href="#" className="text-lg font-semibold tracking-widest text-gray-900 uppercase rounded-lg dark-mode:text-white focus:outline-none focus:shadow-outline">Swiftly</a>
                        <button className="rounded-lg md:hidden rounded-lg focus:outline-none focus:shadow-outline">
                            <svg fill="currentColor" viewBox="0 0 20 20" className="w-6 h-6">
                            <path x-show="!open" fill-rule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z" clip-rule="evenodd"></path>
                            <path x-show="open" fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                            </svg>
                        </button>
                    </div>
                    <nav className="flex-grow md:block px-4 pb-4 md:pb-0 md:overflow-y-auto">
                        <a className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-gray-200 rounded-lg dark-mode:bg-gray-700 dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Blog</a>
                        <a className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Portfolio</a>
                        <a className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">About</a>
                        <a className="block px-4 py-2 mt-2 text-sm font-semibold text-gray-900 bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Contact</a>
                        <div className="relative" x-data="{ open: false }">
                            <button className="flex flex-row items-center w-full px-4 py-2 mt-2 text-sm font-semibold text-left bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:focus:bg-gray-600 dark-mode:hover:bg-gray-600 md:block hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline">
                            <span>Dropdown</span>
                            <svg fill="currentColor" viewBox="0 0 20 20" className="inline w-4 h-4 mt-1 ml-1 transition-transform duration-200 transform md:-mt-1"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>
                            </button>
                            <div x-show="open" x-transition:enter="transition ease-out duration-100" x-transition:enter-start="transform opacity-0 scale-95" x-transition:enter-end="transform opacity-100 scale-100" x-transition:leave="transition ease-in duration-75" x-transition:leave-start="transform opacity-100 scale-100" x-transition:leave-end="transform opacity-0 scale-95" className="absolute right-0 w-full mt-2 origin-top-right rounded-md shadow-lg">
                            <div className="px-2 py-2 bg-white rounded-md shadow dark-mode:bg-gray-800">
                                <a className="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Link #1</a>
                                <a className="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Link #2</a>
                                <a className="block px-4 py-2 mt-2 text-sm font-semibold bg-transparent rounded-lg dark-mode:bg-transparent dark-mode:hover:bg-gray-600 dark-mode:focus:bg-gray-600 dark-mode:focus:text-white dark-mode:hover:text-white dark-mode:text-gray-200 md:mt-0 hover:text-gray-900 focus:text-gray-900 hover:bg-gray-200 focus:bg-gray-200 focus:outline-none focus:shadow-outline" href="#">Link #3</a>
                            </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div> */}

        {/* <div>
                    <p>welcome to Dashboard</p>
                    <br/>
                    {error && error}
                    <br/>
                    <p>Currently logged in as: <strong> {currentUser.email} </strong></p>
                    <br/>
                    <br/>
                    <Link to="update-profile">Update profile</Link>
                </div>
                <br/>
                <div>
                    <button type="log out" onClick={handleLogout}>log out</button>
                </div> */}
      </>
    );
}

export default Dashboard
