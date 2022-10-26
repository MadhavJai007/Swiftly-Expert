import { useEffect } from "react"
import { Container, Box, CssBaseline } from "@mui/material"
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import { useHistory } from "react-router-dom";



const BrowseChaptersView = (props) => {
    const history = useHistory();

    return (
        <>
        <ThemeProvider theme={props.theme}>
            <Container >
                <CssBaseline/>
                <Box>
                    dasd
                </Box>
            </Container>
        </ThemeProvider>
        </>
    )
}

export default BrowseChaptersView;