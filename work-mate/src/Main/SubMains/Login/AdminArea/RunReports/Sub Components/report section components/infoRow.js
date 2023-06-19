import React from 'react'

function InfoRow(props,userData) {
  console.log(props.userData)
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const formattedDate = date.toLocaleDateString();
    return formattedDate;
  };
  let score = props.userData.percentage;
  return (
    
    <div className={score > 90 ? 'd-f-col infoRowCardPass infoCard':'d-f-col infoRowCardFail infoCard'}>
        <section className='d-f-row infoRowSection'>
          <p>Date: {formatDate(props.userData.date)}</p>
        </section>
        <section className='d-f-row infoRowSection'>
          <p>Department : {props.userData.department}</p>
          
        </section>
        <section className='d-f-row infoRowSection'>
          <p>PLU's Answered: {props.userData.testSize}</p>
          <p>PLU's Correct: {props.userData.scoreCorrect}</p>
        </section>
        <h1>Score : {props.userData.percentage}%</h1>
    </div>
  )
}

export default InfoRow