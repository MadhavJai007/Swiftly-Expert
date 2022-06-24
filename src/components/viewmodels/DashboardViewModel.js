import { collection, doc, setDoc, getDocs, getDoc, addDoc, listCollections } from 'firebase/firestore'
import {db} from '../../firebase';

import { chapterObj, templateLesson} from '../models/chapterModel'

// retrieves chapters from firestore
export function retrieveChapters(setChapterList, setChaptersRetrieved) {
    return async (isRefreshing) => {
        // if(isRefreshing) {
        //     setChaptersRetrieved(false)
        // }
        const querySnapshot = await getDocs(collection(db, "Chapters"));
        let _chapterList = [];
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
            });
        });
        setChapterList(_chapterList);
        setChaptersRetrieved(true);
    };
}

// used to reset the various chapter related states in the dashboard
export function resetChaptersAndLessons(setSelectedChapter, setSelectedLesson, setLessonContentRetrieved, setOriginalLessonContent, setLessonContentList, setIsCreatingChapter, setOpenTab) {
    return () => {
        setSelectedChapter({ ...chapterObj, lessons: [] });
        setSelectedLesson(null);
        setLessonContentRetrieved(false);
        setOriginalLessonContent(null);
        setLessonContentList(null);
        setIsCreatingChapter(true);
        setOpenTab(1);
    };
}


// used to insert content into the array that will be rendered into content blocks in the lesson list in the ui
export function insertAndDeleteBlocks(selectedLesson, setSelectedLesson, sampleImg) {
    return (e, type, index, placement) => {
        e.preventDefault();
        let _lessonContentList;

        // placement is always "after the specified index" except when inserting content before the first piece.
        if (placement == "after") {
            index += 1;
            console.log(index);
        }
        // if the type of content being inserted is a paragraph
        if (type === "para") {
            _lessonContentList = selectedLesson.lesson_content;
            // insert new string that will act as the textbox's text (here its placeholder text)
            _lessonContentList.splice(index, 0, "New textbox");
            // console.log(originalLessonContent)
            setSelectedLesson({ ...selectedLesson, lesson_content: _lessonContentList });
            // console.log(originalLessonContent)
        }

        // if the type of content being inserted is an image
        else if (type === "img") {
            _lessonContentList = selectedLesson.lesson_content;
            // insert string of that will represent a dummy immage
            _lessonContentList.splice(index, 0, sampleImg);
            // console.log(_lessonContentList)
            setSelectedLesson({ ...selectedLesson, lesson_content: _lessonContentList });
        }
        // if a block is to be deleted
        if (type === "delete") {
            _lessonContentList = selectedLesson.lesson_content;
            _lessonContentList.splice(index, 1);
            setSelectedLesson({ ...selectedLesson, lesson_content: _lessonContentList });
        }
    };
}

// function used to create a chapter object and publish it to firestore. along with any lessons within the chapter object
export function generateAndPublishChapter(chapterList, resetChapterStates, getAuthorsChapters, isCreatingChapter) {
    return async (chapter, mode) => {
        //(selectedChapter.chapter_id, selectedChapter.chapter_number,selectedChapter.chapter_title, selectedChapter.subscription_code, selectedChapter.chapter_desc, selectedChapter.chapter_length, selectedChapter.chapter_difficulty, selectedChapter.lessons)
        console.log(chapter);
        let chapterId = chapter.chapter_id;
        console.log(chapterId);

        // if adding chapter, generate a chapter id
        if (mode == "add") {
            let chapterNum = chapterList.length + 1;
            if (chapterNum >= 100) {
                chapterId = `chapter_${chapterNum}`;
            }
            else if (chapterNum >= 10) {
                chapterId = `chapter_0${chapterNum}`;
            }
            else {
                chapterId = `chapter_00${chapterNum}`;
            }
        }

        console.log(chapterId);

        // let returnCode;
        let chaptersRefDoc = doc(db, "Chapters", chapterId);
        let lessonsRefCollection = collection(chaptersRefDoc, "lessons");

        let validInput = true;
        let chapterLength = parseInt(chapter.chapter_length);
        let chapterDifficulty = parseInt(chapter.chapter_difficulty);

        // Checking if chapter title and desc are not empty
        if (chapter.chapter_title.trim() == "") {
            validInput = false;
            console.log("chapter title is empty");
        }

        if (chapter.chapter_desc.trim() == "") {
            validInput = false;
            console.log("chapter description is empty");
        }

        // Only update doc if the data is valid
        if (validInput == true) {
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
                    console.log({ "code": "UNEXPECTED_UPLOAD_ERR", "details": "unexpected chapter uploade rror" });
                });


            let chaptLessons = _chapter.lessons;
            if (mode == "update") {
                // Looping over each lesson and writing it to the lessons collection
                for (var i = 0; i < chaptLessons.length; i++) {

                    // Grabbing the specific lessonn
                    let lessonsRefDoc = doc(lessonsRefCollection, chaptLessons[i].lesson_id);

                    try {
                        let updateLessonsOperation = await setDoc(lessonsRefDoc, {
                            "lesson_content": chaptLessons[i].lesson_content
                        });
                        console.log(updateLessonsOperation);
                    }
                    catch (err) {
                        console.log("updating lessons failed");
                    }
                }
                // reset chapter editor related states 
                resetChapterStates();
                // refresh list of chapters in right panel
                getAuthorsChapters(false);
            }
            else if (mode == "add") {
                console.log("add new lessons here");
                // adding a brand new chapter
                if (isCreatingChapter) {
                    // Looping over each lesson and writing it to the lessons collection
                    for (var i = 0; i < chaptLessons.length; i++) {

                        // Grabbing the specific lessonn
                        let lessonsRefDoc = doc(lessonsRefCollection, chaptLessons[i].lesson_id);

                        try {
                            let updateLessonsOperation = await setDoc(lessonsRefDoc, {
                                "lesson_content": chaptLessons[i].lesson_content
                            });
                            console.log(updateLessonsOperation);
                        }
                        catch (err) {
                            console.log("updating lessons failed");
                        }
                    }
                }
                // reset chapter editor related states 
                resetChapterStates();
                // refresh list of chapters in right panel
                getAuthorsChapters(false);
            }

        }
    };
}

// generates a new lesson and adds them in the selected chapter's lesson list so it can be rendered
export function generateNewLesson(isCreatingChapter, selectedChapter, setSelectedChapter, setSelectedLesson) {
    return async () => {
        let newLesson = null;
        let clonedChapter = null;
        // if user is adding a chapter
        if (isCreatingChapter) {
            clonedChapter = selectedChapter;

            let newLessonId;
            let lessonNum = clonedChapter.lessons.length + 1;
            if (lessonNum >= 100) {
                newLessonId = `lesson_${lessonNum}`;
            }
            else if (lessonNum >= 10) {
                newLessonId = `lesson_0${lessonNum}`;
            }
            else {
                newLessonId = `lesson_00${lessonNum}`;
            }

            newLesson = templateLesson;
            newLesson.lesson_id = newLessonId;
            newLesson.lesson_title = `Untitled lesson ${lessonNum}`;
            newLesson.lesson_content[0] = "Untitled lesson";
            newLesson.lesson_content[1] = "New textbox";
            var lessonArr = clonedChapter.lessons;
            lessonArr.push(JSON.parse(JSON.stringify(newLesson)));
            setSelectedChapter({ ...clonedChapter, lessons: lessonArr });
            setSelectedLesson(selectedChapter.lessons[lessonNum - 1]);
        }

        // if user is currently modifying an existing chapter in the database
        else {
            console.log("adding blank lesson to the existing chapter list");
            clonedChapter = selectedChapter;

            let newLessonId;
            let lessonNum = clonedChapter.lessons.length + 1;
            if (lessonNum >= 100) {
                newLessonId = `lesson_${lessonNum}`;
            }
            else if (lessonNum >= 10) {
                newLessonId = `lesson_0${lessonNum}`;
            }
            else {
                newLessonId = `lesson_00${lessonNum}`;
            }

            newLesson = templateLesson;
            newLesson.lesson_id = newLessonId;
            newLesson.lesson_title = `Untitled lesson ${lessonNum}`;
            newLesson.lesson_content[0] = "Untitled lesson";
            newLesson.lesson_content[1] = "New textbox";
            var lessonArr = clonedChapter.lessons;
            lessonArr.push(JSON.parse(JSON.stringify(newLesson)));
            setSelectedChapter({ ...clonedChapter, lessons: lessonArr });
            setSelectedLesson(selectedChapter.lessons[lessonNum - 1]);
        }

    };
}

// text input handler used throughout the dashboard ui for different text inputs
export function dashboardTextInputHandler(selectedChapter, setSelectedChapter, selectedLesson, setSelectedLesson) {
    return (e, type, input, index) => {
        e.preventDefault();
        if (type === "chapter") {
            let _chapterObj = { ...selectedChapter };
            // {input} can be chapter title, sub code, description, lenght and difficulty
            if(input == 'chapter_length'){
                _chapterObj[`${input}`] = parseInt(e.target.value);
            }
            else {
                _chapterObj[`${input}`] = e.target.value;
            } 
            setSelectedChapter(_chapterObj);
        }
        else if (type === "lesson") {
            let _lessonObj = { ...selectedLesson };
            // only updating lesson title property and first element in lesson content (which is also lesson title)
            if (input === 'lesson_title') {
                _lessonObj[`${input}`] = e.target.value;
                _lessonObj['lesson_content'][0] = e.target.value;
            }

            // updating specified index in lesson content array inside the selectedLesson
            else if (input === 'lesson_content') {
                _lessonObj[`${input}`][index] = e.target.value;
            }
            setSelectedLesson(_lessonObj);
        }
    };
}

// gets the details of the specified chapter
export function getSelectedChapterDetails(setLessonContentRetrieved, setSelectedChapter, setOpenTab, setSelectedLesson, setIsCreatingChapter) {
    return async (docId) => {
        setLessonContentRetrieved(false);
        setSelectedChapter(chapterObj);
        setOpenTab(0);
        const chapterDocRef = doc(db, "Chapters", docId);
        const chapterDocSnap = await getDoc(chapterDocRef);
        if (chapterDocSnap.exists()) {
            // creating temp copy of the empty chapter object
            console.log(docId);
            let _chapterObj = { ...chapterObj };
            _chapterObj.chapter_id = docId;
            _chapterObj.chapter_title = chapterDocSnap.data().chapter_title;
            _chapterObj.chapter_desc = chapterDocSnap.data().chapter_desc;
            _chapterObj.chapter_difficulty = chapterDocSnap.data().chapter_difficulty;
            _chapterObj.chapter_icon_name = chapterDocSnap.data().chapter_icon_name;
            _chapterObj.chapter_number = chapterDocSnap.data().chapter_number;
            _chapterObj.chapter_length = chapterDocSnap.data().chapter_length;
            _chapterObj.subscription_code = chapterDocSnap.data().subscription_code;
            _chapterObj.chapter_author = chapterDocSnap.data().author;

            // console.log(chapterDocSnap.data().author)
            setSelectedChapter(_chapterObj);
            setSelectedLesson(null);
            // disabling the creatingMode flag (only when creating a new chapter)
            setIsCreatingChapter(false);
        } else {
            // this shouldnt happen
            console.log("Requested document not found!!");
        }
    };
}

// used to get the lessons of the specified chapter
export function getCurrChapterLessons(selectedChapter, setSelectedChapter, setLessonContentRetrieved) {
    return async () => {
        // only do this if the user isnt making a brand new chapter
        // if(!isCreatingChapter) {
        console.log("retrieving chapter's lessons...");
        let chapterDocRef = doc(db, "Chapters", selectedChapter.chapter_id);
        const querySnapshot = await getDocs(collection(chapterDocRef, "lessons"));
        let lessons = [];
        querySnapshot.forEach(doc => {
            lessons.push({
                "lesson_id": doc.id,
                "lesson_title": doc.data().lesson_content[0],
                "lesson_content": doc.data().lesson_content
            });
        });
        setSelectedChapter({ ...selectedChapter, lessons: lessons });
        setLessonContentRetrieved(true);
    };
}

// used to logout 
export function logoutHandler(setError, logout, history) {
    return async () => {
        setError('');

        try {
            await logout();
            history.push('/login');
        }
        catch {
            setError('Failed to log out');
        }
    };
}