import React, { useEffect, useState } from 'react'
import InfoRow from './infoRow'
function TableData(props,userData) {
  const [userActivity,setUserActivity] = useState(props.userData)
  console.log(userActivity)
  useEffect(()=>{

  },[props.userData])
  return (
    <div className='infoCardSection'>
      {userActivity.length > 0 ? 
        userActivity.map((item)=>{
          
          return (
            <InfoRow userData={item}/>
          )
        })
        : <h1 className='loading'>Loading...</h1>
      }
      
    </div>
  )
}

export default TableData