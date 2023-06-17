import React from 'react'
import "../pluhome.css"

function GameItem(props, setFlashItem, flashItem) {
  const imageBlob = new Blob([props.img], {type: "image/jpeg"})
  const imgUrl = URL.createObjectURL(imageBlob)
  return (
    <div  className='pluItemGame'>
      <img src={props.flashItem.image} alt = {props.flashItem.Name}/>
      <h2>{props.flashItem.Name}</h2> 
    </div>
  )
}

export default GameItem;