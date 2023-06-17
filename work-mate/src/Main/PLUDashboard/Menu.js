import React from 'react'
import ActChoice from './ActChoice'
import "./pluhome.css";
import veg from"./veg.jpg";
import bakery from"./bakery.jpg";
import question from "./questionmark.jpg";
import ActChoiceBanner from "./ActChoiceBanner"
function Menu(props) {
    const activities = [
        {head: "Produce PLU's",
         description: "Revise Produce PLU's"
        },
        {head: "Produce Test",
         description: "Take the Produce PLU Quiz"
        },
        {head: "Bakery PLU's",
         description: "Revise Bakery PLU's"
        },
        {head: "Bakery Test",
         description: "Take the Bakery PLU Quiz"
        },
      ]
      return (
        <div className="pluDash">
            <ActChoiceBanner header= "Produce Flash Card Game" onClick={()=> {props.setActivityState(5)}}/>
            <ActChoice imagePath= {veg} head={activities[0].head} description={activities[0].description}imageDescription="Picture of vegetables" className="actChoice" onClick={()=>props.setActivityState(1)}/>
            <ActChoice imagePath= {question} head={activities[1].head} description={activities[1].description}imageDescription="Picture of question mark." className="actChoice" onClick={()=>props.setActivityState(2)}/>
            <ActChoiceBanner header= "Bakery Flash Card Game" onClick={()=> {props.setActivityState(6)}}/>
            <ActChoice imagePath= {bakery} head={activities[2].head} description={activities[2].description}imageDescription="Picture of vegetables." className="actChoice" onClick={()=> props.setActivityState(3)}/>
            <ActChoice imagePath= {question} head={activities[3].head} description={activities[3].description}imageDescription="Picture of question mark." className="actChoice" onClick={()=> {props.setActivityState(4)}}/>
    
        </div>
      )
}

export default Menu