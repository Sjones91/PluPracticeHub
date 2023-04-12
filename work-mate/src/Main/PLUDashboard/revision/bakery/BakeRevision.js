import { useEffect, useState } from "react";
import React from 'react'
import PluItems from "../PluItems";
import { TiArrowLeftThick } from "react-icons/ti";
function BakeRevision(props, setActivityState) {
  const [bakeryPlus,setBakeryPlus] = useState([]);
  const grabPlus = async () => {
      try {
        const response = await fetch("http://localhost:3002/pluListRetrieve", {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({department : "Bakery"}) // Convert data to JSON string
        })
        const serverResponse = await response.json();
        setBakeryPlus(serverResponse);
        console.log(serverResponse)
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
      <div className='d-f-row pluList'>
      {bakeryPlus.length > 0 ? 
        bakeryPlus.map((item,index)=> {
          const Name = item.Name;
          const Plu = item.Plu
          const imageUrl = `/uploads/${item.image}`;
          //Server\uploads
          console.log(imageUrl)
          
          return(
              <PluItems Name = {Name} Plu = {Plu} img ={imageUrl}/>
              
          ) 
            
        })
      : <h1>Loading... </h1>
      }
      </div>
    </div>
  )
}

export default BakeRevision