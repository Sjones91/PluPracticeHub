import React from 'react'
import "../subStyles.css"
import { useState,useContext } from 'react'
import { UserContext } from '../../../App';


function LoginForm(props, setUser) {
  //use states to handle email and password input. 
  const [storeNumber, setStoreNumber] = useState("");
  const [name, setName] = useState("");
  const ip =useContext(UserContext);
  
  //functions attached to both respective input fields to update states.
  const updateStoreNumber = (e) => {
    setStoreNumber(e.target.value);
  };
  const updateName = (event) => {
    setName(event.target.value);
  };
//submit button handler which prevents default refresh and posts the data to the serverside app.
  const submitHandler = async (event)=> {
    event.preventDefault();
    console.log(ip[5])
    if (storeNumber.length>0 && storeNumber.length< 4 && storeNumber*0 == 0) {
      
      try {
        const response = await fetch(`${ip[5]}${ip[4]}:3333/login`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body:JSON.stringify({
              storeNo: storeNumber,
            })
          })
          props.setUser(true)
          const data = await response.json();
          console.log(data.message)
      } catch(error) {
          console.log(error)
        }
    } else {
      alert("Please enter 3 digit store number.")
    }
  }

  return (
    <div className='loginContent'>
      <div>
        <h1>Welcome</h1>
        <p>Please Enter your Store Number.</p>
      </div>
      <form className='inputField'>
        <section>
          <p>Store Number</p>
          <input type="text" placeholder="Store Number" onChange={updateStoreNumber}></input>
        </section>
        <button type='submit' className='inputLogin' onClick={submitHandler}>Enter</button>
      </form>
      <p>Tip: Click on your browser settings and select "Add to homepage" or "Create shortcut" to access the site easier from your device.</p>
    </div>
  )
}

export default LoginForm;