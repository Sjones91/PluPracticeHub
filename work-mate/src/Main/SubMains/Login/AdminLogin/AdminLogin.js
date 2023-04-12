import React from 'react'
import AdminLoginForm from "./AdminLoginForm.js"
import {useContext} from 'react';
import UserContext from '../../UserContext.js';
import AdminHome from "../AdminArea/AdminHome.js"
function AdminLogin() {
  const [user,] = useContext(UserContext);
  return (
    <div>
      {(()=> {
        switch(user) {
          case true:
            return <AdminHome/>
          case false:
            return <AdminLoginForm/>
          default:
            return <AdminLoginForm/>
        }
      })()}
    </div>
  )
}

export default AdminLogin;