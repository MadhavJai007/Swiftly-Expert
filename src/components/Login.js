import React, {useRef, useState} from 'react'
import {useAuth} from '../contexts/AuthContext'
import {Link, useHistory} from 'react-router-dom'

const Login = () => {
    const emailRef = useRef();
    const passwordRef = useRef();
    const {login, currentUser} = useAuth();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const history = useHistory();

    async function handleSubmit(e) {
        e.preventDefault();

        try {
            setError(null)
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            history.push("/")
        }
        catch {
            setError('Failed to log in')
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
            {error ? alert(error) : console.log("nothing happend")}
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

