import { Box, Card, CardActions, CardContent, Typography, Button, LinearProgress, Paper } from "@mui/material";
import { green, yellow, red } from '@mui/material/colors';
import JustifyContent from "autoprefixer/lib/hacks/justify-content";

// function used to return the list of chapter cards so it can be rendered within the dashboard's right pane
export function renderChapterCards(chapterList, getChapter) {
    return chapterList.map(chapter => {

        return <Box key={chapter.chapterId} sx={{m: 2} }>
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
                    <Button size="small" onClick={() => {
                            getChapter(chapter.chapterId);
                        }} >Edit</Button>
                </CardActions>
                
            </Card>
        
        </Box>
    });
}