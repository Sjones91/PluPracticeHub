import React from 'react'
import "../pluhome.css"

function PluItems(props, Name, Plu, img) {
  const imageBlob = new Blob([props.img], {type: "image/jpeg"})
  const imgUrl = URL.createObjectURL(imageBlob)
  return (
    <div  className='pluItem'>
      <img src={props.img} alt = {props.Name}/>
      <h1>{props.Plu}</h1>
      <h2>{props.Name}</h2> 
    </div>
  )
}

export default PluItems;