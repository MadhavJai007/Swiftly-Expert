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

    return (
        <>
            <div className="bg-darkCustom">
                <div className = "h-screen flex flex-col items-center justify-center">
                <p className="text-xl text-white mb-4">Sign up</p>
                <br/>
                {/* <p>{currentUser ? `Currently signed in as: ${currentUser.email}` : `Not signed in`}</p> */}
                <p className="text-m text-red-500 mb-2">
                        {errorMsg}
                </p>
                {/* Form for signing up */}
                <form onSubmit={handleSubmit}>
                    <label className="text-md text-white mb-4">Username</label>
                    <input type="text" className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" ref={usernameRef} name="username" placeholder="Enter your username" onBlur={ async () => { 
                            let result = await checkUsername(usernameRef.current.value.trim());
                            if(result.code === "USERNAME_TAKEN") {
                                setLoading(true)
                                setErrorMsg(result.details)
                            } else if (result.code === "USERNAME_FREE") {
                                setLoading(false)
                                setErrorMsg('')
                            } else if(result.code === "EMPTY_STRING") {
                                setLoading(true)
                            }
                        }} required />
                    <br/>
                    <label className="text-md text-white mb-4" >First name</label>
                    <input type="text" className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" ref={firstNameRef} name="firstname" placeholder="Enter your first name" required />
                    <br/>
                    <label className="text-md text-white mb-4">Last name</label>
                    <input type="text" className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" ref={lastNameRef} name="lastname" placeholder="Enter your last name" required />
                    <br/>
                    <label className="text-md text-white mb-4">Country</label>
                    <input type="text" className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" ref={countryRef} name="country" placeholder="Enter your country" required />
                    <br/>
                    <label className="text-md text-white mb-4">Date of birth (DD/MM/YYYY)</label>
                    <input type="text" className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" ref={dobRef} name="dob" placeholder="Enter your DOB" required />
                    <br/>
                    <label className="text-md text-white mb-4">Email</label>
                    <input type="email" className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" ref={emailRef} name="email" placeholder="Enter your email" required/>
                    <br/>
                    <label className="text-md text-white mb-4">Password</label>
                    <input type="password" className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" ref={passwordRef} name="password" placeholder="Enter your password" required/>
                    <br/>
                    <label className="text-md text-white mb-4">Re-enter password</label>
                    <input type="password" className="text-sm text-gray-base w-full 
                              mr-3 py-5 px-4 h-2 border 
                              border-gray-200 rounded mb-2" ref={passwordConfirmRef} name="passwordConfirm" placeholder="Repeat your password" required/>
                    <br/>
                    
                    <button disabled={loading} type="submit" className={ (loading ? 'bg-gray-300 ' : 'bg-green-500 hover:bg-green-700 ') + 'w-full mt-4 p-2 border border-gray-200 rounded mb-2'}>sign up</button>

                    <p className = "w-full mt-4 text-white">
                        Already have an account? <Link to="/login">Log in</Link>
                    </p>
                </form>
                
                <br/>
                
            </div>
            </div>
        </>
    )
}

export default Signup
