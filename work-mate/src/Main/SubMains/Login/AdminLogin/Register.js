import React, {useState,useContext} from 'react'
import { UserContext } from '../../../../App';
function Register(props,setAdminLoginState) {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("")
  const [AuthKey,setAuthKey] = useState("");
  const [serverResponse,setServerResponse] = useState("")
  const ip =useContext(UserContext);
    const submitHandler = async (e)=> {
      setServerResponse("");
      
      if (username!== "" && password !== "" && AuthKey !== "") {
        
        try {
          const response = await fetch(`${ip[5]}${ip[4]}/register`,{
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body:JSON.stringify({
                Authkey: AuthKey,
                username: username,
                password: password

              })
            })
            const data = await response.json();
            setServerResponse(data.message)
            
        } catch(error) {
            console.log(error)
          }
      } else {
        alert("Please enter a Username, Password and Authorisation Key")
      }
    }
  return (
    <div className='loginContent'>
      
    <div>
      <h1>Sign Up</h1>
      <p>Please complete the form below to sign up.</p>
    </div>
    
    <div className='inputField'>
      {serverResponse ===""? null : <p className='serverResponse'>{serverResponse}</p>}
      <section>
        <p>Username</p>
        <input type="text" value = {username} onChange={(e)=> {setUsername(e.target.value)}}></input>
      </section>
      <section>
        <p>Password</p>
        <input type="text" value = {password} onChange={(e)=> {setPassword(e.target.value)}}></input>
      </section>
      <section>
        <p>Authorisation Key</p>
        <input type="text" value = {AuthKey} onChange={(e)=> {setAuthKey(e.target.value)}}></input>
      </section>
      <button type='submit' className='inputLogin' onClick={()=> submitHandler()}>Sign Up</button>
      <button type="button" className='inputRegister' onClick={()=>props.setAdminLoginState(true)}>Already a user? Login here. </button>
    </div>
  </div>
  )
}

export default Register