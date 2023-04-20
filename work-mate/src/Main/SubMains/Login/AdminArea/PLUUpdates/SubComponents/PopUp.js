import React from 'react'
import "../../admin.css"
function PopUp(props,setPopUp,setValidation) {
  return (
    <div className='d-f-col popUp'>
        <h1>WARNING!</h1>
        <h2>Are you sure you wish to erase all contents from the database?</h2>
        <div className='d-f-row popUpButtons'>
            <button type='button' className='inputLogin'onClick={()=> props.setPopUp(false)}>Cancel</button>
            <button type="button" className='inputLogin erase'onClick={()=> {props.setPopUp(false); props.setValidation(true)}}>ERASE</button>
        </div>

    </div>
  )
}

export default PopUp