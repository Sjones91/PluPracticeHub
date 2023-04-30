import React from 'react'
import "../../AdminArea/admin.css"
import { ImHourGlass } from "react-icons/im";
function AdminDashboard() {
  return (
    <div className='d-f-col'>
      <section className='d-f-col'>
        {/* Admin name to be grabbed from the login form. */}
        <h1 className='dashboardTitle'>Welcome Admin</h1>
        <ImHourGlass className="timerLogo"/>
        <h1 className='comingSoon'>Coming Soon</h1>
        <p className='comingSoonP'> Tools for Uploading and Updating Plu's are available.</p> 
      </section>
    </div>
  )
}

export default AdminDashboard