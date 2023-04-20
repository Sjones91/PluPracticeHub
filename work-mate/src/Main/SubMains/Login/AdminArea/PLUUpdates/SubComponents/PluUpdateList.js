import React, {useState,useEffect} from 'react'
import "../../admin.css"
import UpdateItemUnit from './UpdateItemUnit'
function PluUpdateList() {
    const [pluList,setPluList] = useState([]);
    const grabAllPlus = async () => {
        try {
          const response = await fetch("http://localhost:3001/pluListRetrieveAll", {
            method: 'POST',
            headers: {
            'Content-Type': 'application/json'
            },
            body: JSON.stringify({department : "Produce"}) // Convert data to JSON string
          })
          const serverResponse = await response.json();
          setPluList(serverResponse);
          console.log(serverResponse)
        }catch(error) {
          console.log(error)
        }
    };
    useEffect(()=>{
      grabAllPlus()
    },[]);
  return (
    <div>
        {pluList.map((item)=> {
            const plu = item.Plu;
            const Name = item.Name;
            return <UpdateItemUnit Name = {Name} Plu = {plu}/>
        })}
    </div>
  )
}

export default PluUpdateList