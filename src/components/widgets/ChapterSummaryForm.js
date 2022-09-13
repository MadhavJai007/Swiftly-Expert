import React from "react";
import {
  Container,
  Box,
  Paper,
  Grid,
  useMediaQuery,
  CssBaseline,
  AppBar,
  IconButton,
  Typography,
  SpeedDialAction,
  Divider,
  Drawer,
  Tab,
  Tabs,
  TextField,
  Slider,
  Input,
  Select,
  FormControl,
  InputLabel,
  MenuItem,
  Button,
} from "@mui/material";


const ChapterSummaryForm = ({
    onInputChange,
    selectedChapter,
    setSelectedChapter,
}) => {

    /* chapter length slider */

    const handleChapLenInputBlur = () => {
        if(selectedChapter['chapter_length'] < 1 ){
            // setChapLen(1)
            let _chapterObj = { ...selectedChapter };
            _chapterObj['chapter_length'] = 1;
            setSelectedChapter(_chapterObj);
        }
        else if(selectedChapter['chapter_length'] > 121) {
            // setChapLen(121)
            let _chapterObj = { ...selectedChapter };
            _chapterObj['chapter_length'] = 121;
            setSelectedChapter(_chapterObj);
        }
    }


  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        p: 1,
        m: 1,
        alignItems: "center",
      }}
    >
      <Typography variant="h6">
        Edit the summary and other metadata for this chapter
      </Typography>

      {/* first row: chapter number, title and subscription code */}
      <Box
        sx={{
          "& .MuiTextField-root": {
            m: 2,
            mt: 4,
            width: "25ch",
          },
        }}
      >
        <TextField
          disabled
          id="chapter-num-txt"
          label="Chapter number"
          value={selectedChapter.chapter_number}
        />
        <TextField
          id="chapter-name-txt"
          label="Chapter title"
          value={selectedChapter.chapter_title}
          onChange={(e) => onInputChange(e, 'chapter', 'chapter_title', 0)}
        />
        <TextField
          id="sub-code-txt"
          label="Subscription code"
          value={selectedChapter.subscription_code}
          onChange={(e) => onInputChange(e, 'chapter','subscription_code', 0)}
        />
      </Box>

      {/* second row: description box */}
      <Box
        sx={{
          m: 3,
          p: 2,
          width: "25%",
        }}
      >
        <TextField
          id="chapter-desc-textarea"
          label="Chapter description"
          multiline
          rows={5}
          fullWidth
          value={selectedChapter.chapter_desc}
          onChange={(e) => onInputChange(e, 'chapter','chapter_desc', 0)}
        />
      </Box>

      {/* length and difficulty sliders */}
      <Box
        sx={{
          display: "flex",
        }}
      >
        <Box
          sx={{
            width: 300,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 2,
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              "& .MuiInput-root": {
                ml: 2,
                width: "6ch",
              },
            }}
          >
            <Typography
              sx={{
                pt: 1,
              }}
              gutterBottom
            >
              Chapter length (mins):{" "}
            </Typography>
            <Input
              value={selectedChapter.chapter_length}
              size="small"
              onChange={(e) => onInputChange(e, 'chapter', 'chapter_length', 0)}
              onBlur={handleChapLenInputBlur}
              inputProps={{
                step: 10,
                min: 1,
                max: 121,
                type: "number",
              }}
            />
          </Box>
          <Slider
            sx={{
              my: 2,
            }}
            aria-label="chapter-len-slider"
            value={selectedChapter.chapter_length}
            onChange={(e) => onInputChange(e, 'chapter', 'chapter_length', 0)}
            valueLabelDisplay="auto"
            min={0}
            max={121}
          />
        </Box>

        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            mx: 2,
            px: 2,
          }}
        >
          <Typography>Difficulty</Typography>
          <Select
            sx={{
              m: 2,
              minWidth: 125,
            }}
            id="chap-diff-select"
            value={selectedChapter.chapter_difficulty}
            onChange={(e) => onInputChange(e, 'chapter','chapter_difficulty', 0)}
          >
            <MenuItem value={1}>Easy</MenuItem>
            <MenuItem value={2}>Medium</MenuItem>
            <MenuItem value={3}>Hard</MenuItem>
          </Select>
        </Box>
      </Box>
    </Box>
  );
}


export default ChapterSummaryForm;