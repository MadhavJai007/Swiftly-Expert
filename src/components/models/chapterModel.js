// model of the chapter
// and other miscellaneous objects needed for the dashboard

// template object for a chapter entity. Used for making instances of chapter objects and storing new and modified instances in firebase
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

// similarly to the chapter object, this is a lesson model that can be used to create a lesson entity. The id, title and content are the properties of this model.
// lesson content is an array that will the a list of strings. Each string represents a text block that can be a paragraph of refgular text or a code snippet
export const templateLesson = {
    lesson_id: '',
    lesson_title: '',
    lesson_content: []
}