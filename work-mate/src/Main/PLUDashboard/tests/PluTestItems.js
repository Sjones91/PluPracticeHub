import React, {useState, useContext} from 'react'
import "../pluhome.css"
import { UserContext} from '../../../App';

function PluItems(props, Name, Plu, img, department, answered ,score , setAnswered ,setScore ) {
  const [correct,setCorrect] = useState("");
  const [answer,setAnswer] = useState("");
  //array of passed values from app.js 4+5 = protocol & ip. 6 = storeNum
  const ip =useContext(UserContext);
  const imageBlob = new Blob([props.img], {type: "image/jpeg"})
  const imgUrl = URL.createObjectURL(imageBlob)
  const [removeButton,setRemoveButton] = useState(false)
  const submitHandler = async ()=>{
    if(answer !="") {
      props.setAnsweredCounter(props.answered + 1)
      setRemoveButton(true)
      if(answer === props.Plu) {
        setCorrect(true);
        props.setScoreCounter(props.score +1)
      } else {
        setCorrect(false);
      }
    }
  }
  const handleImageLoad = () => {
    props.onLoad(); // Call the onLoad event handler passed as a prop
  };
  return (
    <div  className = {correct ==="" ? 'pluItem' : correct ? "pluItemPass" : "pluItemFail"} >
      <img src={props.img} alt = {props.Name} onLoad={handleImageLoad}/>
      {correct ===""? 
        <input type="text" className='text-input' inputMode="numeric" value = {answer} onChange={(e)=>{setAnswer(e.target.value)}}/>:
        <h1>Plu = {props.Plu}</h1>
      }  
      <h2 className='testItemName'>{props.Name}</h2>
      {removeButton ? null: <div className='testButton' onClick={()=>submitHandler()}>Submit</div>}
       
    </div>
  )
}

export default PluItems;