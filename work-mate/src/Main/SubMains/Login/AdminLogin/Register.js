import React from 'react'

function Register(props,setAdminLoggedIn) {
  return (
    <div className='loginContent'>
      
    <div>
      <h1>Sign Up</h1>
      <p>Please complete the form below to sign up.</p>
    </div>
    
    <div className='inputField'>
      <section>
        <p>Username</p>
        <input type="text" ></input>
      </section>
      <section>
        <p>Password</p>
        <input type="text" ></input>
      </section>
      <section>
        <p>Authorisation Key</p>
        <input type="text" ></input>
      </section>
      <button type='submit' className='inputLogin'>Sign Up</button>
      <button type="button" className='inputRegister' onClick={()=>props.setAdminLoggedIn(1)}>Already a user? Login here. </button>
    </div>
  </div>
  )
}

export default Register