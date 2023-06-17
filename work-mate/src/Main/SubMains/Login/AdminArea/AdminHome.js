import React, {useState} from 'react'
import NavAdmin from './NavAdmin'
import "./admin.css"
import RunReport from "./RunReports/RunReport.js"
import UploadTool from "./PLUUpdates/UpdateTool.js"
import UpdatePlus from './PLUUpdates/UpdatePlus'
import AdminDashboard from "./Dashboard/AdminDashboard.js"
import UpdateTool from './PLUUpdates/UpdateTool.js'
import AdminTools from "./AdminTools/AdminTools.js"
function AdminHome(props,setAdmin, level, user) {
  //use state to manage the main content of the admin area. *KEY* 0=Dashboard 1 =UpdatePLU's 2=Reporting
  const [adminDashboardState,setAdminDashboardState] = useState(0);
  return (
    <div className='d-f-col '>
        <NavAdmin setAdminDashboardState={setAdminDashboardState} setAdmin = {props.setAdmin} level={props.level}/>
        {(()=>{
          switch(adminDashboardState) {
            case 0:
              return <AdminDashboard user={props.user}/>
            case 1:
              return <UploadTool/>
            case 2: 
              return <UpdatePlus/>
            case 3:
              return <RunReport/>
            case 4: 
              return <AdminTools/>
            default: 
              return <AdminDashboard/>
          }
        })()}
    </div>
    
  )
}

export default AdminHome