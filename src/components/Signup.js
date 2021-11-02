import React, {useRef, useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'

const Signup = () => {
    //reference variables
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const usernameRef = useRef();
    const firstNameRef = useRef();
    const lastNameRef = useRef();
    const countryRef = useRef();
    const dobRef = useRef();
    const {signup, addUserToExperts,checkUsername, currentUser} = useAuth();
    const [errorMsg, setErrorMsg] = useState('');
    const [loading, setLoading] = useState(false);
    const history = useHistory();

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
                                passwordConfirmRef.current.value.trim(), 
                                usernameRef.current.value.trim(), 
                                firstNameRef.current.value.trim(), 
                                lastNameRef.current.value.trim(), 
                                countryRef.current.value, 
                                dobRef.current.value.trim()
                            )
                        setErrorMsg('')
                        setLoading(true)
                        history.push("/")
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

    return (
        <>
            <div>
                Sign up
            </div>
            <br/>
            {/* <p>{currentUser ? `Currently signed in as: ${currentUser.email}` : `Not signed in`}</p> */}
            {errorMsg}
            <form onSubmit={handleSubmit}>
                <label>Username</label>
                <input type="text" className="" ref={usernameRef} name="username" placeholder="Enter your username" onBlur={ async () => { 
                        let result = await checkUsername(usernameRef.current.value.trim());
                        if(result.code === "USERNAME_TAKEN") {
                            setLoading(true)
                        } else if (result.code === "USERNAME_FREE") {
                            setLoading(false)
                        } else if(result.code === "EMPTY_STRING") {
                            setLoading(true)
                        }
                    }} required />
                <br/>
                <label>First name</label>
                <input type="text" className="" ref={firstNameRef} name="firstname" placeholder="Enter your first name" required />
                <br/>
                <label>Last name</label>
                <input type="text" className="" ref={lastNameRef} name="lastname" placeholder="Enter your last name" required />
                <br/>
                <label>Country</label>
                <input type="text" className="" ref={countryRef} name="country" placeholder="Enter your country" required />
                <br/>
                <label>Date of birth (DD/MM/YYYY)</label>
                <input type="text" className="" ref={dobRef} name="dob" placeholder="Enter your DOB" required />
                <br/>
                <label>Email</label>
                <input type="email" className="" ref={emailRef} name="email" placeholder="enter your email" required/>
                <br/>
                <label>Password</label>
                <input type="password" className="" ref={passwordRef} name="password" placeholder="enter your password" required/>
                <br/>
                <label>Re-enter password</label>
                <input type="password" className="" ref={passwordConfirmRef} name="passwordConfirm" placeholder="repeat your password" required/>
                <br/>
                <button disabled={loading} type="submit" className="">sign up</button>
            </form>
            <br/>
            <div>
                Already have an account? <Link to="/login">Log in</Link>
            </div>
        </>
    )
}

export default Signup
