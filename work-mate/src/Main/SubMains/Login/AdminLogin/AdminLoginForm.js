import React from 'react'
import "../../subStyles.css"
import { useState, useEffect,useContext } from 'react'
import { UserContext } from '../../../../App';

function AdminLoginForm(props, setFormChoice,setAdminLoginState, setAdmin) {
  //use states to handle email and password input. 
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validEmail, SetValidEmail] = useState(false);
  useEffect(() => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    SetValidEmail(emailRegex.test(email))
  }, [email])
  //functions attached to both respective input fields to update states.
  const updateEmail = (e) => {
    setEmail(e.target.value);
  };
  const updatePassword = (event) => {
    setPassword(event.target.value);
  };

//submit button handler which prevents default refresh and posts the data to the serverside app.
  const submitHandler = async (event)=> {
    event.preventDefault();
    if (validEmail) {
      if(password.length > 8) {
        //try statement to set up method and post the data to the backend app.
          try {
          const response = await fetch("http://localhost:3001/adminLogin", {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              email: email,
              password: password
            })
          });
          //awaiting response from the server.
          const data = await response.json();
          console.log(data)
          if(data) {
            props.setAdmin(true);
          } else {
            alert("Email or Password do not match.")
          }
          } catch (error) {
          console.log(error);
          alert("Error connecting to the server. Please try again later")
          }


    }
      else if(password === "") {
      alert("Please enter a password.")
    } else if(password.length <8) {
      alert("Please create a password which is greater than 8 characters.")
    }
  } else {
    alert("Please enter a valid email address.")
  }
 
  }

  return (
    <div className='loginContent'>
      <div>
        <h1>Admin Login</h1>
        <p>Please enter your email address and password.</p>
      </div>
      <form className='inputField'>
        <section>
          <p>Email</p>
          <input type="email" placeholder="Email" onChange={updateEmail}></input>
        </section>
        <section>
          <p>Password</p>
          <input type="password" placeholder="password" onChange={updatePassword}></input>
        </section>
        <button type='submit' className='inputLogin' onClick={submitHandler}>Login</button>
      </form>
      <button type="button" className='inputRegister' onClick={()=>props.setAdminLoginState(false)}>Register Here</button>
    </div>
  )
}

export default AdminLoginForm;