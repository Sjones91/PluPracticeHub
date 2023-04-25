import React, {useState,useEffect} from 'react'
import "../../admin.css"
import UpdateItemUnit from './UpdateItemUnit'
function PluUpdateList(props,setUpdateList,updateList) {
    const [pluList,setPluList] = useState([]);
    // const [updateList,setUpdateList] = useState(false); //passed to updateItemUnit to be flipped when a change has been made, used to trigger rerender in use
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
        }catch(error) {
          console.log(error)
        }
    };
    useEffect(()=>{
      grabAllPlus()
      
    },[props.updateList]);
  return (
    <div className="pluListItems">
        {pluList.length > 0 ?
        
        pluList.map((item,index)=> {
            const plu = item.Plu;
            const Name = item.Name;
            const id = item.id;
            const image = item.imageSource;
            return <UpdateItemUnit 
            setUpdateList={props.setUpdateList} 
            updateList = {props.updateList} 
            pluList={pluList} 
            key = {index} 
            Name = {Name} 
            Plu = {plu} 
            id={id}
            image = {image}
            />
        })
        :
        <h2>No PLU's found. Please use the "Upload PLU's" page to get started.</h2>
        }
    </div>
  )
}

export default PluUpdateList