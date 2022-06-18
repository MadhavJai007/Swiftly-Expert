import {Box, Typography} from '@mui/material'

// function that will create the tabs widgets in the dashboard
function renderTabs(openTab, setOpenTab, selectedChapter, selectedLesson, lessonContentRetrieved, getChapterLessons) {

    // object containing the tabs that will be rendered in the dasboard's editor panel
    const tabs = [
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
    
    let tabSections = tabs

    // returns the list of tab ui elements to be rendered in the dashboard
    return tabSections.map(tab => {
        return <li className="mx-2 flex-auto text-center" key={tab.number}>
            <a
                className={"text-xs font-bold px-5 py-3 shadow-lg rounded block leading-normal " +
                    (openTab === tab.number
                        ? "text-white bg-green-500"
                        : "text-green-600 bg-white")}
                onClick={e => {
                    e.preventDefault();
                    setOpenTab(tab.number);

                    console.log(selectedChapter);
                    console.log(selectedLesson);
                    // console.log(lessonOptions)
                    // If going to lessons tab and chapter is not nil, download lessons
                    if (tab.number === 2 && selectedChapter.chapter_id !== "") {
                        if (!lessonContentRetrieved) {
                            console.log("loading the lession content");
                            getChapterLessons();
                        }
                    }

                } }
            >
                {tab.tabTitle}
            </a>
        </li>;
    });
}

// The panel for each tab
const TabPanel = (props) => {
    const { children, tabValue, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={tabValue !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
        {tabValue === index && (
            <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
            </Box>
        )}
        </div>
    );
}

export default TabPanel;