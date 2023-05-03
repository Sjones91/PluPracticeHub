import React, {useState, useEffect, useContext} from 'react'
import "../pluhome.css";
import { TiArrowLeftThick } from "react-icons/ti";
import PluTestItems from "../tests/PluTestItems.js";
import { UserContext } from '../../../App';
export default function Baketest(props, setActivityState) {
  const [producePlus,setProducePlus] = useState([]);
  const ip =useContext(UserContext);
  const grabPlus = async () => {
    try {
      const response = await fetch(`${ip[5]}${ip[4]}:3001/pluListRetrieve`, {
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
