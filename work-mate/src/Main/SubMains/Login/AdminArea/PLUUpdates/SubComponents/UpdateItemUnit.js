import React, {useState,useEffect,useContext} from 'react'
import { AiFillCheckCircle } from "react-icons/ai";
import { UserContext } from '../../../../../../App';
function UpdateItemUnit(props, Name,Plu, id, setUpdateList,updateList,pluList, image) {
    const [UpdateField, setUpdateField] = useState(0)
    const [updatedPlu,setUpdatedPlu] = useState("");
    const [updateName,setUpdateName] = useState("");
    const [pluId, setPluId] = useState("");
    const [messageResponse, setMessageResponse] = useState("");
    const ip =useContext(UserContext);
    useEffect(()=> {
        //set the states of the current name and plu onload
        setUpdateName(props.Name)
        setUpdatedPlu(props.Plu)
        setPluId(props.id)
    },[props.pluList])

    const updatePluHandler = async ()=> {
        if(updateName !== "" && !isNaN(updatedPlu) && updatedPlu !== ""){
            try {
                const response = await fetch(`https://${ip[4]}:3001/updatePluItem`, {
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
            const {message} = await response.json();
            console.log(props.updateList)
            setMessageResponse(message)
            console.log(message)
            props.setUpdateList(!props.updateList)
            setUpdateField(false);  
        } catch(error) {
            console.log(error)
        }
    } else {
        alert("Please ensure fields are not blank.")
    }
}
const deletePluHandler = async ()=> {
    try {
        const response = await fetch(`http://${ip[4]}:3001/deletePlu`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
        id: pluId,
        name: updateName,
        plu: updatedPlu,
        image: props.image
        })
    })
    
} catch(error) {
    console.log(error)
}
    props.setUpdateList(!props.updateList)
}
  return (
    <div className='updateItem'>
        <div className='d-f-row'>
            {UpdateField? 
                <div className='d-f-row updateTextBoxes'>
                    <input className="updateTextBox" type='text'value={updatedPlu} onChange={(e)=> {setUpdatedPlu(e.target.value)}}></input>
                    <input className="updateTextBox" type='text'value={updateName} onChange={(e)=> {setUpdateName(e.target.value)}}></input>
                    <AiFillCheckCircle className='tickSymbol' onClick={()=> updatePluHandler()}/>
                </div>
                :
                <div className='d-f-col'>
                    <section className='d-f-row updateTextData'>
                        <h1>{updatedPlu}</h1>
                        <h1>{updateName}</h1>
                    </section>
                    {messageResponse !== ""? <h3 className='responsePlu'>{messageResponse}</h3>: null}
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