// model of the chapter
// and other miscellaneous objects needed for the dashboard

export const chapterObj = {
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

export const templateLesson = {
    lesson_id: '',
    lesson_title: '',
    lesson_content: []
}