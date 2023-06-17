import React, {useState, useContext,useEffect} from 'react'
import { fetchRegions,fetchAvailableStores,fetchUniqueStoreData } from './Functions/reportFunctions';
import Selector from './Sub Components/Selector';
import Information from './Sub Components/Information';
import ReportSection from "../RunReports/Sub Components/ReportSection.js"
import { UserContext } from '../../../../../App';

function RunReport() {
  const [reportChoice,setReportChoice] = useState({
    regionChoice:"",
    storeChoice: "",
    timeChoice: ""
  })
  const dataContext = useContext(UserContext)
  const [regions,setRegions] = useState("");
  const [stores,setStores] = useState("");
  const [displayData,setDisplayData] = useState(false) 
  const [storeFigures,setStoreFigures] = useState();
  const [loading,setLoading] = useState(true)
 
  //grab regions use effect
  useEffect(()=> {
    const getRegions = async () => {
      setLoading(true)
      try {
        const regionList = await fetchRegions(dataContext);
        setRegions(regionList)
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    getRegions(dataContext)
  },[])
  
  //grab stores use effect
  useEffect(()=>{
    const getStores = async () => {
      try {
        const storeList = await fetchAvailableStores(dataContext,reportChoice.regionChoice.substring(0,3));
        setStores(storeList)
      } catch (error) {
      }
    };
    getStores(dataContext,reportChoice.regionChoice)
  },[reportChoice])
  
  //grab specific data use effect
  useEffect(()=> {
    let region 
    setLoading(true)
    const getStoreData = async () => {
      try {
        const storeData = await fetchUniqueStoreData(dataContext,region, reportChoice.storeChoice,reportChoice.timeChoice);
        setStoreFigures(storeData)
        setLoading(false)
      } catch (error) {
      }
    };
    if(reportChoice.regionChoice != "" && reportChoice.storeChoice != "" && reportChoice.storeChoice !== "No Stores" && reportChoice.timeChoice != "") {
      region = reportChoice.regionChoice.substring(0,3);
      //run a query
      getStoreData(dataContext,region, reportChoice.storeChoice,reportChoice.timeChoice);
      //set a state to true so i can display the data component.
      setDisplayData(true)
    } else {
      setDisplayData(false)
    }
  },[reportChoice])
  
  return (
    <div className='d-f-col'>
      <Selector regions = {regions} stores = {stores} reportChoice={reportChoice} setReportChoice={setReportChoice}/>
      <Information/>
      <div className='underlineHalf'></div>
      {displayData ? <ReportSection loading={loading} storeData={storeFigures}/>: null}
    </div>
  )
}

export default RunReport