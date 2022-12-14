import React, {useRef, useState, useEffect, useMemo} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {LockOutlined, VisibilityOff, Visibility} from '@mui/icons-material';
import { Container, CssBaseline, Box, Avatar, Typography, TextField, FormControlLabel,
      FormControl, InputLabel, OutlinedInput,
      InputAdornment, Button, Grid, Checkbox, Link as MaterialLink, IconButton, useMediaQuery } from '@mui/material';




const LoginView = (props) => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const {login, getUserEmail, currentUser} = useAuth();
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const history = useHistory();

    
    // useEffect(() => {
    //     console.log()
    // }, [errorMsg])

    async function handleSubmit(e) {
        console.log(emailRef.current.value)
        // console.log(passwordRef.current.value)
        e.preventDefault();
        setErrorMsg("")
        // let statusCode = await login(emailRef.current.value, passwordRef.current.value)
        //     console.log(statusCode);
        try {
            let statusCode = await login(emailRef.current.value, passwordRef.current.value)
            console.log(statusCode);
            switch(statusCode.code) {
                case "LOGIN_FOUND":
                    let loginCode = await getUserEmail(emailRef.current.value)
                    console.log(loginCode)
                    if(loginCode.code === "LOGIN_SUCCESS"){
                        setLoading(true)
                        setErrorMsg("")
                        history.push("/")
                    } 
                    if (loginCode.code === "LOGIN_FAIL") {
                        setErrorMsg(loginCode.details)
                    } else {
                        setErrorMsg("Fatal, unexpected error")
                    }
                    break;
                case "INVALID_EMAIL":
                    setErrorMsg("Invalid email detected")
                    break;
                case "WRONG_PASSWORD":
                    setErrorMsg("Incorrect password")
                    break;
                case "TOO_MANY_ATTEMPTS":
                    setErrorMsg("Too many failed attempts. Account has been temporarily disabled. Please wait a while")
                    break;
                case "UNEXPECTED_ERR":
                    setErrorMsg("Unxpected error occured")
                    break;
                default:
                    setErrorMsg("Unexpected error occured")
            }            
        }
        catch(err) {
            console.log(JSON.stringify(err))
            setErrorMsg('Failed to log in')
        }
        setLoading(false)
    }

    return (
        <>
        <ThemeProvider theme={props.theme} >
        <Container component={"main"} maxWidth="xs" >
            <CssBaseline />
            <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
            >
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5" gutterBottom>
                    Login to Swiftly

                     {/* ignore these Box elements */}
                    {/* <Box sx={{ color: 'error.main' }}>error.main</Box>
                    <Box sx={{ color: 'warning.main' }}>warning.main</Box>
                    <Box sx={{ color: 'info.main' }}>info.main</Box>
                    <Box sx={{ color: 'success.main' }}>success.main</Box> */}
                </Typography>

                <br/>
                <Typography component="h1" variant="subtitle1">
                    <Box sx={{ textAlign: 'center', m: 1 }}>{errorMsg}</Box>
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                    margin="normal"
                    required
                    inputRef={emailRef}
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    autoFocus

                    />
                    <FormControl fullWidth required>
                        <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
                        <OutlinedInput
                            id='outlined-adornement-password'
                            type={showPassword ? 'text' : 'password'}
                            inputRef={passwordRef}
                            endAdornment={
                                <InputAdornment position="end">
                                  <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={() => {setShowPassword(!showPassword)}}
                                    onMouseDown={(event) => {event.preventDefault();}}
                                    edge="end"
                                  >
                                    {showPassword ? <VisibilityOff /> : <Visibility/>}
                                  </IconButton>
                                </InputAdornment>
                              }
                              label="Password"
                        />
                    </FormControl>
                    <Button
                    type="submit"
                    fullWidth
                    disabled={loading}
                    variant="contained"
                    onClick={() => {console.log(passwordRef.current); console.log(emailRef.current)}}
                    sx={{ mt: 3, mb: 2 }}
                    >
                    Sign In
                    </Button>
                    <Grid container>
                    <Grid item xs>
                        <MaterialLink href="#" variant="body2">
                        Forgot password? 
                        </MaterialLink>
                    </Grid>
                    <Grid item>
                        <Link  to="/signup" 
                        // href="#" variant="body2"
                        >
                        {"Don't have an account? Sign Up"}
                        </Link>
                    </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
        </ThemeProvider>
        </>
    )
}

export default LoginView

