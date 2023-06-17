import React from 'react'

function InfoRow(props) {
    let date = props.date;
    let reversed_date = date.split("-").reverse().join("/");
    let smallDate = reversed_date.substring(0, 5);
  return (
    
    <div>
        <ul className='dashboardList d-f-row'>
            <li className='listItem textForSmallScreen'>{smallDate}</li>
            <li className={props.sessions === "Sessions" ? "listItem textForSmallScreen" : (props.sessions >= 5 ? 'listItem positive' : 'listItem negative')}>{props.sessions}</li>
            <li className={props.tests === "Tests Taken" ? "listItem textForSmallScreen" : (props.tests >= props.sessions * 0.25 ? 'listItem positive' : 'listItem negative')}>{props.tests}</li>
            <li className={props.passrate === "Pass Rate" ? "listItem textForSmallScreen" : (props.passrate >= 85 ? 'listItem positive' : 'listItem negative')}>{`${props.passrate} %`}</li>
            <li className='listItem textForSmallScreen'>{props.mostActive}</li>
        </ul>
    </div>
  )
}

export default InfoRow