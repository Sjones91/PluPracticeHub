import React, {useEffect, useState} from 'react'

import "../../admin.css"

function Selector(props,regions,reportChoice,setReportChoice,stores,storeLoad) {
    const [regionList,setRegionList] = useState();
    const [storesList,setStoresList] = useState([]); 
    const [dateSelectorChoice,setDateSelectorChoice] =useState(false)
    const [customDate,setCustomDate] = useState({dateFrom:"",dateTo:""})
    const timeChoiceHandler = (value) => {
        if (value === "Today") {
            const today = new Date();
            const formattedDate = formatDate(today);
            props.setReportChoice({ ...props.reportChoice, timeChoice:{dateFrom: formattedDate, dateTo: formattedDate } });
        } else if (value === "This Week") {
            props.setReportChoice({ ...props.reportChoice, timeChoice:{ dateFrom: "", dateTo: "" } });
            const today = new Date();
            const formattedDate = formatDate(today);
            const startOfWeek = new Date(today.setDate(today.getDate() - today.getDay() + 1));
            const formattedStartDate = formatDate(startOfWeek);
            props.setReportChoice({ ...props.reportChoice, timeChoice:{ dateFrom: formattedStartDate, dateTo: formattedDate } });
        } else if (value === "This Month") {
            const today = new Date();
            const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
            const formattedStartDate = formatDate(startOfMonth);
            const formattedEndDate = formatDate(today);
            props.setReportChoice({ ...props.reportChoice, timeChoice:{dateFrom: formattedStartDate, dateTo: formattedEndDate } });
        } else if (value === "Custom Date") {
            setDateSelectorChoice(true);
        } else if (value === "") {
          // Handle the case when value is empty
        }
        }
        const formatDate = (date) => {
            const year = date.getFullYear();
            const month = (date.getMonth() + 1).toString().padStart(2, '0');
            const day = date.getDate().toString().padStart(2, '0');
            return `${year}/${month}/${day}`;
        }
        const submitCustomDate = () => {
            const { dateFrom, dateTo } = customDate;
            // Check if all values are filled
            if (dateFrom && dateTo) {
              // Validate date format using regular expressions
                const dateFormat = /^\d{2}\/\d{2}\/\d{4}$/;
                if (dateFrom.match(dateFormat) && dateTo.match(dateFormat)) {
                // Split the date string and convert it to a Date object
                const [fromDay, fromMonth, fromYear] = dateFrom.split('/');
                const [toDay, toMonth, toYear] = dateTo.split('/');
                // Update the conversion logic to handle the correct format
                const fromDate = new Date(fromYear, fromMonth - 1, fromDay);
                const toDate = new Date(toYear, toMonth - 1, toDay);
                // Check if dateFrom is before dateTo
                if (fromDate <= toDate) {
                  // Convert date format to 'yyyy/mm/dd'
                    const convertedDateFrom = `${fromYear}/${fromMonth.padStart(2, '0')}/${fromDay.padStart(2, '0')}`;
                    const convertedDateTo = `${toYear}/${toMonth.padStart(2, '0')}/${toDay.padStart(2, '0')}`;
                    props.setReportChoice({
                    ...props.reportChoice,
                    timeChoice: {
                        dateFrom: convertedDateFrom,
                        dateTo: convertedDateTo
                    }
                    });
                    setDateSelectorChoice(false);
                    setCustomDate({ dateFrom: '', dateTo: '' });
                    return; // Exit the function if all checks pass
                }
                }
            }
            // If any checks fail, display an error message or handle it accordingly
            alert('Please follow the correct date format (dd/mm/yyyy) and ensure the date range is valid.');
            };
    useEffect(()=> {
        setRegionList(props.regions)
        setDateSelectorChoice(false)
    },[props.regions])
    useEffect(()=> {
        setStoresList(props.stores)
    },[props.stores])

    return (
    <div>
        <section className='dropSelectorBar'>
            <section className='selectorBar'>
                <p>Region</p>
                <select className='dropDown' type='text' value= {props.reportChoice.regionChoice} onChange={(e)=>props.setReportChoice({...props.reportChoice, regionChoice: e.target.value, timeChoice:"",storeChoice:""})}>
                    <option></option>
                    {regionList? 
                        regionList.map((item)=> {
                            return (
                                <option key={item.region}>{item.region} - {item.Name}</option>
                            )
                        })
                        : null   
                    }
                </select>
            </section>
            <section>
                <p>Store Number</p> 
                        <select className='dropDown' type='text' value= {props.reportChoice.storeChoice} onChange={(e)=>props.setReportChoice({...props.reportChoice, storeChoice: e.target.value, timeChoice:""})}>
                            <option></option>
                            {storesList && storesList.length > 0? 
                                storesList.map((item)=> {
                                    return (
                                        <option key = {item.store_number}>{item.store_number.length < 3 ?
                                            `0${item.store_number}` 
                                            :item.store_number}
                                        </option>
                                    )
                                })
                                : <option>No Stores</option>   
                            }
                        </select>  
            </section>
            <section className=''>
                <p>Time Frame</p>
                <select className='dropDown' type='text' value= {props.reportChoice.timeChoice} onChange={(e)=>timeChoiceHandler(e.target.value)}>
                    <option></option>
                    <option>Today</option>
                    <option>This Week</option>
                    <option>This Month</option>
                    <option>Custom Date</option>
                </select>
            {dateSelectorChoice ? 
                <form className='d-f-col dateBox'>
                    <p>Enter Dates in the form of dd/mm/yyyy</p>
                    <section className='d-f-col dateSelect'>
                        <p>Date From</p>
                        <input value={customDate.dateFrom} onChange={(e)=>setCustomDate({...customDate,dateFrom: e.target.value})}></input>
                    </section>
                    <section className='d-f-col dateSelect'>
                    <p>Date to</p>
                        <input value={customDate.dateTo} onChange={(e)=>setCustomDate({...customDate, dateTo: e.target.value})}></input>
                    </section>
                    <div className='submitButton' onClick={()=>{
                        submitCustomDate();
                        }}>submit</div>
                </form>
                :null}
            </section>
        </section> 
    </div>
)
}

export default Selector
