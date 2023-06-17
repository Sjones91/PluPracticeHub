import React from 'react'
import "../../admin.css"
function infoTile(props) {
  return (
    <div className='dashboardTile'>
      <h2>{props.Title}</h2>
      <h1>{props.data}</h1> 
      <p>{props.message}</p> 
        
    </div>
  )
}

export default infoTile