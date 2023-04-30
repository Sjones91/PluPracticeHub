import React, { useState } from 'react'
import AdminLoginForm from "./AdminLoginForm.js"
import {useContext} from 'react';
import AdminHome from "../AdminArea/AdminHome.js"
import Register from "../AdminLogin/Register.js";

function AdminLogin() {
  const [admin,setAdmin] = useState(false)
  const [adminLogInState,setAdminLoginState] = useState(1)
  
  console.log(admin)
  return (
    <div>
      {(()=> {
        switch(admin) {
          case true:
            return <AdminHome setAdmin = {setAdmin} />
          case false:
              switch(adminLogInState){
                case true:
                  return <AdminLoginForm setAdminLoginState={setAdminLoginState} setAdmin = {setAdmin} />
                case false:
                  return <Register setAdminLoginState={setAdminLoginState}/>
                default:
                  return <AdminLoginForm setAdminLoginState={setAdminLoginState} setAdmin = {setAdmin} />
              }
        }
      })()}
    </div>
  )
}

export default AdminLogin;