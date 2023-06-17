import React, { useState,useEffect } from 'react'
import "../../../admin.css"
import InfoTile from '../../../Dashboard/subComponents/infoTile';
import InfoRow from './infoRow';
function Tiles(props,storeData) {
  const [tileData,setTileData] = useState(null)
  const [loading,setLoading] = useState(true)
  useEffect(()=> {
    setTileData(props.storeData)
    setLoading(false)
  },[props.storeData])
  


  return (
    <div className='storeTiles'>
      <h1 className='updateArea tileH1'>Store Figures Overview</h1>
      {loading == false ? <div className='dashboardGrid'>
        <InfoTile Title={"Activity"} data={props.storeData.data.visits? props.storeData.data.visits : "No Data"} message={"Users Have Logged In Today"}/>
        <InfoTile Title={"Tests Taken"} data={props.storeData.data.tests? props.storeData.data.tests : "No Data"} message={"Tests Have Been Taken"}/>
        <InfoTile Title={"Pass Rate"} data={props.storeData.data.percentage == null? "No Data" : `${props.storeData.data.percentage}%` } message={"Of Questions Answered Correct"}/>
        <InfoTile Title={"Produce"} data={props.storeData.data.producePercentage == null? "No Data" : `${props.storeData.data.producePercentage}%` } message={"Of Questions Answered Correct"}/>
        <InfoTile Title={"Bakery"} data={props.storeData.data.bakeryPercentage == null? "No Data" : `${props.storeData.data.bakeryPercentage}%` } message={"Of Questions Answered Correct"}/>
      </div>
      : <h1 className='loading'>Loading...</h1>
      }
    </div>
  )
}

export default Tiles