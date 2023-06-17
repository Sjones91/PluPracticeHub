import { useEffect, useState,useContext } from "react";
import React from 'react'
import PluItems from "../PluItems";
import { TiArrowLeftThick } from "react-icons/ti";
import { UserContext } from "../../../../App";

function BakeRevision(props, setActivityState) {
  const [bakeryPlus,setBakeryPlus] = useState([]);
  const [loadedImages, setLoadedImages] = useState(0); // Track the number of loaded images
  const ip =useContext(UserContext);
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
        setBakeryPlus(serverResponse);
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
    <div className='d-f-col'>
      <TiArrowLeftThick onClick={()=> props.setActivityState(0)} className="backIcon"/>
      <div className={bakeryPlus ? 'd-f-row pluList' : "d-f-r"}>
      {bakeryPlus.length > 0 ? 
        bakeryPlus.map((item,index)=> {
          const Name = item.Name;
          const Plu = item.Plu
          const imageUrl = item.image;
          //Server\uploads
          
          return(
              <PluItems
              key= {index} 
              Name={Name} 
              Plu={Plu} 
              img ={imageUrl}
              onLoad={handleImageLoad} // Call the onLoad event handler
              style={{ visibility: loadedImages > index ? 'visible' : 'hidden' }} // Hide the images until loaded
              />
              
          ) 
            
        })
      : <h1 className="loading">Loading... </h1>
      }
      </div>
    </div>
  )
}

export default BakeRevision