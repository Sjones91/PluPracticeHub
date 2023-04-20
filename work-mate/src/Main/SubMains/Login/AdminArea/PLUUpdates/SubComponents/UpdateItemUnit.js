import React, {useState,useEffect} from 'react'
import { AiFillCheckCircle } from "react-icons/ai";
function UpdateItemUnit(props, Name,Plu) {
    const [UpdateField, setUpdateField] = useState(0)
    const [updatePlu,setUpdatePlu] = useState("");
    const [updateName,setUpdateName] = useState("");
    useEffect(()=> {
        setUpdateName(props.Name)
        setUpdatePlu(props.Plu)
    },[])
  return (
    <div className='d-f-row updateItem'>
        <div className='d-f-row'>
            {UpdateField? 
                <div className='d-f-row updateTextBoxes'>
                    <input className="updateTextBox" type='text'value={updatePlu} onChange={(e)=> {setUpdatePlu(e.target.value)}}></input>
                    <input className="updateTextBox" type='text'value={updateName} onChange={(e)=> {setUpdateName(e.target.value)}}></input>
                    <AiFillCheckCircle className='tickSymbol' onClick={()=> setUpdateField (false)}/>
                </div>
                :
                <div className='d-f-row'>
                    <h1>{props.Plu}</h1>
                    <h1>{props.Name}</h1>
                </div>
            }
        </div>
        <section className='d-f-row updateButtons'>
            <button type='button' onClick={()=>{setUpdateField(true)}}>Update Data</button>
            <button type='button'>Erase PLU</button>
        </section>
    

    </div>
  )
}

export default UpdateItemUnit