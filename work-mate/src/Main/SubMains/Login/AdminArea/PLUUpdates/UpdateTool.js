import React from 'react';
import "../admin.css";
import UpdateForm from './SubComponents/UpdateForm';
function UpdateTool() {
  return (
    <div className='d-f-col updateArea'>
      <section>
      <h1>PLU Update Tool</h1>
      <p>Please use the form below to update the PLU's for the Bakery and Produce.</p>
      </section>
      <UpdateForm/>
    </div>
  )
}

export default UpdateTool