import React, {useState} from 'react'
import "../pluhome.css"

function PluItems(props, Name, Plu, img) {
  const [correct,setCorrect] = useState("");
  const [answer,setAnswer] = useState("");
  const imageBlob = new Blob([props.img], {type: "image/jpeg"})
  const imgUrl = URL.createObjectURL(imageBlob)

  const submitHandler = ()=>{
    console.log(props.Plu,answer)
    if(answer === props.Plu) {
      setCorrect(true)
    } else {
      setCorrect(false);
    }
  }
  return (
    <div  className = {correct ==="" ? 'pluItem' : correct ? "pluItemPass" : "pluItemFail"} >
      <img src={props.img} alt = {props.Name}/>
      {correct ===""? 
        <input type="text" className='text-input' value = {answer} onChange={(e)=>{setAnswer(e.target.value)}}/>:
        <h1>Plu = {props.Plu}</h1>
      }  
      <h2 className='testItemName'>{props.Name}</h2>
      <button className='testButton' onClick={()=>submitHandler()}>Submit</button> 
    </div>
  )
}

export default PluItems;