import React, {useEffect, useState, useContext} from 'react'
import PluItems from '../PluItems'
import "../../pluhome.css";
import { TiArrowLeftThick } from "react-icons/ti";
import { UserContext } from '../../../../App';
function ProdRevision(props, setActivityState) {
  const [producePlus,setProducePlus] = useState([]);
  const ip =useContext(UserContext);
  const grabPlus = async () => {
      try {
        const response = await fetch(`${ip[5]}${ip[4]}:3002/pluListRetrieve`, {
          method: 'POST',
          headers: {
          'Content-Type': 'application/json'
          },
          body: JSON.stringify({department : "Produce"}) // Convert data to JSON string
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
    <div className='d-f-col pluListSection'>
      <TiArrowLeftThick onClick={()=> props.setActivityState(0)} className="backIcon"/>
      <div className='pluList'>
      {producePlus.length > 0 ? 
        producePlus.map((item,index)=> {
          const Name = item.Name;
          const Plu = item.Plu
          const imageUrl = item.image;
          
          return(
              <PluItems Name = {Name} Plu = {Plu} img ={imageUrl}/>
              
          ) 
            
        })
      : <h1 className='loading'>Loading...</h1>
      }
      </div>
    </div>
  )
}

export default ProdRevision