import React from 'react'
import "../../subStyles.css"
import { useState, useEffect,useContext } from 'react'
import { UserContext } from '../../../../App';

function AdminLoginForm(props, setFormChoice,setAdminLoginState, setAdmin, setUser,setLevel) {
  //use states to handle Username and password input. 
  const [Username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [validUsername, SetValidUsername] = useState(false);
  const [loading, setLoading] = useState(false)
  const ip =useContext(UserContext);
  useEffect(() => {
    if(Username !== "") {
      SetValidUsername(true);
    }
  }, [Username])
  //functions attached to both respective input fields to update states.
  const updateUsername = (e) => {
    setUsername(e.target.value);
  };
  const updatePassword = (event) => {
    setPassword(event.target.value);
  };

//submit button handler which prevents default refresh and posts the data to the serverside app.
  const submitHandler = async (event)=> {
    event.preventDefault();
    if (validUsername) {
      if(password.length > 8) {
        setLoading(true)
        //try statement to set up method and post the data to the backend app.
          try {
          const response = await fetch(`${ip[5]}${ip[4]}:3001/adminLogin`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify({
              username: Username,
              password: password
            })
          });
          //awaiting response from the server.
          const data = await response.json();
          if(response.status === 200) {
            props.setAdmin(true)
            props.setUser(data.user[0].Username)
            props.setLevel(data.user[0].adminlevel)
            setLoading(false)
          } else {
            alert("Username or Password do not match.")
            setLoading(false)
          }
          } catch (error) {
          console.log(error);
          setLoading(false)
          alert("Error connecting to the server. Please try again later")
          }


    }
      else if(password === "") {
      alert("Please enter a password.")
    } else if(password.length <8) {
      alert("Please create a password which is greater than 8 characters.")
    }
  } else {
    alert("Please enter a valid Username address.")
  }
 
  }

  return (
    <div className='loginContent'>
      <div>
        <h1>Admin Login</h1>
        <p>Please enter your Username address and password.</p>
      </div>
      <form className='inputField'>
        <section>
          <p>Username</p>
          <input type="Username" placeholder="Username" onChange={updateUsername}></input>
        </section>
        <section>
          <p>Password</p>
          <input type="password" placeholder="password" onChange={updatePassword}></input>
        </section>
        {loading? 
        <p>Please Wait...</p> : 
        <button type='submit' className='inputLogin' onClick={submitHandler}>Login</button>}
      </form>
      <button type="button" className='inputRegister' onClick={()=>props.setAdminLoginState(false)}>Register Here</button>
    </div>
  )
}

export default AdminLoginForm;