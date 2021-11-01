import React, {createContext, useContext, useEffect, useState} from 'react'
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { collection, doc, setDoc, getDocs, query, where } from 'firebase/firestore'
import {auth, db} from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
}

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState();
    const [currentUsername, setCurrentUsername] = useState();
    const [loading, setLoading] = useState(true);

    const getUser = async email => {
        let returnCode;
        let expertsRef = collection(db, "Experts");
        const q = query(expertsRef, where("email", "==", email))
        const querySnapshot = await getDocs(q);
        
        // TODO: save querySnapshot.docs[0].data() to an object
        // TODO: save querySnapshot.docs[0]["id"] with setCurrentUsername

        if(querySnapshot.docs.length === 0) {
            returnCode = {"code": "LOGIN_FAIL", "details": "User was not found in Experts collection. Your email being used is not an Expert account"}
            return returnCode;
        }

        let result = querySnapshot.docs[0].data().email
        console.log(result)
        if(email === result){
            returnCode = {"code": "LOGIN_SUCCESS", "details": "User was found in the Experts collection. Logging you in..."}
        }
        else {
            returnCode = {"code": "LOGIN_FAIL", "details": "Username document was found in Experts collection but mismatch in associated email. Your email being used is not an Expert account"}
        }
        return returnCode;
    }

    const signup = (email, password) => {
        // returns a promise
        return createUserWithEmailAndPassword(auth, email, password);
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
        getUser
    }

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    )
}
