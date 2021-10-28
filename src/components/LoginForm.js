import React from 'react'

/* UNUSED AT THE MOMENT*/
const LoginForm = () => {
    return (
        <div>
            <form>
                <div>
                    <label>Email</label>
                    <input type="email" name="email" placeholder="Enter email" required/>
                    {/* pass the render error msg component here as prop */}
                </div>
                <div>
                    <label>Password</label>
                    <input type="password" name="pass" placeholder="Enter password" required/>
                    {/* pass the render error msg component here as prop */}
                </div>
                <div>
                    <button type="submit">login</button>
                </div>
            </form>
        </div>
    )
}

export default LoginForm
