import React, {useState,useEffect,useContext} from 'react'
import PopUp from './SubComponents/PopUp';
import PluUpdateList from './SubComponents/PluUpdateList';
import { UserContext } from '../../../../../App';
function UpdatePlus() {
  const [popUp, setPopUp] = useState(false)
  const [validation, setValidation] = useState(false)
  const [updateList,setUpdateList] = useState(false); //passed to updateItemUnit to be flipped when a change has been made, used to trigger rerender in use
  const ip =useContext(UserContext);
  const clearDatabaseHandler = async () => {
    alert("Feature ")
    //REMOVED FOR THE TIME BEING!!
    // if(validation) {
    //   // DELETEALL ITEMS FROM DATABASE
    //   try {
    //   const response = await fetch(`${ip[5]}${ip[4]}:3001/deleteAll`, {
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //       item: "blankPayload"
    //     })
    //   })
    //   const data = response.json();
    //   console.log(data.message);
    //   setUpdateList(!updateList)
    // } catch(error) {
    //   console.log(error);
    // }
    // }
  }
  useEffect(()=>{

  },[updateList])

  return (
    <div className='d-f-col'>
      <h1 className='adminTitle'> Plu Update Area</h1>
      <section className='updateSection'>
        <h1>Current Plu List</h1>
        <PluUpdateList setUpdateList = {setUpdateList} updateList={updateList}/>
      </section>
    </div>
  )
}

export default UpdatePlus;