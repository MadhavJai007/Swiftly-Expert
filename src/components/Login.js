import React, {useRef, useState, useEffect} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const {login, getUserEmail, currentUser} = useAuth();
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    // useEffect(() => {
    //     console.log()
    // }, [errorMsg])

    async function handleSubmit(e) {
        e.preventDefault();
        setErrorMsg("")
        try {
            let statusCode = await login(emailRef.current.value, passwordRef.current.value)
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
                case "UNEXPECTED_ERR":
                    setErrorMsg("Unxpected error occured")
                    break;
                default:
                    setErrorMsg("Unexpected error occured")
            }            
        }
        catch {
            setErrorMsg('Failed to log in')
        }
        setLoading(false)
    }

    return (
        <>
        <body class="bg-darkCustom">
            {/* <p>{currentUser ? `Currently signed in as: ${currentUser.email}` : `Not signed in`}</p> */}

            {/* Main UI for user login information (input fields, labels, etc.) */}
            <div class = "h-screen flex flex-col items-center justify-center">
                
                    <p class="text-xl text-white mb-4"> Login to Swiftly </p>

                    <p class="text-m text-red-500 mb-2">
                        {errorMsg}
                    </p>
                    
                    {/* Form for user logging in */}
                    <form onSubmit = {handleSubmit}>

                        <input type="email" ref={emailRef} name="email" placeholder="enter your email" required class="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" />
                        <br/>

                        <input type="password" ref={passwordRef} name="password" placeholder="enter your password" required class="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" />
                        <br/>

                        <button disabled={loading} type="submit" class="bg-white w-full mt-4 p-2 border 
                              border-gray-200 rounded mb-2" > Login </button>

                        <p class = "w-full mt-4 text-white">
                            Need an account? <Link to="/signup">Sign up</Link>
                        </p>
                    </form>
            </div>
        </body>
        </>
    )
}

export default Login

