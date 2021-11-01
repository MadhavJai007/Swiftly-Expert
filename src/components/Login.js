import React, {useRef, useState, useEffect} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const {login, getUser, currentUser} = useAuth();
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    // useEffect(() => {
    //     console.log()
    // }, [errorMsg])

    async function handleSubmit(e) {
        e.preventDefault();
        try {
            let statusCode = await login(emailRef.current.value, passwordRef.current.value)
            switch(statusCode.code) {
                case "LOGIN_FOUND":
                    let loginCode = await getUser(emailRef.current.value)
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
            <div>
                Login
            </div>
            <br/>
            {/* <p>{currentUser ? `Currently signed in as: ${currentUser.email}` : `Not signed in`}</p> */}
            {errorMsg}
            <form onSubmit={handleSubmit}>
                <label>Email</label>
                <input type="email" className="" ref={emailRef} name="email" placeholder="enter your email" required/>
                <br/>
                <label>Password</label>
                <input type="password" className="" ref={passwordRef} name="password" placeholder="enter your password" required/>
                <br/>
                <button disabled={loading} type="submit" className="">log in</button>
            </form>
            <br/>
            <div>
               Need an account? <Link to="/signup">Sign up</Link>
            </div>
        </>
    )
}

export default Login

