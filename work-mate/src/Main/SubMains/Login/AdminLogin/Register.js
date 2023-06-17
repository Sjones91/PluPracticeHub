import React, {useState,useContext} from 'react'
import { UserContext } from '../../../../App';
function Register(props,setAdminLoginState) {
  const [storeNumber,setStoreNumber] = useState("")
  const [username,setUsername] = useState("");
  const [password,setPassword] = useState("");
  const [adminLevel,setAdminLevel] = useState(1)
  const [AuthKey,setAuthKey] = useState("");
  const [serverResponse,setServerResponse] = useState("")
  const [loading, setLoading] = useState(false)
  const ip =useContext(UserContext);
    const submitHandler = async (e)=> {
      setServerResponse("");
      
      if (username!== "" && password !== "" && AuthKey !== "" && storeNumber !="") {
        if(storeNumber.length <=3) {
        setLoading(true)
        try {
          const response = await fetch(`${ip[5]}${ip[4]}:3001/register`,{
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body:JSON.stringify({
                Authkey: AuthKey,
                username: username,
                password: password,
                adminLevel: adminLevel,
                store_number: storeNumber
              })
            }) 
            const data = await response.json();
            setLoading(false)
            setServerResponse(data.message)
            
        } catch(error) {
            console.log(error)
          }
        } else {
          alert("Please enter a store number less than 3 digits")
        }
      } else {
        alert("Please enter a Store Number, Username, Password and Authorisation Key")
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
        <p>Store Number</p>
        <input type="text" value = {storeNumber} onChange={(e)=> {setStoreNumber(e.target.value)}}></input>
      </section>
      <section>
        <p>Username</p>
        <input type="text" value = {username} onChange={(e)=> {setUsername(e.target.value)}}></input>
      </section>
      <section>
        <p>Password</p>
        <input type="text" value = {password} onChange={(e)=> {setPassword(e.target.value)}}></input>
      </section>
      <section>
        <p>Admin Level</p>
        <select onChange={(e) => setAdminLevel(e.target.value)}>
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
        </select>
      </section>
      <section>
        <p>Authorisation Key</p>
        <input type="text" value = {AuthKey} onChange={(e)=> {setAuthKey(e.target.value)}}></input>
      </section>
      {loading ? <p>Please wait...</p>: <button type='submit' className='inputLogin' onClick={()=> submitHandler()}>Sign Up</button>}
      
      <button type="button" className='inputRegister' onClick={()=>props.setAdminLoginState(true)}>Already a user? Login here. </button>
    </div>
  </div>
  )
}

export default Register