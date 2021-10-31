import React, { useState, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useHistory } from 'react-router-dom'

const Dashboard = () => {
    const [error, setError] = useState("")
    const {currentUser, logout} = useAuth()
    const history = useHistory()

    const handleLogout = async () => {
        setError('')

        try {
            await logout()
            history.push('/login')
        }
        catch {
            setError('Failed to log out')
        }
    }

    useEffect(()=>{ 
        console.log(currentUser)
    },[])

    return (
        <>
            <div>
                <p>welcome to Dashboard</p>
                <br/>
                {error && error}
                <br/>
                <p>Currently logged in as: <strong> {currentUser.email} </strong></p>
                <br/>
                <br/>
                <Link to="update-profile">Update profile</Link>
            </div>
            <br/>
            <div>
                <button type="log out" onClick={handleLogout}>log out</button>
            </div>
        </>
    )
}

export default Dashboard
