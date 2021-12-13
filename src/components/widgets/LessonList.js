
// used to render the lesson list full of content blocks within  the dashboard's lesson tab
export const renderingLessonList = (selectedLesson, insertContent, fileSelectedHandler, onInputChange, setLessonContentList) => {
    return () => {
        const array = [];
        console.log("renderLessonContent() called");

        // Looping through lesson content
        for (var i = 1; i < selectedLesson.lesson_content.length; i++) {
            let content_index = i;

            // put the add new content butttons before the first element. only happens once
            if (i === 1) {
                array.push(
                    <div key={"before_first"} className="flex flex-row items-center justify-center">
                        {/* New Paragraph */}
                        <div className="pt-5 px-2">
                            <button onClick={(e) => {
                                insertContent(e, "para", content_index, "before");
                            } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Paragraph
                            </button>
                        </div>

                        {/* New Image */}
                        <div className="pt-5 px-2">
                            <button onClick={(e) => {
                                insertContent(e, "img", content_index, "before");
                            } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                Image
                            </button>
                        </div>
                    </div>
                );
            }

            // If the content starts with data:image/ it is an image
            if (selectedLesson.lesson_content[i].startsWith("data:image/")) {


                // Push new UI into array
                array.push(

                    <div key={`lesson_info_${i}`}>

                        <div className="flex flex-row justify-center space-x-4">
                            {/* IMAGE STUFF */}
                            <div className="flex flex-col items-center justify-center w-96 ">

                                {/* This is the image */}
                                <img src={selectedLesson.lesson_content[i]} alt="Red dot" />

                                {/* This is the image picker */}
                                <div className="pt-2.5">
                                    <input type="file" onChange={(e) => fileSelectedHandler(e, content_index)} />
                                </div>
                            </div>
                            <button onClick={(e) => insertContent(e, "delete", content_index, "before") }>
                                <div className="flex rounded-full text-5xl bg-red-500 w-8 h-8 justify-center items-center pb-4 text-white">-</div>
                            </button>
                        </div>

                        {/* ADD NEW CONTENT AREA */}
                        <div key={i} className="flex flex-row items-center justify-center">

                            {/* New Paragraph */}
                            <div className="pt-5 px-2">
                                <button onClick={(e) => {
                                    insertContent(e, "para", content_index, "after");
                                } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Paragraph
                                </button>
                            </div>

                            {/* New Image */}
                            <div className="pt-5 px-2">
                                <button onClick={(e) => {
                                    insertContent(e, "img", content_index, "after");
                                } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Image
                                </button>
                            </div>
                        </div>
                    </div>
                );

            }

            // else push a text area with the array element's text.
            else {
                array.push(
                    <div key={`lesson_info_${i}`} >

                        {/* Text Area with content from lesson */}
                        <div className="flex flex-row justify-center space-x-4 ">
                            <div className="flex flex-col items-center justify-center w-96 ">
                                <textarea value={selectedLesson.lesson_content[i]}
                                    onChange={(e) =>
                                        // console.log("later")
                                        onInputChange(e, 'lesson', 'lesson_content', content_index)}
                                    className="flex-1 appearance-none border border-gray-300 w-full py-2 px-4 bg-white text-gray-700 placeholder-gray-400 rounded-lg text-base focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                                    placeholder="Enter something"
                                    rows="5" cols="40">
                                </textarea>
                            </div>
                            <button onClick={(e) => insertContent(e, "delete", content_index, "before") }>
                                <div className="flex rounded-full text-5xl bg-red-500 w-8 h-8 justify-center items-center pb-4 text-white">-</div>
                            </button>
                        </div>
                        {/* ADD NEW CONTENT AREA */}
                        <div key={i} className="flex flex-row items-center justify-center">
                            <div className="pt-5 px-2">
                                <button onClick={(e) => {
                                    insertContent(e, "para", content_index, "after");
                                } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Paragraph
                                </button>
                            </div>

                            {/* New Image */}
                            <div className="pt-5 px-2">
                                <button onClick={(e) => {
                                    insertContent(e, "img", content_index, "after");
                                } } className="py-2 px-4 flex justify-center items-center bg-green-600 hover:bg-green-700 focus:ring-green-500 focus:ring-offset-green-200 text-white w-full transition ease-in duration-200 text-center text-base font-semibold shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2  rounded-lg ">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Image
                                </button>
                            </div>


                        </div>
                    </div>
                );
            }
        }
        setLessonContentList(array);
    };
}