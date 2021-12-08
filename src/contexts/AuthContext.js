import React, {createContext, useContext, useEffect, useState} from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, setDoc, getDoc, getDocs, query, where } from 'firebase/firestore'
import {auth, db} from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [currentUsername, setCurrentUsername] = useState();
    const [loading, setLoading] = useState(true);

    const checkUsername = async username => {
        let returnCode;
        if(username === "") {
            console.log(username)
            returnCode = {"code": "EMPTY_STRING", "details": "Username used by another account. Please choose another"}
            return returnCode;
        }
        else {
            let expertsDocRef = doc(db, "Experts", username);
            const expertDocSnap = await getDoc(expertsDocRef);
            if(expertDocSnap.exists()){
                returnCode = {"code": "USERNAME_TAKEN", "details": "Username used by another account. Please choose another"}
                console.log("Username taken")
            } else {
                returnCode = {"code": "USERNAME_FREE", "details": "Username is free"}
                console.log("Username free")
            }
            return returnCode;
        }
    }

    const addUserToExperts = async (email, username, firstname, lastname, country, dob) => {
        let returnCode;
        let expertsDocRef = doc(db, "Experts", username);
        console.log("Username is free. adding user")
        await setDoc(expertsDocRef, {
            "country": country,
            "date_of_birth": dob,
            "email": email,
            "firstname": firstname,
            "lastName": lastname,
            "username": username
        })
        .then(res => {
            // console.log(res);
            returnCode = res;
        })
        .catch(err => {
            // TODO: identify possible error code. None found so far
            console.log(err); 
            returnCode = {"code": "UNEXPECTED_SIGNUP_ERR", "details": "unexpected sign up error. contact an administrator. check console for more details"};
        })
    }

    const getUserEmail = async email => {
        let returnCode;
        let expertsRef = collection(db, "Experts");
        const q = query(expertsRef, where("email", "==", email))
        const querySnapshot = await getDocs(q);
        
        // TODO: save querySnapshot.docs[0].data() to an object
        // TODO: save querySnapshot.docs[0]["id"] with setCurrentUsername

        if(querySnapshot.docs.length === 0) {
            returnCode = {"code": "LOGIN_FAIL", "details": "User was not found in Experts collection. The email being used is not an Expert account"}
            return returnCode;
        }

        let result = querySnapshot.docs[0].data().email
        console.log(result)
        if(email === result){
            returnCode = {"code": "LOGIN_SUCCESS", "details": "User was found in the Experts collection. Logging you in..."}
        }
        else {
            returnCode = {"code": "LOGIN_FAIL", "details": "Username document was found in Experts collection but mismatch in associated email. The email being used is not an Expert account"}
        }
        return returnCode;
    }

    const signup = async (email, password) => {
        let returnCode;
        await createUserWithEmailAndPassword(auth, email, password)
        .then(res => {
            // console.log("res: " + JSON.stringify(res));
            returnCode = {"code": "EMAIL_AVAILABLE"}
        })
        .catch(err => {
            /* possible error codes identified:
            {"code":"auth/email-already-in-use"}
            {"code":"auth/weak-password"}
            */
            let errCode = err.code;
            switch(errCode) {
                case "auth/email-already-in-use":
                    returnCode = {"code": "EMAIL_TAKEN", "details": "Email is used by another account, please use another"}
                    break;
                case "auth/weak-password":
                    returnCode = {"code": "PASSWORD_TOO_WEAK", "details": "Password too weak. Make it more complex"}
                    break;
                default:
                    console.log(JSON.stringify(err));
                    returnCode = {"code": "UNEXPECTED_ERR", "details": "Unexpected error occured"}
            }
        })
        return returnCode;
    }

    const login = async (email, password) => {
        let returnCode;
        await signInWithEmailAndPassword(auth, email, password)
        .then((res) => {
            returnCode = {"code": "LOGIN_FOUND"}
        })
        .catch(err =>{
            /* possible error codes identified:
            {"code":"auth/user-not-found","customData":{},"name":"FirebaseError"}
            {"code":"auth/wrong-password","customData":{},"name":"FirebaseError"}
            */
           let errCode = err.code;
            switch(errCode) {
                case "auth/user-not-found":
                    // setErrorMsg("Invalid email detected")
                    returnCode = {"code": "INVALID_EMAIL"}
                    break;
                case "auth/wrong-password":
                    // setErrorMsg("Incorrect password")
                    returnCode = {"code": "WRONG_PASSWORD"}
                    break;
                default:
                    // setErrorMsg("Unexpected error occured")
                    console.log(JSON.stringify(err));
                    returnCode = {"code": "UNEXPECTED_ERR"}
            }
        })
        return returnCode;
    }

    const logout = () => {
        return signOut(auth);
    }

    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setCurrentUser(user);
            setLoading(false);
        })

        return unsubscribe;
    }, [])
    

    const value = {
        currentUser,
        currentUsername,
        login,
        signup,
        logout,
        getUserEmail,
        addUserToExperts,
        checkUsername
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
