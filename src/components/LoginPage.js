import React, { useState, useEffect, useRef } from "react";
/* firebase related import statements
  More firebase sdks can be found at:
  https://firebase.google.com/docs/web/setup#available-libraries */
import {initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";



const LoginPage = () => {

  // blank login credential object
  const blankLogin = {
    email: '',
    password: ''
  }

  // state variables
  const [errorMsg, setErrorMsg] = useState({});
  const [validationError, setValidationError] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [credentials, setCredentials] = useState(blankLogin);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // // firebase config
  // const firebaseConfig = {
  //   apiKey: "AIzaSyB5vSQaJd647yA8NOls-T6oFeHh434P99M",
  //   authDomain: "swiftly-cc556.firebaseapp.com",
  //   projectId: "swiftly-cc556",
  //   storageBucket: "swiftly-cc556.appspot.com",
  //   messagingSenderId: "848134898074",
  //   appId: "1:848134898074:web:dc32aa64026fc547117a23",
  //   measurementId: "G-4ZL16NYZF1"
  // };
  
  // // initializing firebase and analytics (might not be needed?)
  // const swiftlyFirestoreApp = initializeApp(firebaseConfig);
  // const swiftlyAnalyticsApp = getAnalytics(swiftlyFirestoreApp)

  // const auth = getAuth();

  useEffect(()=>{
    console.log(credentials);
  }, [credentials])

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

  // handles input changes in login fields
  const onInputChange = (event, name) => {
    const val = event.target.value;//(event.target && event.target.value) || '';
    let _credentials = {...credentials};
    _credentials[`${name}`] = val;
    setCredentials(_credentials);
  }

  // handles the login process when login button is pressed.
  const handleSubmit = async () => {
    // prevents page reload
    // event.preventDefault();
    let { email, password } = credentials;
    // find login information
    // await signInWithEmailAndPassword(auth, email, password)
    // .then(userCredential => {
    //   // successful signin 
    //   console.log(userCredential.user);
    // })
    // .catch(err => {
    //   console.log(err.code);
    //   console.log(err.message);
    // });

    // const userData = mockDatabase.find((user) => user.email === email.value);
    // // compare user information with
    // if (userData) {
    //   if (userData.password !== pass.value) {
    //     // invalid password
    //     setErrorMsg({ name: "pass", message: errors.pass });
    //   } else {
    //     setIsSubmitted(true);
    //   }
    // } else {
    //   // email not found
    //   setErrorMsg({ name: "email", message: errors.email });
    // }
  };

  // JSX code for login form
  const renderLoginForm = (
    <div>
      <div>
        <div>
          <label>Email</label>
          <input type="email" name="email" placeholder="Enter email" value={credentials.email} onChange={(event) => onInputChange(event, "email")} required />
          {renderErrorMsg("email")}
        </div>
        <div>
          <label>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={credentials.password}
            onChange={(event) => onInputChange(event, "password")}
            required
          />
          {renderErrorMsg("pass")}
        </div>
        <div>
          <button type="button" onClick={handleSubmit}>login</button>
        </div>
      </div>
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
