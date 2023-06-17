import React from 'react'
import "../../pluhome.css"
import { TiArrowLeftThick } from "react-icons/ti";
import { UserContext } from "../../../../App";
import { useState,useContext,useEffect } from 'react';
import GameComponent from '../GameComponent';
import GameItem from '../GameItem';
function BakeryFlash(props,setActivityState) {
    const [producePlus,setProducePlus] = useState([]);
    const ip =useContext(UserContext);
    const [loading,setLoading] = useState(true)
    const [trigger, setTrigger] = useState(false);
    
    //Grab PluList
    const grabPlus = async () => {
        try {
          const response = await fetch(`${ip[5]}${ip[4]}:3333/pluListRetrieve`, {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({department : "Bakery"}) // Convert data to JSON string
          })
          const serverResponse = await response.json();
          setProducePlus(serverResponse);
          setLoading(false)
          
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
        <section>
            {loading ? <h1 className='loading'>Loading, Please Wait...</h1> 
            : <GameComponent producePlus = {producePlus}/>}
        </section>
    </div>
  )
}

export default BakeryFlash