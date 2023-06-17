import React from 'react'
import "../../admin.css"
function infoTileStore(props) {
  return (
    <div className='dashboardTile'>
      <h2>{props.Title}</h2>
      <h3 className='infoTileColor'>Region - {props.Region}</h3>
      <h3 className='infoTileColor infoTileColorLast'>Store - {props.Store}</h3> 
      <p>{props.message}</p> 
        
    </div>
  )
}

export default infoTileStore