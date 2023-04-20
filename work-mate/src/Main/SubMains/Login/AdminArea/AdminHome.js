import React, {useState} from 'react'
import NavAdmin from './NavAdmin'
import "./admin.css"
import RunReport from "./RunReports/RunReport.js"
import UploadTool from "./PLUUpdates/UpdateTool.js"
import UpdatePlus from './PLUUpdates/UpdatePlus'
import AdminDashboard from "./Dashboard/AdminDashboard.js"
import UpdateTool from './PLUUpdates/UpdateTool.js'
function AdminHome() {
  //use state to manage the main content of the admin area. *KEY* 0=Dashboard 1 =UpdatePLU's 2=Reporting
  const [adminDashboardState,setAdminDashboardState] = useState(0);
  
  return (
    <div className='d-f-col '>
        <NavAdmin setAdminDashboardState={setAdminDashboardState}/>
        {(()=>{
          switch(adminDashboardState) {
            case 0:
              return <AdminDashboard/>
            case 1:
              return <UploadTool/>
            case 2: 
              return <UpdatePlus/>
            case 3:
              return <RunReport/>
            default: 
              return <AdminDashboard/>
          }
        })()}
    </div>
    
  )
}

export default AdminHome