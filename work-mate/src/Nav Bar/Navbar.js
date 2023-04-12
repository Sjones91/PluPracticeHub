import React from 'react'
import "./navBar.css"
function Navbar(props, ActiveContent,SetActiveContent) {
  return (
    <div className='navBar'>
      <button className={props.ActiveContent ? "button-active" : "button"} onClick={()=>{props.SetActiveContent(true)}}>Home</button>
      <button className={props.ActiveContent ? "button" : "button-active"} onClick={()=>{props.SetActiveContent(false)}}>Admin</button>
    </div>
  )
}

export default Navbar