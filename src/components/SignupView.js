import React, {useRef, useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {LockOutlined, PersonOutline, VisibilityOff, Visibility} from '@mui/icons-material';
import { Container, Box, Avatar, Typography, TextField, FormControlLabel,
    FormControl, InputLabel, OutlinedInput, CssBaseline,
    InputAdornment, Button, Grid, Checkbox, Link as MaterialLink, IconButton, useMediaQuery, MenuItem } from '@mui/material';


const SignupView = (props) => {
    //reference variables
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const usernameRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const countryRef = useRef();
    const [country, setCountry] = useState('')
    const dobRef = useRef();
    const {signup, addUserToExperts,checkUsername, currentUser} = useAuth();
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);
    const [fieldsInvalid, setFieldsInvalid] = useState(true)
    const history = useHistory();

    const countries = [
        "Canada",
        "United States",
        "United Kingdom",
        "Australia",
        "Jamaica","India", "Albania"
    ]

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg('')
        if(passwordConfirmRef.current.value !== passwordRef.current.value) {
            setErrorMsg("Passwords dont match")
        } else {
            try {
                let statusCode = await signup(emailRef.current.value, passwordRef.current.value)
                switch(statusCode.code) {
                    case "EMAIL_AVAILABLE":
                        let res = await addUserToExperts(
                                emailRef.current.value.trim(),
                                usernameRef.current.value.trim(), 
                                firstNameRef.current.value.trim(), 
                                lastNameRef.current.value.trim(), 
                                country, 
                                dobRef.current.value.trim()
                            )
                        if(!res) { // check if response is empty. if it is then it's succesfull
                            setErrorMsg('')
                            setLoading(true)
                            history.push("/")
                        }
                        else {
                            setErrorMsg(res.details)
                        }
                        break;
                    case "EMAIL_TAKEN":
                        setErrorMsg(statusCode.details)
                        break;
                    case "PASSWORD_TOO_WEAK":
                        setErrorMsg(statusCode.details)
                        break;
                    case "UNEXPECTED_ERR":
                        setErrorMsg(statusCode.details)
                        break;
                    default:
                        setErrorMsg("Unexpected error occured")
                }
            }
            catch {
                setErrorMsg('Failed to create an account')
            }
        }
        setLoading(false)
    }


    // checks if fields are valid or not
    const isFieldInvalid = () => {
        let emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
        let dateRegex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/
        if(emailRef.current.value.toLowerCase().match(emailRegex)
         && firstNameRef.current.value !== ''
         && lastNameRef.current.value !== ''
         && country !== ''
         && dobRef.current.value.match(dateRegex)
        ){
            setFieldsInvalid(false)
        }
        else{
            setFieldsInvalid(true)
        }
    }

    const checkUsernameValid = async () => {
        console.log(usernameRef.current.value)
        let result = await checkUsername(usernameRef.current.value.trim());
        if (result.code === "USERNAME_TAKEN") {
            setLoading(true);
            setErrorMsg(result.details);
        } else if (result.code === "USERNAME_FREE") {
            setLoading(false);
            setErrorMsg('');
        } else if (result.code === "EMPTY_STRING") {
            setLoading(true);
        }
    }

    const handleCountrySelect =(e) => {
        setCountry(e.target.value)
    } 


    return (
        <>
            <ThemeProvider theme={props.theme}>
                <Container component={"main"} maxWidth="xs" >
                    <CssBaseline />
                    <Box
                     sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}>
                        <Avatar sx={{ m: 1, bgcolor: 'success.main' }}>
                            <PersonOutline />
                        </Avatar>
                        <Typography component="h1" variant="h5" gutterBottom>
                            Sign up
                        </Typography>
                        <Typography component={'p'} variant='p' color={'error'} sx={{my: 2}}>
                            {errorMsg}
                        </Typography>
                        <Box component={'form'} onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                            <TextField 
                                margin="normal"
                                required
                                inputRef={usernameRef}
                                fullWidth
                                id="username"
                                label="Enter username"
                                name="username"
                                onBlur={checkUsernameValid}
                                // onChange={() => {console.log(usernameRef.current.value)}}
                                // autoComplete="email"
                                autoFocus
                            />
                            <TextField
                                required
                                margin='normal' 
                                inputRef={firstNameRef}
                                fullWidth
                                id='firstName'
                                label='First name' 
                                name='firstName'
                                onBlur={isFieldInvalid}
                            />
                            <TextField
                                required
                                margin='normal' 
                                inputRef={lastNameRef}
                                fullWidth
                                id='lastName'
                                label='Last name' 
                                name='lastName'
                                onBlur={isFieldInvalid}
                            />
                            <TextField
                                required
                                fullWidth
                                margin='normal'
                                id="country-select"
                                select
                                label="Country"
                                value={country == '' ? 'Select country' : country}
                                onChange={handleCountrySelect}
                                // SelectProps={{
                                //     native: true,
                                // }}
                            >
                                {countries.map(option => (
                                    <MenuItem key={option} value={option}>
                                        {option}
                                    </MenuItem>
                                ))}
                            </TextField>
                            <TextField
                                required
                                margin='normal' 
                                inputRef={dobRef}
                                fullWidth
                                id='dobRef'
                                label='Date of birth (DD/MM/YYYY)' 
                                name='dob'
                                onBlur={isFieldInvalid}
                            />
                            <TextField
                                required
                                margin='normal' 
                                inputRef={emailRef}
                                fullWidth
                                id='email'
                                label='Email' 
                                name='email'
                                onBlur={isFieldInvalid}
                            />
                            <FormControl fullWidth required sx={{my: 2}}>
                                <InputLabel htmlFor="password">Password</InputLabel>
                                <OutlinedInput
                                    required
                                    margin='dense'
                                    fullWidth
                                    id='password'
                                    name='password'
                                    type={showPassword ? 'text' : 'password'}
                                    inputRef={passwordRef}
                                    onBlur={isFieldInvalid}
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
                            <FormControl fullWidth required sx={{my: 1}}>
                                <InputLabel htmlFor="password">Confirm Password</InputLabel>
                                <OutlinedInput
                                    required
                                    margin='dense'
                                    fullWidth
                                    id='passwordConfirm'
                                    name='passwordConfirm'
                                    type={showPasswordConfirm ? 'text' : 'password'}
                                    inputRef={passwordConfirmRef}
                                    onBlur={isFieldInvalid}
                                    endAdornment={
                                        <InputAdornment position="end">
                                        <IconButton
                                            aria-label="toggle password visibility"
                                            onClick={() => {setShowPasswordConfirm(!showPasswordConfirm)}}
                                            onMouseDown={(event) => {event.preventDefault();}}
                                            edge="end"
                                        >
                                            {showPasswordConfirm ? <VisibilityOff /> : <Visibility/>}
                                        </IconButton>
                                        </InputAdornment>
                                    }
                                    label="Password"
                                />
                            </FormControl>
                            <Button
                                type="submit"
                                fullWidth
                                disabled={loading || fieldsInvalid}
                                variant="contained"
                                onClick={() => {console.log(passwordRef.current); console.log(emailRef.current)}}
                                sx={{ mt: 3, mb: 2 }}
                            >
                            Sign In
                            </Button>
                            <Box sx={{mb: 2}}>
                            <Link to='/login'>
                                ALready have an account? Log in.
                            </Link>
                            </Box>
                            
                        </Box>


                        
                    </Box>
                </Container>
            </ThemeProvider>
        </>
    )
}

export default SignupView
