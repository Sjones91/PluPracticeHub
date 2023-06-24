import React, {useState, useEffect, useContext} from 'react'
import "../pluhome.css";
import { TiArrowLeftThick } from "react-icons/ti";
import PluTestItems from "../tests/PluTestItems.js";
import { UserContext } from '../../../App';


export default function Baketest(props, setActivityState) {
  //variables used to store data for testing. answerCount == total number of items and score = amount of correct answers
  const [answeredCount,setAnsweredCount] = useState(0)
  const [scoreCounter,setScoreCounter] = useState(0);
  const [region,setRegion] = useState([])
  const [regionChoice,setRegionChoice] =useState("")
  let percentageCorrect = scoreCounter/answeredCount * 100;
  const [testData,setTestData] = useState({
    region: "",
    storeNumber: "",
    department:"Bakery",
  }) 

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
      console.log(data)
      setRegion(data)
  }
  //functionallity variables.
  const [loading,setLoading] = useState(false)
  const [producePlus,setProducePlus] = useState([]);
  const [loadedImages, setLoadedImages] = useState(0); // Track the number of loaded images
  let privacy = false
  //global usestates grabbed as array. use [number] to access.
  const ip =useContext(UserContext);
  const grabPlus = async () => {
    try {
      const response = await fetch(`${ip[5]}${ip[4]}:3333/pluListRetrieve`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify({department : "Bakery"}) // Convert data to JSON string
      })
      const serverResponse = await response.json();
      
      setProducePlus(serverResponse);
    }catch(error) {
      console.log(error)
    }
  };

  const submitTest = async () => {
    if(answeredCount === producePlus.length) {
      if(regionChoice !== "" && 
      (testData.storeNumber !== "" && testData.storeNumber*0 === 0 && testData.storeNumber< 160)){
              setLoading(true);
              try {
                const response = await fetch(`${ip[5]}${ip[4]}:3333/postAnswer`,{
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json"
                    },
                    body:JSON.stringify({
                      region:regionChoice,
                      department: "Bakery",
                      store: testData.storeNumber,
                      answeredCount:answeredCount,
                      scoreCorrect: scoreCounter,
                      percentage:percentageCorrect
                    })
                  })
                  const data = await response.json();
                  setLoading(false)
                  props.setActivityState(0)
              } catch(error) {
                  console.log(error)
              } 
        } else {
          alert("Please Fully Complete The Test Form With Correct Data.")
        }
    } else {
      alert("Please answer all questions")
    }
  }
  useEffect(()=>{
    grabPlus()
    fetchRegions()
  },[]);
  const handleImageLoad = () => {
    setLoadedImages(prevCount => prevCount + 1);
  };
  return (
    <div>
      <section className='d-f-col'>
        <TiArrowLeftThick onClick={()=> props.setActivityState(0)} className="backIcon"/>
        <h1 className="testHeader">Bakery PLU Test</h1>
      </section>
      <section className='d-f-col testSubmitForm'>
        <p className='testInfo'>Please complete the form below and submit your test.</p>
        <div className='d-f-row inputBlock'>
        <section>
            <p>Region</p>
            {region.length > 0 ? 
              <select className= "regionSelector" value = {testData.region} onChange={(e) => {
                const firstThreeDigits = e.target.value.substring(0, 3);
                setRegionChoice(firstThreeDigits)
                setTestData({ ...testData.region, region: e.target.value });
              }}>
              <option></option>
              {region.map((area)=> {
                return (
                  <option key={area.region}>{`${area.region} - ${area.Name}`}</option>
                )
              })}
              </select>
              : <p>Loading Regions...</p>}
            {/* <input className='dataInputs' type='text' value= {testData.region} onChange={(e)=> setTestData({ ...testData, region: e.target.value})}/> */}
          </section>
          <section>
            <p>Store Number</p>
            <input className='dataInputs' type='text' value= {testData.storeNumber} onChange={(e)=> setTestData({ ...testData, storeNumber: e.target.value})}/>
          </section>
        </div>
        {loading ? 
        <p className='testInfo'>Please Wait...</p>: 
        <button className='testButton' onClick={()=> submitTest()}> Submit Test</button>}
      </section>
      <section className='pluList'>
      {producePlus.length > 0 ? 
        producePlus.map((item,index)=> {
          const Name = item.Name;
          const Plu = item.Plu
          const imageUrl = item.image;
          
          return(
              <PluTestItems
              key= {index}
              setAnsweredCounter={setAnsweredCount}
              setScoreCounter={setScoreCounter}
              answered={answeredCount}
              score={scoreCounter}
              Name={Name} 
              Plu={Plu} 
              img={imageUrl}
              onLoad={handleImageLoad} // Call the onLoad event handler
              style={{ visibility: loadedImages > index ? 'visible' : 'hidden' }}
              />
              
          ) 
            
        })
      : <h1 className='loading'>Loading...</h1>
      }
      </section>
    </div>
  )
}
