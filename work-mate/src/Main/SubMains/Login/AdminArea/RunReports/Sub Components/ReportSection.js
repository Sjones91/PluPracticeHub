import React, { useEffect, useState } from 'react';
import "../../admin.css";
import Tiles from "../Sub Components/report section components/Tiles.js";
import TableData from "../Sub Components/report section components/TableData.js";
import NavBar from '../Sub Components/report section components/navBar.js';

function ReportSection(props,loading,storeData) {
  const [reportType, setReportType] = useState(0);
  const [data,setData] = useState(null)
  useEffect(()=>{
    setData(props.storeData)
    
  })
  return (
    <div>
      {data == null? (
        <h1 className='loading'>Fetching Store Data...</h1>
      ) : (
        <div>
          <section className='d-f-col reportHeaders'>
          <h1 className='reportHeader'>Region/Store {data.storeInfo.region} / {data.storeInfo.storeNumber}</h1>
          <h2 className='reportSubHeader'>Date Range {data.storeInfo.dateRange.dateFrom} - {data.storeInfo.dateRange.dateTo}</h2>
          </section>
          <NavBar reportType={reportType} setReportType={setReportType} />
          <div>
            {(() => {
              switch (reportType) {
                case 0:
                  return <Tiles storeData={data} />;
                case 1:
                  return <TableData userData={data.userActivity} />;
                default:
                  return <Tiles storeData={data} />;
              }
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportSection;
