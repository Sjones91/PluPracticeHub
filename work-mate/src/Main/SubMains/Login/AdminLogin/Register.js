import React, {useState} from 'react'

function Register(props,setAdminLoginState) {
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("")
  const [AuthKey,setAuthKey] = useState("");
  const [serverResponse,setServerResponse] = useState("")
    const submitHandler = async (e)=> {
      
      
      if (username!== "" && password !== "" && AuthKey !== "") {
        
        try {
          const response = await fetch("http://localhost:3001/register",{
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
            console.log(data.message, data.status)
            
        } catch(error) {
            console.log(error)
          }
      }
    }
  return (
    <div className='loginContent'>
      
    <div>
      <h1>Sign Up</h1>
      <p>Please complete the form below to sign up.</p>
    </div>
    
    <div className='inputField'>
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