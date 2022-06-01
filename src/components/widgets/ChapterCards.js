import { Box, Card, CardActions, CardContent, Typography, Button, LinearProgress } from "@mui/material";
import { green, yellow, red } from '@mui/material/colors';
import JustifyContent from "autoprefixer/lib/hacks/justify-content";

// function used to return the list of chapter cards so it can be rendered within the dashboard's right pane
export function renderChapterCards(chapterList, getChapter) {
    return chapterList.map(chapter => {

        return <Box sx={{m: 2} }>
            <Card>
                <CardContent>
                    <Typography variant="h5" component="div">
                        {chapter["chapterTitle"]}
                    </Typography>
                    <Typography sx={{ mb: 1.5 }} color="text.secondary">
                        Created by: {chapter.chapterAuth}
                    </Typography>
                    <Typography sx={{}} color="text.secondary">
                        Approx.length: {chapter["chapterLength"] + " mins"}
                    </Typography>

                    <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }} > 
                        <Typography sx={{}} variant="h6" color="text.secondary">
                            Difficulty:
                        </Typography>
                        <Typography sx={{fontWeight: 'bold'}} variant="h5" color={chapter.chapterDiff == 1 ? green["A400"] : (chapter.chapterDiff == 2 ? yellow["700"] : red["A700"] ) }>
                            {chapter.chapterDiff}
                        </Typography>
                    </Box>
                    <LinearProgress variant="determinate" value={chapter.chapterDiff == 1 ? 33 : (chapter.chapterDiff == 2 ? 66 : 100 ) } sx={{mt:1}}/>
                </CardContent>

                <CardActions>
                    <Button size="small">Edit</Button>
                </CardActions>
                
            </Card>
        </Box>

        return <button key={chapter.chapterId} onClick={() => { getChapter(chapter.chapterId); } }>
            <div className="shadow-lg rounded-xl max-w-xs p-4 bg-white dark:bg-gray-800 relative overflow-hidden">
                <div className="w-full h-full block">
                    <p className="text-gray-800 dark:text-white text-xl font-bold mb-2">
                        {chapter["chapterTitle"]}
                    </p>
                    <p className="text-gray-400 dark:text-gray-300 text-sm font-medium mb-2">
                        Created by: {chapter.chapterAuth}
                    </p>
                    <p className="text-gray-400 dark:text-gray-300 text-xs font-medium mb-2">
                        Approx.length: {chapter["chapterLength"] + " mins"}
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
                        <div className={`w-${chapter.chapterDiff}/3 h-full text-center text-xs text-white ${chapter.chapterDiff > 1 ? (chapter.chapterDiff > 2 ? `bg-red-400` : `bg-yellow-400`) : `bg-green-400`} rounded-full`} />
                    </div>
                </div>
            </div>
        </button>;
    });
}