const { FakeFirestore } = require('firestore-jest-mock');
const { mockCollection, mockDoc, mockWhere, mockDelete } = require('firestore-jest-mock/mocks/firestore');
import {initializeApp} from "firebase/app";

describe('Queries', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  const db = (simulateQueryFilters = false) =>
    new FakeFirestore(
      {
        Chapters: [
          {
            id: "chapter_002",
            chapter_title: "Organizing code",
            author: "user19",
            chapter_desc: "Chapter 002 desc",
            chapter_difficulty: 2,
            chapter_length: 25,
            chapter_number: 2,
            _collections: {
              playground: [
                { id: '01e508cf-6ead-41e1-845a-fc5250cf677a', code_blocks: ['True', 'False'], mcq_answers: ['True'], question_desc: "question desc", question_title: 'Xcode files', question_type: 'mcq'   },
                { id: '2a13842f-dc13-4e73-bb9f-31d1f46789f2', code_blocks: ['New option 1', 'New option 2'], question_desc: "question desc", question_title: 'The question of your title', question_type: 'code_blocks'   },
              ],
              lessons: [
                {id: 'lesson_001', lesson_content: ['lesosn title', 'new text', 'image url']},
                {id: 'lesson_002', lesson_content: ['lesosn title', 'new text', 'image url']}
              ]
            }
          },
          {
            id: "chapter_004",
            chapter_title: "page navigation",
            author: "user19",
            chapter_desc: "Chapter 004 desc",
            chapter_difficulty: 1,
            chapter_length: 15,
            chapter_number: 1,
            _collections: {
              playground: [
                { id: 'question_1', code_blocks: ['True', 'False'], mcq_answers: ['True'], question_desc: "question desc", question_title: 'Xcode files', question_type: 'mcq'   },
                { id: 'question_2', code_blocks: ['New option 1', 'New option 2'], question_desc: "question desc", question_title: 'The question of your title', question_type: 'code_blocks'   },
              ],
              lessons: [
                {id: 'lesson_001', lesson_content: ['lesosn title', 'new text', 'image url']},
                {id: 'lesson_002', lesson_content: ['lesosn title', 'new text', 'image url']}
              ]
            }
          },
          {
            id: "chapter_006",
            chapter_title: "test chapter",
            author: "user19",
            chapter_desc: "Chapter 006 desc",
            chapter_difficulty: 3,
            chapter_length: 55,
            chapter_number: 3,
            _collections: {
              playground: [
                { id: '73cc71fc-64c2-46c1-9562-a7bc51b7e58b', code_blocks: ['True', 'False'], mcq_answers: ['True'], question_desc: "question desc", question_title: 'Xcode files', question_type: 'mcq'   },
                { id: '96c5da32-aa69-482f-b722-aee8a5224215', code_blocks: ['New option 1', 'New option 2'], question_desc: "question desc", question_title: 'The question of your title', question_type: 'code_blocks'   },
              ],
              lessons: [
                {id: 'lesson_001', lesson_content: ['lesosn title', 'new text', 'image url']},
                {id: 'lesson_002', lesson_content: ['lesosn title', 'new text', 'image url']}
              ]
            }
          },
        ]
      },
      { simulateQueryFilters },
      { mutable: true }
    );

    const mdb = () =>
    new FakeFirestore(
      {
        Chapters: [
          {
            id: "chapter_002",
            chapter_title: "Organizing code",
            author: "user19",
            chapter_desc: "Chapter 002 desc",
            chapter_difficulty: 2,
            chapter_length: 25,
            chapter_number: 2,
            _collections: {
              playground: [
                { id: '01e508cf-6ead-41e1-845a-fc5250cf677a', code_blocks: ['True', 'False'], mcq_answers: ['True'], question_desc: "question desc", question_title: 'Xcode files', question_type: 'mcq'   },
                { id: '2a13842f-dc13-4e73-bb9f-31d1f46789f2', code_blocks: ['New option 1', 'New option 2'], question_desc: "question desc", question_title: 'The question of your title', question_type: 'code_blocks'   },
              ],
              lessons: [
                {id: 'lesson_001', lesson_content: ['lesosn title', 'new text', 'image url']},
                {id: 'lesson_002', lesson_content: ['lesosn title', 'new text', 'image url']}
              ]
            }
          },
          {
            id: "chapter_004",
            chapter_title: "page navigation",
            author: "user19",
            chapter_desc: "Chapter 004 desc",
            chapter_difficulty: 1,
            chapter_length: 15,
            chapter_number: 1,
            _collections: {
              playground: [
                { id: 'question_1', code_blocks: ['True', 'False'], mcq_answers: ['True'], question_desc: "question desc", question_title: 'Xcode files', question_type: 'mcq'   },
                { id: 'question_2', code_blocks: ['New option 1', 'New option 2'], question_desc: "question desc", question_title: 'The question of your title', question_type: 'code_blocks'   },
              ],
              lessons: [
                {id: 'lesson_001', lesson_content: ['lesosn title', 'new text', 'image url']},
                {id: 'lesson_002', lesson_content: ['lesosn title', 'new text', 'image url']}
              ]
            }
          },
          {
            id: "chapter_006",
            chapter_title: "test chapter",
            author: "user19",
            chapter_desc: "Chapter 006 desc",
            chapter_difficulty: 3,
            chapter_length: 55,
            chapter_number: 3,
            _collections: {
              playground: [
                { id: '73cc71fc-64c2-46c1-9562-a7bc51b7e58b', code_blocks: ['True', 'False'], mcq_answers: ['True'], question_desc: "question desc", question_title: 'Xcode files', question_type: 'mcq'   },
                { id: '96c5da32-aa69-482f-b722-aee8a5224215', code_blocks: ['New option 1', 'New option 2'], question_desc: "question desc", question_title: 'The question of your title', question_type: 'code_blocks'   },
              ],
              lessons: [
                {id: 'lesson_001', lesson_content: ['lesosn title', 'new text', 'image url']},
                {id: 'lesson_002', lesson_content: ['lesosn title', 'new text', 'image url']}
              ]
            }
          },
        ]
      },
      { mutable: true }
    );


  // tests related to chapters   
  describe('Chapter tests', () => {

    // test to get chapters for logged in user
    test("retrieving chapters of logged in user", async () => {
      expect.assertions(3);
      let profileObj = { username: 'user19'} // argument for this function
      const records = await db()
        .collection('Chapters')
        .where("author", "==", profileObj.username)
        .get();
      expect(mockCollection).toHaveBeenCalledWith('Chapters');
      const doc = records.docs[0];
      const data = doc.data();
      expect(data).toBeDefined();
      expect(data).toHaveProperty('author', profileObj.username);
    });

    // getting details of specific chapters
    test("getting details of specific chapter", async () => {
      expect.assertions(4)
      let chapterDocId = "chapter_002" // argument for this function
      const chapter = await db()
        .collection('Chapters')
        .doc(chapterDocId)
        .get();
      expect(mockCollection).toHaveBeenCalledWith('Chapters');
      expect(mockDoc).toHaveBeenCalledWith(chapterDocId)
      expect(chapter.exists).toBe(true);
      expect(chapter.id).toBe(chapterDocId);
    })

    // test to get lessons of specified chapter
    test("get lessons of specified chapter", async () => {
      expect.assertions(4)
      let chapterDocId = "chapter_002" // argument for this function
      let chapterLessons = db()
        .collection('Chapters')
        .doc(chapterDocId)
        .collection('lessons');
      expect(chapterLessons.path).toBe(`Chapters/${chapterDocId}/lessons`);

      const lessons = await chapterLessons.get()
      expect(lessons.docs.length).toBe(2)
      expect(lessons.forEach).toBeTruthy();

      const lessonRef = lessons.docs[0]
      const lessonRefData = lessonRef.data()
      expect(lessonRefData).toHaveProperty('lesson_content');
    })

    // test to get playground of specified chapter
    test("get playground questions of specified chapter", async () => {
      expect.assertions(5)
      let chapterDocId = "chapter_004" // argument for this function
      let chapterPlayground = db()
        .collection('Chapters')
        .doc(chapterDocId)
        .collection('playground');
      expect(chapterPlayground.path).toBe(`Chapters/${chapterDocId}/playground`);

      const playgrounds = await chapterPlayground.get()
      expect(playgrounds.docs.length).toBe(2)
      expect(playgrounds.forEach).toBeTruthy();

      const playgroundRef = playgrounds.docs[0]
      const playgroundRefData = playgroundRef.data()
      expect(playgroundRefData).toHaveProperty('code_blocks');
      expect(playgroundRefData).toHaveProperty('question_type');
    })


    // test to delete chapter
    test('testing delete chapter', async () => {
      let chapterId = "chapter_004"

      expect.assertions(2)

      let chapterRef = mdb()
        .collection('Chapters')
        .doc(chapterId)

      expect(chapterRef.path).toBe(`Chapters/${chapterId}`)
      await chapterRef.delete()
      expect(mockDelete).toHaveBeenCalled();

    })

    // test to delete a chapter's lesson
    test('testing delete chapter lesson in firestore', async () => {
      let params = 
      {
        chapterId: "chapter_004",
        questionId: "lesson_1"
      }

      expect.assertions(2)

      let chapterLesson = mdb()
        .collection('Chapters')
        .doc(params.chapterId)
        .collection('lessons')
        .doc(params.questionId)
      
      expect(chapterLesson.path).toBe(`Chapters/${params.chapterId}/lessons/${params.questionId}`);

      chapterLesson.delete()
      expect(mockDelete).toHaveBeenCalled();

    })

    // test to delete a chapter's playground question
    test('testing delete chapter playground in firestore', async () => {
      let params = 
      {
        chapterId: "chapter_004",
        questionId: "question_1"
      }

      expect.assertions(2)

      let chapterPlaygroundQuestion = mdb()
        .collection('Chapters')
        .doc(params.chapterId)
        .collection('playground')
        .doc(params.questionId)
      
      expect(chapterPlaygroundQuestion.path).toBe(`Chapters/${params.chapterId}/playground/${params.questionId}`);

      chapterPlaygroundQuestion.delete()
      expect(mockDelete).toHaveBeenCalled();

    })

    // test to add new chapter
    test("adding a new chapter to firestore", async () => {
      let params = {
        author: 'user19',
        chapter: {
          "chapter_desc": "chapter desc",
          "chapter_number": 3,
          "chapter_difficulty": 2,
          "chapter_length": 23,
          "chapter_title": 'mock chapter',
          "lessons" : [],
          "playground": []
        }
      }

      expect(params.chapter.chapter_desc).not.toBe("")
      expect(params.chapter.chapter_title).not.toBe("")

      const chapterDetails = {
        "author": params.author,
        "chapter_desc": params.chapter.chapter_desc,
        "chapter_number": params.chapter.chapter_number,
        "chapter_difficulty": params.chapter.chapter_difficulty,
        "chapter_length": params.chapter.chapter_length,
        "chapter_title": params.chapter.chapter_title,
      }

      const chaptersRef = mdb().collection('Chapters')
      const newChapter = await chaptersRef.add(chapterDetails)
      const checkNewChapter = await newChapter.get()
      expect(checkNewChapter.exists).toBe(true);
    })

    // test to edit existing chapter
    test("editing existing chapter", async()=>{
      let params = {
        chapterId: "chapter_004",
        author: 'user19',
        chapter: {
          "chapter_desc": "chapter desc",
          "chapter_number": 3,
          "chapter_difficulty": 2,
          "chapter_length": 23,
          "chapter_title": 'mock chapter',
          "lessons" : [],
          "playground": []
        }
      }
      expect(params.chapter.chapter_desc).not.toBe("")
      expect(params.chapter.chapter_title).not.toBe("")
      const chapterDetails = {
        "author": params.author,
        "chapter_desc": params.chapter.chapter_desc,
        "chapter_number": params.chapter.chapter_number,
        "chapter_difficulty": params.chapter.chapter_difficulty,
        "chapter_length": params.chapter.chapter_length,
        "chapter_title": params.chapter.chapter_title,
      }
      const chapterRef = mdb().collection('Chapters').doc(params.chapterId)
      await chapterRef.set(chapterDetails)
      const doc = await chapterRef.get()
      expect(doc.data().chapter_length).toEqual(23);

    })

  });
});