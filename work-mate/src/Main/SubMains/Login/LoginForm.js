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
    
    if (storeNumber.length>0) {
      
      try {
        const response = await fetch(`https://${ip[4]}:3001/login`,{
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
    }
  }

  return (
    <div className='loginContent'>
      <div>
        <h1>Welcome</h1>
        <p>Please Enter your Store Number and name.</p>
      </div>
      <form className='inputField'>
        <section>
          <p>Store Number</p>
          <input type="text" placeholder="Store Number" onChange={updateStoreNumber}></input>
        </section>
        <button type='submit' className='inputLogin' onClick={submitHandler}>Enter</button>
      </form>
    </div>
  )
}

export default LoginForm;