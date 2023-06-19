import React from 'react'
import "./PLUDashboard/pluhome.css"
import "./Main.css"
import { TiArrowLeftThick } from "react-icons/ti";
function Contact(props, setMainContent) {
  return (
    <div className='contactPage'>
      <TiArrowLeftThick className="backIcon" onClick={()=> props.setMainContent(0)}/>
      <section className='contentBlock'>
        <h1 className='cheader'>Contact us</h1>
        <p className='paragraph'>Thanks for using Plu Practice Hub! We hope you learnt something. Feel free to get in touch via email and let us know of any other features you would like on the app.</p>
        <p className='paragraph'>For any app enquiries or to report a bug you have found, please contact us on the email address below.</p>
        <p className='paragraph' >Email: </p>
        <a className='emailLink' href="mailto:admin@plupracticehub.co.uk">admin@plupracticehub.co.uk</a>
      </section>
    </div>
  )
}

export default Contact