import React, { useState } from 'react'
import AdminLoginForm from "./AdminLoginForm.js"
import {useContext} from 'react';
import UserContext from '../../UserContext.js';
import AdminHome from "../AdminArea/AdminHome.js"
import Register from "../AdminLogin/Register.js"
function AdminLogin() {
  const [adminLoggedIn,setAdminLoggedIn] = useState(2)
  return (
    <div>
      {(()=> {
        switch(adminLoggedIn) {
          case 0:
            return <AdminHome/>
          case 1:
            return <AdminLoginForm setAdminLoggedIn={setAdminLoggedIn}/>
          case 2:
            return <Register setAdminLoggedIn={setAdminLoggedIn}/>
          default:
            return <AdminLoginForm/>
        }
      })()}
    </div>
  )
}

export default AdminLogin;