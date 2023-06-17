import React from 'react'

function navBar(props,reportType,setReportType) {
  return (
    <div className='d-f-row reportNavBar'>
        <h1 className={props.reportType == 1? 'reportNavButton': "reportNavButton selectedh1" } onClick={()=> props.setReportType(0)}>Store Overview</h1>
        <h1 className={props.reportType == 0? 'reportNavButton': "reportNavButton selectedh1" } onClick={()=> props.setReportType(1)}>User Activity</h1>
    </div>
  )
}

export default navBar