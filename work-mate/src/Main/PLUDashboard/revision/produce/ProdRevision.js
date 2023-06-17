import React, {useEffect, useState, useContext} from 'react'
import PluItems from '../PluItems'
import "../../pluhome.css";
import { TiArrowLeftThick } from "react-icons/ti";
import { UserContext } from '../../../../App';


function ProdRevision(props, setActivityState) {
  //variables used to store total plu count and pluy data.
  const [producePlus,setProducePlus] = useState([]);
  //image rendering in order
  const [loadedImages, setLoadedImages] = useState(0); // Track the number of loaded images
  //global data used throught app from app.js .Its an array so access via [number].
  const ip =useContext(UserContext);
  
  
  const grabPlus = async () => {
      try {
        const response = await fetch(`${ip[5]}${ip[4]}:3333/pluListRetrieve`, {
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
  const handleImageLoad = () => {
    setLoadedImages(prevCount => prevCount + 1);
  };
  
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
              <PluItems 
                key = {index}
                Name = {Name} 
                Plu = {Plu} 
                img ={imageUrl}
                onLoad={handleImageLoad} // Call the onLoad event handler
                style={{ visibility: loadedImages > index ? 'visible' : 'hidden' }} // Hide the images until loaded
              />
              
          ) 
            
        })
      : <h1 className='loading'>Loading...</h1>
      }
      </div>
    </div>
  )
}

export default ProdRevision