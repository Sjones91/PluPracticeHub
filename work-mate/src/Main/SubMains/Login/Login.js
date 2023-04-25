import React from 'react'
import { useState } from 'react'
import LoginForm from "./LoginForm.js"
import PluHome from '../../PLUDashboard/PluHome.js'
function Login() {
    const [contentChoice, setContentChoice] = useState(1);
    
    if(contentChoice === 1) {
        return <LoginForm setContentChoice = {setContentChoice}/>
    } else {
        return <PluHome/>
    }
}

export default Login