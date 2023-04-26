import React from 'react'
import Menu from './Menu.js'
import ProdRevision from "./revision//produce/ProdRevision.js"
import ProdTest from "./tests/Prodtest.js";
import BakeRevision from "./revision/bakery/BakeRevision.js"
import BakeTest from "./tests/Baketest.js"
import { useState, useContext } from 'react'
import { UserContext } from '../../App.js';
function PluHome() {
  const [activityState,setActivityState] = useState(0);
  const [user,setUser] = useContext(UserContext);
  return (
    <div>
       {(()=> {
      switch(activityState) {
        case 0:
          return <Menu setActivityState={setActivityState}/>
        case 1:
          return <ProdRevision setActivityState={setActivityState}/>
        case 2:
          return <ProdTest setActivityState={setActivityState}/>
        case 3:
          return <BakeRevision setActivityState={setActivityState}/>
        case 4:
          return <BakeTest setActivityState={setActivityState}/>       
        default:
          return <Menu setActivityState={setActivityState}/>

      }
    })()}
  
    </div>
  )
}

export default PluHome