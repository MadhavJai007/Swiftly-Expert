import React, {useRef, useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'

const Signup = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const {signup, currentUser} = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();
        if(passwordConfirmRef.current.value !== passwordRef.current.value) {
            return setError("Passwords dont match")
        }
        try {
            setError(null)
            setLoading(true)
            await signup(emailRef.current.value, passwordRef.current.value)
            history.push("/")
        }
        catch {
            setError('Failed to create an account')
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
            {error ? alert(error) : console.log("nothing happend")}
            <form onSubmit={handleSubmit}>
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
