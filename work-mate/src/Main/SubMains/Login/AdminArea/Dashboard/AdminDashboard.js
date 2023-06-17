import React, { useContext, useState, useEffect } from 'react'
import "../../AdminArea/admin.css"
import { ImHourGlass } from "react-icons/im";
import InfoTile from './subComponents/infoTile';
import InfoRow from './subComponents/infoRow';
import InfoTileStore from './subComponents/infoTileStore';
import { getDailyFigures,getWeekFigures } from '../RunReports/Functions/reportFunctions';
import { UserContext} from '../../../../../App';

function AdminDashboard(props,user) {
  const dataContext = useContext(UserContext)
  let dailyFigures = []
  const [weeklyFigures,setWeeklyFigures] = useState([]);
  const [todaysStores, setTodaysStores] = useState(null); // Initialize with null or appropriate initial value
  const [todaysTests, setTodaysTests] = useState(null);
  const [passrate,SetPassrate] = useState(null);
  const [mostActive,setMostActive] = useState(null);
  const [leastActive,setLeastActive] = useState(null);
  const [loading,setLoading] = useState(true)
  useEffect(() => {
    const fetchFiguresToday = async () => {
      try {
        const figures = await getDailyFigures(dataContext);
        setTodaysStores(figures.visits);
        setTodaysTests(figures.tests);
        SetPassrate(figures.averageScore)
        setMostActive(figures.mostVisits[0] || { region: "N/A", storeNumber: "N/A" });
        setLeastActive(figures.leastVisits[0] || {region: "N/A", storeNumber: "N/A"});
        setLoading(false)
      } catch (error) {
        console.log(error);
      }
    };
    const fetchWeekToDate = async () => {
      try {
        const weekToDate = await getWeekFigures(dataContext);
        setWeeklyFigures(weekToDate.dailyFigures)
      } catch (error) {
        console.log(error);
      }
    };
    fetchFiguresToday()
    fetchWeekToDate()
    
    // fetchFiguresToday();
    
  }, []);
  return (
    <div className='d-f-col'>
      <h1 className='adminTitle'>Welcome {props.user != "" ? props.user : null}</h1>
      <p className='subheaderP'>Here's the key metrics at a glance for you!</p>
      {loading ? 
        <p className="loadingData"> Fetching Your Figures...</p> : 
        <InfoTile Title= {"Todays Activity"} data= {todaysStores} message={`Users Have Logged In Today`}/>}
      <div className='underlineHalf'></div>
      {loading ? 
        <p className="loadingData">Generating Report...</p> : 
        <section className='dashboardGrid'>
          <InfoTile Title= {"Tests Today"} data= {todaysTests} message={"PLU Tests Taken Today"}/>
          <InfoTile Title= {"Pass Rate"} data= {(passrate == null) ? "0": `${passrate}%`} message={(passrate == null)? "Tests Taken Today": "Percent Of Answers Were Correct"}/>
          <InfoTileStore Title= {"Most Active"} Region= {mostActive.region} Store={mostActive.storeNumber} message={"Is The Most Active Store Today"}/>
          <InfoTileStore Title= {"Least Active"} Region= {leastActive.region} Store={leastActive.storeNumber} message={"Is The Least Active Store Today"}/>
        </section>
      }
      <div className='underlineHalf'></div>
      <div className='weeklyFiguresSection'>
          <section className='weeklyFiguresTable'>
            <InfoRow date={"Date"} sessions={"Sessions"} tests={"Tests Taken"} passrate={"Pass Rate"} mostActive = {"Most Active"}/>
              {weeklyFigures.length > 0 ? (
                weeklyFigures.map((day)=> {
                  const {date,visits,tests,averageScore} = day;
                  const mostActive = day.mostVisits && day.mostVisits.length > 0 ? 
                    `${day.mostVisits[0].region} - ${day.mostVisits[0].storeNumber}` 
                    : "N/A";
                  return (
                    <InfoRow 
                      date={date} 
                      sessions={visits} 
                      tests={tests} 
                      passrate={averageScore === null ? "0" : averageScore} 
                      mostActive = {mostActive}/>
                  )
                })): 
              <p className='loadingData'>Fetching Weekly Figures...</p>
              }
          </section>
          <section className='tableKey'>
            <h2>Targets</h2>
            <p>Sessions: 5</p>
            <p>Tests: 25% of Sessions</p>
            <p>Pass Rate: greater than 85%</p>
          </section>
      </div>
    </div>
  )
}

export default AdminDashboard