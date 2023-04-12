import React from 'react'
import "./pluhome.css"
import "./veg.jpg";
import "./bakery.jpg";
import "./questionmark.jpg";
function ActChoice(props, head,description,imageDescription,imagePath) {
  return (
    <div className='actChoice' onClick={()=> props.onClick()}>
      <img className='actImage' src={props.imagePath} alt={props.imageDescription}/>
      <h1>{props.head}</h1>
      <h2>{props.description}</h2> 
    </div>
  )
}

export default ActChoice