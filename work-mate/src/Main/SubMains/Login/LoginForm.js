import React, { useEffect } from 'react'
import "../subStyles.css"
import { useState,useContext } from 'react'
import { UserContext } from '../../../App';


function LoginForm(props, setUser) {
  //use states to handle store number input.
  //Local usestate for store number 
  const[regionStore,SetRegionStore] = useState({region: "", store: ""})
  const [storeNumber, setStoreNumber] = useState("");
  const [region,setRegion] = useState("")
  //Says ip but its all items in the provider. 4+5 are protocol and ip, 6 = setStoreNum
  const ip =useContext(UserContext);
  const [loading, setLoading] = useState(false);
  //global store number alertation. (retrieved from app.js)
  const setStoreNum = ip[6];
//submit button handler which prevents default refresh and posts the data to the serverside app.
  const submitHandler = async (event)=> {
    event.preventDefault();
    if (regionStore.store.length>0 && regionStore.store.length< 4 && regionStore.store*0 == 0 && regionStore.region !== "") {
      setLoading(true)
      try {
        const response = await fetch(`${ip[5]}${ip[4]}:3333/login`,{
            method: "POST",
            headers: {
              "Content-Type": "application/json"
            },
            body:JSON.stringify({
              region: regionStore.region,
              storeNo: regionStore.store
            })
          })
          const data = await response.json();
          if(response.status == 200) {
            setStoreNum(storeNumber) //sets the global store number to the local one inputted. (I.e User logged in as store X.)
            props.setUser(true)
            //send store number to logged in
          } else {
            setLoading(false)
            console.log(data.message)
          }
      } catch(error) {
          setLoading(false);
          alert("Error connnecting to the server. Try again later")
          console.log(error)
        }
    } else {
      alert("Please enter 3 digit store number.")
    }
  }
  const fetchRegions = async ()=> {
    const response = await fetch(`${ip[5]}${ip[4]}:3333/grabRegions`,{
      method: "POST",
      headers: {
        "Content-Type":"application/json"
      },
      body:JSON.stringify({
      })
      })
      const data = await response.json()
      setRegion(data)
  }
  useEffect(()=> {
    fetchRegions()
  },[])

  return (
    <div className='loginContent'>
      <div>
        <h1>Welcome</h1>
        <p>Please Enter your Store Number.</p>
      </div>
      <form className='inputField'>
        <section>
          <p>Region & Store Number</p>
          <div>
            <h2>Select Region</h2>
            {region.length > 0 ? 
              <select className= "regionSelector" value = {regionStore.region} onChange={(e)=> SetRegionStore({...regionStore, region:e.target.value})}>
              <option></option>
              {region.map((area)=> {
                return (
                  <option key={area.region}>{`${area.region} - ${area.Name}`}</option>
                )
              })}
              </select>
              : <p>Loading Regions...</p>}
          </div>
          <input type="text" placeholder="Store Number" value={regionStore.store} onChange={(e)=> SetRegionStore({...regionStore, store:e.target.value})}></input>
        </section>
        {loading ? <p>Please Wait...</p> : <button type='submit' className='inputLogin' onClick={submitHandler}>Enter</button>}
      </form>
      <p>Tip: Click on your browser settings and select "Add to homepage" or "Create shortcut" to access the site easier from your device.</p>
    </div>
  )
}

export default LoginForm;