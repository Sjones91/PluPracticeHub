import React from 'react'
import "./pluhome.css"
function ActChoice(props, header,set) {
  return (
    <div className='actChoiceBanner' onClick={()=> props.onClick()}>
      <h1>NEW!</h1>
      <h1>{props.header}</h1>
    </div>
  )
}

export default ActChoice