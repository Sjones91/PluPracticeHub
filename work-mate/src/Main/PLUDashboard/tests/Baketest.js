import React, {useState, useEffect} from 'react'
import "../pluhome.css";
import { TiArrowLeftThick } from "react-icons/ti";
import PluTestItems from "../tests/PluTestItems.js";

export default function Baketest(props, setActivityState) {
  const [producePlus,setProducePlus] = useState([]);
  const grabPlus = async () => {
    try {
      const response = await fetch("http://localhost:3001/pluListRetrieve", {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({department : "Bakery"}) // Convert data to JSON string
      })
      const serverResponse = await response.json();
      setProducePlus(serverResponse);
      console.log(serverResponse)
    }catch(error) {
      console.log(error)
    }
};
useEffect(()=>{
  grabPlus()
},[]);
  return (
    <div>
      <section className='d-f-col'>
        <TiArrowLeftThick onClick={()=> props.setActivityState(0)} className="backIcon"/>
        <h1 className="testHeader">Bakery PLU Test</h1>
      </section>
      <section className='pluList'>
      {producePlus.length > 0 ? 
        producePlus.map((item,index)=> {
          const Name = item.Name;
          const Plu = item.Plu
          const imageUrl = item.image;
          
          return(
              <PluTestItems Name = {Name} Plu = {Plu} img ={imageUrl}/>
              
          ) 
            
        })
      : <h1 className='loading'>Loading...</h1>
      }
      </section>
    </div>
  )
}
