import React from 'react'
import "./Main.css"
import AdminLogin from "./SubMains/Login/AdminLogin/AdminLogin";
import Login from "./SubMains/Login/Login";
function Main(props, ActiveContent,SetActiveContent) {
  return (
    <div>
    {(()=> {
      switch(props.ActiveContent) {
        case false:
          return <AdminLogin/>
        case true:
          return <Login/>
        default:
          return <Login/> 

      }
    })()}
    </div>
  )
}

export default Main