import React, {useContext} from 'react'
import { GiExitDoor } from "react-icons/gi";
import "./admin.css"

function NavAdmin(props,setAdminDashboardState,setAdmin) {
  return (
    <div className='adminNav'>
      <section className='navButtons'>
        <div className='buttonBar d-f-row'>
          <h1 className='navButton' onClick={()=>{props.setAdminDashboardState(0)}}>Dashboard</h1>
          <h1 className='navButton' onClick={()=>{props.setAdminDashboardState(1)}}>Upload PLU's</h1>
          <h1 className='navButton' onClick={()=>{props.setAdminDashboardState(2)}}>Update PLU's</h1>
          <h1 className='navButton' onClick={()=>{props.setAdminDashboardState(3)}}>Reporting</h1>
          
        </div>
        <div className='d-f-row logout' onClick={()=>props.setAdmin(false)}>
          <GiExitDoor/>
          <p>Logout</p>
        </div>
      </section>
      <div className='underline'></div>
    </div>
    
  )
}

export default NavAdmin;