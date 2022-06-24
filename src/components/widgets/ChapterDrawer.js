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
import { Close as CrossIcon, Refresh } from '@mui/icons-material'; 

const ChapterDrawer = ({ drawerOpen, setDrawerOpen, chapterCards }) => {
  return (
    <Drawer open={drawerOpen} anchor={"right"}>
      <Box
        sx={{
          display: "block",
          width: 480,
        }}
      >
        {/* Close drawer and refresh button button */}
        <Box
          sx={{
            backgroundColor: "#0eb67b",
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "space-between",
            mx: "auto",
            alignItems: "center",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="close drawer"
            onClick={() => setDrawerOpen(false)}
            sx={{
              ...(!drawerOpen && {
                display: "none",
              }),
              width: 40,
              p: 2.5,
            }}
          >
            <CrossIcon />
          </IconButton>
          <Typography variant="h5" component={"h4"}>
            Your chapters
          </Typography>
          <IconButton
            color="inherit"
            aria-label="refresh drawer"
            onClick={() => setDrawerOpen(false)}
            sx={{
              ...(!drawerOpen && {
                display: "none",
              }),
              width: 40,
              p: 2.5,
            }}
          >
            <Refresh />
          </IconButton>
        </Box>

        {/* List of chapter cards */}
        {/* <Box> */}
          {chapterCards.length > 0 ? chapterCards : "No Chapters found..."}
        {/* </Box> */}
      </Box>
    </Drawer>
  );
};

export default ChapterDrawer;
  