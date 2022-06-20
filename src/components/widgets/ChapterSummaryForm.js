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
} from "@mui/material";


const ChapterSummaryForm = ({
  chapLen,
  setChapLen,
  chapDiff,
  setChapDiff,
}) => {

    /* chapter length slider */
    const handleLengthSliderChange = (event) => {
        setChapLen(event.target.value)
    }

    const handleLengthInputChange = (event) => {
        setChapLen(event.target.value === '' ? 1 : parseInt(event.target.value));
    }

    const handleChapLenInputBlur = () => {
        if(chapLen < 1 ){
            setChapLen(1)
        }
        else if(chapLen > 121) {
            setChapLen(121)
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
      <Typography>
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
          defaultValue="0"
        />
        <TextField
          id="chapter-name-txt"
          label="Chapter title"
          defaultValue="Hello World"
        />
        <TextField
          id="sub-code-txt"
          label="Subscription code"
          defaultValue="N/A"
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
          value={"Give your chapter a description"}
          onChange={() => {
            console.log("deez nuts");
          }}
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
              value={chapLen}
              size="small"
              onChange={handleLengthInputChange}
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
            value={typeof chapLen === "number" ? chapLen : 1}
            onChange={(e) => handleLengthSliderChange(e)}
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
          <InputLabel id="chap-diff-select-label">Difficulty</InputLabel>
          <Select
            sx={{
              m: 2,
              minWidth: 125,
            }}
            labelId="chap-diff-select-label"
            id="chap-diff-select"
            value={chapDiff}
            label="Difficulty"
            onChange={(e) => {
              setChapDiff(e.target.value);
            }}
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