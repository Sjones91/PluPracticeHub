import React, {useEffect, useState} from 'react'
import PluItems from '../PluItems'
import "../../pluhome.css";
import { TiArrowLeftThick } from "react-icons/ti";
function ProdRevision(props, setActivityState) {
  const [producePlus,setProducePlus] = useState([]);
  const grabPlus = async () => {
      try {
        const response = await fetch("http://localhost:3002/pluListRetrieve", {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({department : "Produce"}) // Convert data to JSON string
        })
        const serverResponse = await response.json();
        setProducePlus(serverResponse);
      }catch(error) {
        console.log(error)
      }
  };
  useEffect(()=>{
    grabPlus()
  },[]);
  
  return (
    <div className='d-f-col'>
      <TiArrowLeftThick onClick={()=> props.setActivityState(0)} className="backIcon"/>
      <div className='pluList'>
      {producePlus.length > 0 ? 
        producePlus.map((item,index)=> {
          const Name = item.Name;
          const Plu = item.Plu
          const imageUint8Array = new Uint8Array(item.image.data);
          const imageBlob = new Blob([imageUint8Array], {type: "image/jpeg"})
          const imgUrl = URL.createObjectURL(imageBlob)
          
          return(
              <PluItems Name = {Name} Plu = {Plu} img ={imgUrl}/>
              
          ) 
            
        })
      : <h1>Loading...</h1>
      }
      </div>
    </div>
  )
}

export default ProdRevision