import React, { useState, useEffect } from "react";
import LoginForm from "../components/LoginForm";

const LoginPage = () => {
  // state variables
  const [errorMsg, setErrorMsg] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const mockDatabase = [
    {
      email: "bond007@email.com",
      password: "Jamesbond",
    },
  ];

  // JSON object of errors
  const errors = {
    email: "invalid email",
    pass: "invalid password",
  };

  // generates JSX code for error message
  const renderErrorMsg = (name) =>
    name === errorMsg.name && (
      <div className="text-red-600">{errorMsg.message}</div>
    );

  // handles the login process when login button is pressed.
  const handleSubmit = (event) => {
    // prevents page reload
    event.preventDefault();
    let { email, pass } = document.forms[0];
    // find login information
    const userData = mockDatabase.find((user) => user.email === email.value);
    // compare user information with
    if (userData) {
      if (userData.password !== pass.value) {
        // invalid password
        setErrorMsg({ name: "pass", message: errors.pass });
      } else {
        setIsSubmitted(true);
      }
    } else {
      // email not found
      setErrorMsg({ name: "email", message: errors.email });
    }
  };

  // JSX code for login form
  const renderLoginForm = (
    <div>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email</label>
          <input type="email" name="email" placeholder="Enter email" required />
          {renderErrorMsg("email")}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="pass"
            placeholder="Enter password"
            required
          />
          {renderErrorMsg("pass")}
        </div>
        <div>
          <button type="submit">login</button>
        </div>
      </form>
    </div>
  );

  return (
    <div>
      {isSubmitted ? (
        <div>
          <div>Sign in</div>
          <div>Expert logged in</div>
        </div>
      ) : (
        renderLoginForm
      )}
    </div>
  );
};

export default LoginPage;
