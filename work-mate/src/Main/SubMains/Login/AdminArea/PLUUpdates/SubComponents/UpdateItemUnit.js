import React, {useState,useEffect} from 'react'
import { AiFillCheckCircle } from "react-icons/ai";
function UpdateItemUnit(props, Name,Plu, id) {
    const [UpdateField, setUpdateField] = useState(0)
    const [updatedPlu,setUpdatedPlu] = useState("");
    const [updateName,setUpdateName] = useState("");
    const [pluId, setPluId] = useState("");
    const [response, setResponse] = useState(false)
    useEffect(()=> {
        //set the states of the current name and plu onload
        setUpdateName(props.Name)
        setUpdatedPlu(props.Plu)
        setPluId(props.id)
    },[response])

    const updatePluHandler = async ()=> {
        setUpdateField(false)
        setResponse(!response);
        try {
            const response = await fetch("http://localhost:3001/updatePluItem", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
            id: pluId,
            name: updateName,
            plu: updatedPlu
            })
        })
        const data = await response.json();
        console.log(data)


    } catch(error) {
        console.log(error)
    }
    }
const deletePluHandler = async ()=> {
    setResponse(!response);
    try {
        const response = await fetch("http://localhost:3001/deletePlu", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        id: pluId,
        name: updateName,
        plu: updatedPlu
        })
    })
    const data = await response.json();
    console.log(data)
} catch(error) {
    console.log(error)
}
}
  return (
    <div className='d-f-row updateItem'>
        <div className='d-f-row'>
            {UpdateField? 
                <div className='d-f-row updateTextBoxes'>
                    <input className="updateTextBox" type='text'value={updatedPlu} onChange={(e)=> {setUpdatedPlu(e.target.value)}}></input>
                    <input className="updateTextBox" type='text'value={updateName} onChange={(e)=> {setUpdateName(e.target.value)}}></input>
                    <AiFillCheckCircle className='tickSymbol' onClick={()=> updatePluHandler()}/>
                </div>
                :
                <div className='d-f-col'>
                    <section className='d-f-row'>
                        <h1>{updatedPlu}</h1>
                        <h1>{updateName}</h1>
                    </section>
                    {response? <h3 className='responsePlu'>Item successfully updated.</h3>: null}
                </div>
            }
        </div>
        <section className='d-f-row updateButtons'>
            <button type='button' onClick={()=>{setUpdateField(true)}}>Update Data</button>
            <button type='button' onClick={()=>{deletePluHandler()}}>Erase PLU</button>
        </section>
    

    </div>
  )
}

export default UpdateItemUnit;