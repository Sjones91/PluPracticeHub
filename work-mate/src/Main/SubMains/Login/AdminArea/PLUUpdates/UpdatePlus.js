import React, {useState,useEffect} from 'react'
import PopUp from './SubComponents/PopUp';
import PluUpdateList from './SubComponents/PluUpdateList';
function UpdatePlus() {
  const [popUp, setPopUp] = useState(false)
  const [validation, setValidation] = useState(false)
  
  const clearDatabaseHandler = () => {
    setPopUp(true)
    if(validation) {
      //DELETEALL ITEMS FROM DATABASE
      // try {
    //   const response = await fetch("http://localhost:3001/adminLogin", {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       email: email,
    //       password: password
    //     })
    //   });
    }
  }
  

  return (
    <div className='d-f-col'>
      <h1 className='adminTitle'> Plu Update Area</h1>
      <section className='updateSection'>
        <h1>Current Plu List</h1>
        <PluUpdateList/>
      </section>
      <section className='updateSection'>
        <h1>Clear Plu List</h1>
        <p>If you wish to clear the Plu list then click the button below.</p>
        <p className='caution'>Caution: This will erase all data in the database and remove all images.</p>
        <button  type="button" className='inputLogin updateSectionButton' onClick={()=> {clearDatabaseHandler()}} >Erase Database</button>
      </section>
      {popUp? 
        <PopUp setPopUp = {setPopUp} setValidation = {setValidation}/> : null
      }
    </div>
  )
}

export default UpdatePlus