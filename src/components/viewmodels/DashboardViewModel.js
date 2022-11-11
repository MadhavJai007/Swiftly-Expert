import { async } from '@firebase/util';
import { collection, doc, setDoc, getDocs, getDoc, addDoc, listCollections, query, where, deleteDoc, updateDoc } from 'firebase/firestore'
import { v4 as uuidv4 } from 'uuid';
import {db} from '../../firebase';
import Filter from 'bad-words';

import { chapterObj, templateLesson} from '../models/chapterModel'

// retrieves chapters from firestore
export function retrieveChapters(setChapterList, setChaptersRetrieved, profileDetails, isTestMode) {
    return async (isRefreshing) => {
        // if(isRefreshing) {
        //     setChaptersRetrieved(false)
        // }
        
        const authorName = profileDetails.username
        console.log(authorName)
        const chaptersRef = collection(db, 'Chapters');
        console.log(authorName)
        const q = query(chaptersRef, where('author', '==', authorName) ) //getDocs(collection(db, "Chapters"));
        const querySnapshot = await getDocs(q);

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
            });
        });
        if(isTestMode){
            console.log(_chapterList)
            return _chapterList;
        }
        setChapterList(_chapterList);
        setChaptersRetrieved(true);
    };
}

// used to reset the various chapter related states in the dashboard
export function resetChaptersAndLessons(setSelectedChapter, setSelectedLesson, setLessonContentRetrieved, setSelectedPlaygroundQuestion, setPlaygroundQuestionsRetrieved, setOriginalLessonContent, setLessonContentList, setIsCreatingChapter, setOpenTab) {
    return () => {
        setSelectedChapter({ ...chapterObj, lessons: [], playground: [] });
        setSelectedLesson(null);
        setLessonContentRetrieved(false);
        setSelectedPlaygroundQuestion(null);
        setPlaygroundQuestionsRetrieved(false);
        setOriginalLessonContent(null);
        setLessonContentList(null);
        setIsCreatingChapter(true);
        setOpenTab(0);
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

// used to reset progress of students when changes are made.
async function resetStudentPlaygroundProgress(chapterId, questionIdArr){
    console.log(questionIdArr)
    let studentsRefCollection = collection(db,  'Students')
    let studentRefDoc;
    let studentClassroomsRef;
    let classroom_1Ref;
    let classroom_1ChaptersRef;
    let studentChapterProgressQuery;
    let chapter_id = chapterId;
    const querySnapshot = await getDocs(studentsRefCollection);
    querySnapshot.forEach(async (student) => {
    // doc.data() is never undefined for query doc snapshots
        // console.log(student.id, " => ", student.data());
        studentRefDoc = doc(studentsRefCollection, student.id)
        studentClassroomsRef = collection(studentRefDoc, 'Classrooms')
        classroom_1Ref = doc(studentClassroomsRef, 'classroom_1')
        classroom_1ChaptersRef = collection(classroom_1Ref,  'Chapters')

        // find the chapter document that has the id of the published chapter
        studentChapterProgressQuery = query(classroom_1ChaptersRef, where('chapter_id', "==", chapter_id))
        var studentProgressSnapshot = await getDocs(studentChapterProgressQuery)

        // var 
        studentProgressSnapshot.forEach(async chapterProgress => {
            console.log(student.id)
            console.log(chapterProgress.id)
            console.log(chapterProgress.data().playground_status)
            if(chapterProgress.data().playground_status == 'inprogress' || chapterProgress.data().playground_status == 'incomplete'){
                console.log(`setting playground status of ${chapterProgress.id} to 'incomplete' for user ${student.id}`)
                var chapterRef = doc(classroom_1ChaptersRef, chapterProgress.id)
                var chapterSnap = await getDoc(chapterRef)
                if(chapterSnap.exists()){
                    
                    var chapterProgressData = chapterSnap.data()
                    console.log(chapterSnap.data())
                    var questionCount = questionIdArr.length
                    chapterProgressData.playground_status = 'incomplete'
                    chapterProgressData.question_ids =  questionIdArr
                    chapterProgressData.total_questions = questionCount
                    chapterProgressData.total_question_score = 0
                    var question_progress_arr = []
                    var question_scores_arr = []
                    for (var x = 0; x<questionCount; x++ ) {
                        console.log(x)
                        question_progress_arr.splice(x, 0, 'incomplete')
                        question_scores_arr.splice(x, 0, 0)
                        // chapterProgressData.question_progress[x] = 'incomplete'
                        // chapterProgressData.question_scores[x] = 0
                        chapterProgressData[`question_${x+1}_answer`] = []
                    }
                    chapterProgressData.question_progress = question_progress_arr
                    chapterProgressData.question_scores = question_scores_arr
                    console.log(chapterProgressData)
                    try{
                        setDoc(chapterRef, chapterProgressData)
                        // TODO: make return statements??
                    }
                    catch(err){
                        console.log(err)
                    }
                }
                else {
                    console.log('Nothing was found?')
                }
            }
        })
    });
}

// TODO: MOVE THIS TO CLOUD FUNCTION 
// this function is used to reorder and re-enumerate the chapters in firestore when called
async function recountChapterNumbers() {
    let chaptersCollection = await getDocs(collection(db, 'Chapters'))
    let count = 0
    chaptersCollection.forEach((chapter) => {
        count++
        var chapterRef = doc(db, 'Chapters', chapter.id)
        updateDoc(chapterRef, {chapter_number: count})
    });

}

//function to check profanity in chapter content
async function checkProfanity(chapter) {
    let chaptLessons = chapter.lessons;
    let chaptPlayground = chapter.playground;
    let profanityCount = 0;
    let profanityDetails = {
        chapterTitleProfanity: [],
        chapterDescProfanity: [],
        chapterLessonsProfanity: [],
        chapterPlaygroundProfanity: [],
    }
    var filter = new Filter();
    if(filter.isProfane(chapter.chapter_title)){
        profanityCount++;
        profanityDetails.chapterTitleProfanity.push(filter.clean(chapter.chapter_title))
    }
    if(filter.isProfane(chapter.chapter_desc)){
        profanityCount++;
        profanityDetails.chapterDescProfanity.push(filter.clean(chapter.chapter_desc))
    }
    for (var i = 0; i < chaptLessons.length; i++) {
        var lessonsArray = chaptLessons[i].lesson_content
        lessonsArray.forEach((lessonText, idx)=> {
            if(filter.isProfane(lessonText)){
                profanityCount++;
                profanityDetails.chapterLessonsProfanity.push({
                    lesson_id: chaptLessons[i].lesson_id,
                    isTitle: (idx==0),
                    profaneContent: filter.clean(lessonText)
                })
            }
        })
    }
    for (var i = 0; i < chaptPlayground.length; i++) {
        let playgroundObj = {
            code_blocks: chaptPlayground[i].code_blocks,
            id: chaptPlayground[i].id,
            question_description: chaptPlayground[i].question_description,
            question_title: chaptPlayground[i].question_title,
        }
        if(filter.isProfane(playgroundObj.question_title)){
            profanityCount++;
            profanityDetails.chapterPlaygroundProfanity.push({
                question_id: playgroundObj.id,
                isTitle: true,
                profaneContent: filter.clean(playgroundObj.question_title)
            })
        }
        if(filter.isProfane(playgroundObj.question_description)){
            profanityCount++;
            profanityDetails.chapterPlaygroundProfanity.push({
                question_id: playgroundObj.id,
                isDesc: true,
                profaneContent: filter.clean(playgroundObj.question_description)
            })
        }
        playgroundObj.code_blocks.forEach((optionText, idx) => {
            if(filter.isProfane(optionText)){
                profanityCount++;
                profanityDetails.chapterPlaygroundProfanity.push({
                    question_id: playgroundObj.id,
                    isOption: true,
                    optionIndex: idx,
                    profaneContent: filter.clean(optionText)
                })
            }
        })
    }
    return {
        profanityCount,
        profanityDetails
    };
}

// function to delete playground question
export function deletePlaygroundQuestion(selectedChapter, setShowLoadingOverlay, setShowPromptDialog, setDialogDescText, setDialogTitleText) {
    return async (questionId) => {

        setShowLoadingOverlay(true)

        //if question is created in a new chapter 
        if(selectedChapter.chapter_id == ""){
            console.log('current chapter not in firestore')
            setShowPromptDialog(true)
            setDialogTitleText('Question was deleted!!')
            setDialogDescText('This question has been deleted')
        }
        // only if existing chapter is already in firestore
        else{
            let chaptersRefDoc = doc(db, "Chapters", selectedChapter.chapter_id);
            let questionRef = doc(chaptersRefDoc, 'playground', questionId)
            let questionSnap = await getDoc(questionRef)
            if(questionSnap.exists()){
                console.log(questionSnap.data())
                try{
                    // if the question was found, delete it and then show confirmation
                    await deleteDoc(questionRef).then(val => {
                        console.log(val)
                        setShowPromptDialog(true)
                        setDialogTitleText('Question was deleted!!')
                        setDialogDescText('This question has been deleted')

                        // generate an array of the question ids in the playground section
                        let questionIdArr = []
                        let playgroundObj = selectedChapter.playground
                        playgroundObj.forEach(question => {
                            questionIdArr.push(question.id);
                        })

                        // reset the student progress if they are currently taking the test
                        resetStudentPlaygroundProgress(selectedChapter.chapter_id, questionIdArr)
                        // TODO: set return statement

                    })
                    
                }
                catch(err){
                    // show prompt that question couldnt be deleted 
                    console.log(err)
                    setShowPromptDialog(true)
                    setDialogTitleText('Error deleting question!!')
                    setDialogDescText('This question couldnt be deleted for some reason. Please refresh the chapter.: ' + err)
                    // TODO: set return statement

                }
            }
            else {
                // if its a new question thats not in firestore
                setShowPromptDialog(true)
                setDialogTitleText('Question was deleted!!')
                setDialogDescText('This question has been deleted')
                // TODO: set return statement
                
            }
        }
        setShowLoadingOverlay(false);
    }
}

// function to delete lesson
export function deleteLesson(selectedChapter, setShowLoadingOverlay, setShowPromptDialog, setDialogDescText, setDialogTitleText){
    return async(lessonId) => {
        setShowLoadingOverlay(true)

        // if the current chapter is new and not in firestore
        if(selectedChapter.chapter_id == '') {
            console.log('current chapter not in firestore')
            setShowPromptDialog(true)
            setDialogTitleText('Lesosn was deleted!')
            setDialogDescText('This lesson has been deleted')
        }

        // only if existing chapter is already in firestore
        else{
            let chaptersRefDoc = doc(db, "Chapters", selectedChapter.chapter_id);
            let lessonRef = doc(chaptersRefDoc, 'lessons', lessonId)
            let lessonSnap = await getDoc(lessonRef)
            if(lessonSnap.exists()){
                console.log(lessonSnap.data())
                try{
                    // if the lesson was found, delete it and then show confirmation
                    await deleteDoc(lessonRef).then(val => {
                        console.log(val)
                        setShowPromptDialog(true)
                        setDialogTitleText('Lesosn was deleted!!')
                        setDialogDescText('This lesson has been deleted')
                    })
                    
                }
                catch(err){
                    // show prompt that lesson couldnt be deleted 
                    console.log(err)
                    setShowPromptDialog(true)
                    setDialogTitleText('Error deleting lesson!!')
                    setDialogDescText('This lesson couldnt be deleted for some reason: ' + err)
                }
            }
            else {
                // if its a new lesson thats not in firestore
                setShowPromptDialog(true)
                setDialogTitleText('Lesson has been deleted!')
                setDialogDescText('This lesson has been deleted.')
                
            }
        }
        
        setShowLoadingOverlay(false);
    }
}

export function deleteChapter (selectedChapter, setShowLoadingOverlay, setShowPromptDialog, setDialogDescText, setDialogTitleText) {
    return async () => {
        setShowLoadingOverlay(true)
        console.log(selectedChapter.chapter_id)
        if(selectedChapter.chapter_id == '') {
            setShowPromptDialog(true)
            setDialogTitleText('Chapter has been deleted!')
            setDialogDescText('This chapter has been deleted')
        }
        else{
            let chaptersRefDoc = doc(db, "Chapters", selectedChapter.chapter_id);
            let chapterSnap = await getDoc(chaptersRefDoc)
            if(chapterSnap.exists()){
                console.log(chapterSnap.data())
                // delete from chapters collection
                try{
                    await deleteDoc(chaptersRefDoc).then(val => {
                        console.log(val)
                        setShowPromptDialog(true)
                        setDialogTitleText('Chapter was deleted!!')
                        setDialogDescText('This chapter has been deleted')
                    })

                    // recount chapter numbers
                    recountChapterNumbers()

                    // then remove the chapter's associated progress from students
                    let studentsRefCollection = collection(db,  'Students')
                    let studentRefDoc;
                    let studentClassroomsRef;
                    let classroom_1Ref;
                    let classroom_1ChaptersRef;
                    let studentChapterProgressQuery;
                    let chapter_id = selectedChapter.chapter_id;
                    const querySnapshot = await getDocs(studentsRefCollection);
                    querySnapshot.forEach(async (student) => {
                    // doc.data() is never undefined for query doc snapshots
                        // console.log(student.id, " => ", student.data());
                        studentRefDoc = doc(studentsRefCollection, student.id)
                        studentClassroomsRef = collection(studentRefDoc, 'Classrooms')
                        classroom_1Ref = doc(studentClassroomsRef, 'classroom_1')
                        classroom_1ChaptersRef = collection(classroom_1Ref,  'Chapters')

                        // find the chapter document that has the id of the published chapter
                        studentChapterProgressQuery = query(classroom_1ChaptersRef, where('chapter_id', "==", chapter_id))
                        var studentProgressSnapshot = await getDocs(studentChapterProgressQuery)

                        if(studentProgressSnapshot.length == 0) {
                            console.log('No students have progress in chapter: ' + selectedChapter.chapter_id)
                        }
                        // if there are students found to have progress in that chapter, delete the progress.,
                        else {
                            studentProgressSnapshot.forEach(async chapterProgress => {
                                var chapterProgressRef = doc(classroom_1ChaptersRef, chapterProgress.id)
                                await deleteDoc(chapterProgressRef).then(val => {
                                    console.log('Deleting from ' + student.id + '...')
                                    console.log(chapterProgress.id + ' progress deleted!')
                                })
                            })
                        }
                    });
                }
                catch(err){
                    // show prompt that lesson couldnt be deleted if something goes wrong
                    console.log(err)
                    setShowPromptDialog(true)
                    setDialogTitleText('Error deleting chapter!!')
                    setDialogDescText('This chapter couldnt be deleted for some reason: ' + err)
                }   
            }
        }
        setShowLoadingOverlay(false)
    }
}

// function used to create a chapter object and publish it to firestore. along with any lessons within the chapter object
export function generateAndPublishChapter( resetChapterStates, getAuthorsChapters, isCreatingChapter) {
    return async (chapter, mode, authorName) => {

        let contentCheckResponse = await checkProfanity(chapter)
        if(contentCheckResponse.profanityCount > 0){
            let returnRes = {
                code: 'PROFANITY_FOUND',
                profanity_count: contentCheckResponse.profanityCount,
                profanity_details: contentCheckResponse.profanityDetails
            }
            console.log(returnRes)
            return returnRes;
        }

        else {
            // first check if chapter has title and summary
            let validInput = true;
            let chapterLength = parseInt(chapter.chapter_length);
            let chapterDifficulty = parseInt(chapter.chapter_difficulty);
            let chapterSubCode = chapter.subscription_code == '' ? 'N/A' : chapter.subscription_code
            let questionIdArr = []

            // Checking if chapter title and desc are not empty
            if (chapter.chapter_title.trim() == "") {
                validInput = false;
                console.log("chapter title is empty");
                return {
                    code: "CHAPTER_TITLE_MISSING"
                }
            }

            if (chapter.chapter_desc.trim() == "") {
                validInput = false;
                console.log("chapter description is empty");
                return {
                    code: "CHAPTER_DESC_MISSING"
                }
            }

            // if title and desc are present
            if( validInput ) {
                var _chapter = chapter;
                let chaptersRefDoc;
                let lessonsRefCollection;
                let playgroundRefCollection;
                // object containing chapter's details
                let chapterMetadata = {
                    "author": authorName,
                    "chapter_desc": chapter.chapter_desc,
                    "chapter_number": chapter.chapter_number,
                    "chapter_difficulty": chapterDifficulty,
                    "chapter_icon_name": "character.book.closed",
                    "chapter_length": chapterLength,
                    "chapter_title": chapter.chapter_title,
                    "subscription_code": chapterSubCode
                }
                let chaptLessons = _chapter.lessons;
                let chaptPlayground = _chapter.playground;
                if(mode == "update") {
                    let chapterId = chapter.chapter_id;
                    chaptersRefDoc = doc(db, "Chapters", chapterId); // reference of firebase document with the chapter that will update
                    lessonsRefCollection = collection(chaptersRefDoc, "lessons"); // reference to the lessons subcollection inside of the chapter
                    playgroundRefCollection = collection(chaptersRefDoc, 'playground') // reference to the playground subcollection
                    await setDoc(chaptersRefDoc, chapterMetadata)
                    .then(res => {
                        console.log(res);
                    })
                    .catch(err => {
                        // TODO: identify possible error code. None found so far
                        console.log(err);
                        console.log({ "code": "UNEXPECTED_UPLOAD_ERR", "details": "unexpected chapter uploade rror" });
                        return {
                            code: "CHAPTER_UPLOAD_FAILED"
                        }
                    });

                    
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
                            return {
                                code: "CHAPTER_UPLOAD_FAILED"
                            }
                        }
                    }

                    // upload playground quesitions
                    for (var i = 0; i < chaptPlayground.length; i++) {
                        questionIdArr.push(chaptPlayground[i].id)
                        let playgroundRefDoc = doc(playgroundRefCollection, chaptPlayground[i].id)
                        try {
                            let playgroundObj = {
                                code_blocks: chaptPlayground[i].code_blocks,
                                id: chaptPlayground[i].id,
                                question_description: chaptPlayground[i].question_description,
                                question_title: chaptPlayground[i].question_title,
                                question_type: chaptPlayground[i].question_type
                            }
                            if(chaptPlayground[i].mcq_answers) {
                                playgroundObj['mcq_answers'] = chaptPlayground[i].mcq_answers
                            }
                            
                            let updatePlaygroundOperation = await setDoc(playgroundRefDoc, playgroundObj);
                            console.log(updatePlaygroundOperation);
                        }
                        catch (err) {
                            console.log("updating playgrounds failed");
                            return {
                                code: "CHAPTER_UPLOAD_FAILED"
                            }
                        }
                    }

                    // reset chapter editor related states 
                    resetChapterStates();
                    // reset student progress in chapter
                    resetStudentPlaygroundProgress(chapterId, questionIdArr)
                    // refresh list of chapters in right panel
                    getAuthorsChapters(false);
                    return {
                        code: "CHAPTER_UPDATED"
                    }

                }
                else if(mode == "add") {
                    chaptersRefDoc = doc(collection(db, "Chapters"));
                    lessonsRefCollection = collection(chaptersRefDoc, "lessons");
                    playgroundRefCollection = collection(chaptersRefDoc, 'playground')
                    await setDoc(chaptersRefDoc, chapterMetadata )
                    .then(res => {
                        console.log(res); // this returns nothing
                    })
                    .catch(err => {
                        // TODO: identify possible error code. None found so far
                        console.log(err);
                        console.log({ "code": "UNEXPECTED_UPLOAD_ERR", "details": "unexpected chapter uploade rror" });
                        return { 
                            code: "CHAPTER_UPLOAD_FAILED"
                        }
                    });

                    if(isCreatingChapter) {
                        // Looping over each lesson and writing it to the lessons collection
                        for (var i = 0; i < chaptLessons.length; i++) {

                            // Grabbing the specific lessonn
                            let lessonsRefDoc = doc(lessonsRefCollection, chaptLessons[i].lesson_id);

                            try {
                                let addLessonsOperation = await setDoc(lessonsRefDoc, {
                                    "lesson_content": chaptLessons[i].lesson_content
                                });
                                console.log(addLessonsOperation); // this returns nothuing
                            }
                            catch (err) {
                                console.log("updating lessons failed");
                                return {
                                    code: "CHAPTER_UPLOAD_FAILED"
                                }
                            }
                        }
                    }

                    // upload playground quesitions
                    for (var i = 0; i < chaptPlayground.length; i++) {
                        let playgroundRefDoc = doc(playgroundRefCollection, chaptPlayground[i].id)
                        try {
                            let playgroundObj = {
                                code_blocks: chaptPlayground[i].code_blocks,
                                id: chaptPlayground[i].id,
                                question_description: chaptPlayground[i].question_description,
                                question_title: chaptPlayground[i].question_title,
                                question_type: chaptPlayground[i].question_type
                            }
                            if(chaptPlayground[i].mcq_answers) {
                                playgroundObj['mcq_answers'] = chaptPlayground[i].mcq_answers
                            }
                            let updatePlaygroundOperation = await setDoc(playgroundRefDoc, playgroundObj);
                            console.log(updatePlaygroundOperation);
                        }
                        catch (err) {
                            console.log("updating playgrounds failed");
                            return {
                                code:"CHAPTER_UPLOAD_FAILED"
                            }

                        }
                    }

                    // reset chapter editor related states 
                    resetChapterStates();
                    // update chapter numbers
                    recountChapterNumbers();
                    // refresh list of chapters in right panel
                    getAuthorsChapters(false);
                    return {
                        code: "CHAPTER_PUBLISHED"
                    }

                }
                else {
                    console.log("mode can only update or add")
                }
            }
        }
    
    };
}

// generates a new lesson and adds them in the selected chapter's lesson list so it can be rendered
export function generateNewLesson(isCreatingChapter, selectedChapter, setSelectedChapter, setSelectedLesson, setOriginalLessonContent) {
    return async () => {
        let newLesson = null;
        let clonedChapter = null;
        
        // if user is currently creating a new chapter (not in database)
        if (isCreatingChapter) {
            clonedChapter = selectedChapter;

            let lessonUuid =  uuidv4(); // generates unique id for lesson
            console.log(lessonUuid)
            let lessonNum = clonedChapter.lessons.length + 1;
            newLesson = templateLesson;
            newLesson.lesson_id = lessonUuid;
            newLesson.lesson_title = `Untitled lesson ${lessonNum}`;
            newLesson.lesson_content[0] = "Untitled lesson";
            newLesson.lesson_content[1] = "New textbox";
            var lessonArr = clonedChapter.lessons;
            lessonArr.push(JSON.parse(JSON.stringify(newLesson)));
            setSelectedChapter({ ...clonedChapter, lessons: lessonArr });
            setSelectedLesson(selectedChapter.lessons[lessonNum - 1]);
            setOriginalLessonContent(selectedChapter.lessons[lessonNum - 1])
        }

        // if user is currently modifying an existing chapter in the database
        else {
            console.log("adding blank lesson to the existing chapter list");
            clonedChapter = selectedChapter;

            let lessonUuid =  uuidv4();
            console.log(lessonUuid)
            let lessonNum = clonedChapter.lessons.length + 1;
            newLesson = templateLesson;
            newLesson.lesson_id = lessonUuid;
            newLesson.lesson_title = `Untitled lesson ${lessonNum}`;
            newLesson.lesson_content[0] = "Untitled lesson";
            newLesson.lesson_content[1] = "New textbox";
            var lessonArr = clonedChapter.lessons;
            lessonArr.push(JSON.parse(JSON.stringify(newLesson)));
            setSelectedChapter({ ...clonedChapter, lessons: lessonArr });
            setSelectedLesson(selectedChapter.lessons[lessonNum - 1]);
            setOriginalLessonContent(selectedChapter.lessons[lessonNum - 1])

            
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
export function getSelectedChapterDetails(setLessonContentRetrieved, setPlaygroundQuestionsRetrieved, setSelectedChapter, setOpenTab, setSelectedLesson, setSelectedPlaygroundQuestion, setIsCreatingChapter, setShowLoadingOverlay, setDrawerOpen, setShowPromptDialog, setDialogTitleText, setDialogDescText) {
    return async (docId) => {
        setShowLoadingOverlay(true)
        setLessonContentRetrieved(false);
        setPlaygroundQuestionsRetrieved(false);
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
            setSelectedPlaygroundQuestion(null);
            // disabling the creatingMode flag (only when creating a new chapter)
            setIsCreatingChapter(false);
            setShowLoadingOverlay(false);
            setDrawerOpen(false)
        } else {
            // this shouldnt happen
            console.log("Requested document not found!!");
            setShowPromptDialog(true)
            setDialogTitleText('Requested lesson not found!')
            setDialogDescText('This lesson was not found. Please refresh lesson list.')
            setShowLoadingOverlay(false);
        }
    };
}

// used to get the lessons of the specified chapter
export function getCurrChapterLessons(selectedChapter, setSelectedChapter, setLessonContentRetrieved, setShowLoadingOverlay) {
    return async () => {
        // only do this if the user isnt making a brand new chapter
        // if(!isCreatingChapter) {
        console.log("retrieving chapter's lessons...");
        setShowLoadingOverlay(true)
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
        setShowLoadingOverlay(false)
    };
}

// function to get current chapter's playground questions
export function getChapterPlaygroundQuestions(selectedChapter, setSelectedChapter, setPlaygroundQuestionsRetrieved, setShowLoadingOverlay){
    return async () => {
        setShowLoadingOverlay(true)
        let chapterDocRef = doc(db, "Chapters", selectedChapter.chapter_id);
        const querySnapshot = await getDocs(collection(chapterDocRef, "playground"));
        let playgroundQuestions = [];
        let questionObj;
        querySnapshot.forEach(doc => {
            
            questionObj = {
                "question_title": doc.data().question_title,
                "question_type": doc.data().question_type,
                "id": doc.data().id,
                "question_description": doc.data().question_description,
                "code_blocks": doc.data().code_blocks
            }

            if(questionObj.question_type == "mcq"){
                questionObj['mcq_answers'] = doc.data().mcq_answers
            }

            playgroundQuestions.push(questionObj)
            
        });
        console.log(playgroundQuestions);
        setSelectedChapter({...selectedChapter, playground: playgroundQuestions})
        setPlaygroundQuestionsRetrieved(true)
        setShowLoadingOverlay(false)
    }
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