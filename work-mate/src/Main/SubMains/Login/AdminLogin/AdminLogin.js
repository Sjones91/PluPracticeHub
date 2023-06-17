import React, { useState } from 'react'
import AdminLoginForm from "./AdminLoginForm.js"
import {useContext} from 'react';
import AdminHome from "../AdminArea/AdminHome.js"
import Register from "../AdminLogin/Register.js";

function AdminLogin() {
  const [admin,setAdmin] = useState(false)
  const [adminLogInState,setAdminLoginState] = useState(1)
  const [user,setUser] =useState("");
  const [level,setLevel] = useState(0)
  return (
    <div>
      {(()=> {
        switch(admin) {
          case true:
            return <AdminHome setAdmin = {setAdmin} user={user} level={level}/>
          case false:
              switch(adminLogInState){
                case true:
                  return <AdminLoginForm setAdminLoginState={setAdminLoginState} setAdmin={setAdmin} setUser={setUser} setLevel={setLevel}/>
                case false:
                  return <Register setAdminLoginState={setAdminLoginState}/>
                default:
                  return <AdminLoginForm setAdminLoginState={setAdminLoginState} setAdmin = {setAdmin} setUser={setUser} setLevel={setLevel} />
              }
        }
      })()}
    </div>
  )
}

export default AdminLogin;