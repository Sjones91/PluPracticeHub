import React from 'react'
import { useState,useContext } from 'react'
import LoginForm from "./LoginForm.js"
import PluHome from '../../PLUDashboard/PluHome.js'
import { UserContext } from '../../../App.js'
function Login() {
    
    const [user, setUser] = useContext(UserContext);
    if(user == false) {
        return <LoginForm setUser={setUser}/>
    } else {
        return <PluHome/>
    }
}

export default Login