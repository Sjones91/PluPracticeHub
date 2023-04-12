import React, {useState} from 'react'
import "../../admin.css"
function UpdateForm() {
    const [images, setImages] = useState([]);
    const [serverMessage, setServerMessage] = useState();
    //handles the name change in the form
    const handleImageChange = (event) => {
        const uploadedImages = Array.from(event.target.files);
        const newImages = [];
        uploadedImages.forEach((image) => {
          const reader = new FileReader();
          reader.onload = () => {
            const base64Data = reader.result.split(",")[1];
            const newImage = {
              file: {
                name: image.name,
                type: image.type,
                data: base64Data,
              },
              url: URL.createObjectURL(image),
              name: "",
              plu: "",
              department: "",
            };
            newImages.push(newImage);
            setImages([...images, ...newImages]);
          };
          reader.readAsDataURL(image);
        });
      };
      
    
    const handleNameChange = (event, index)=> {
        const inputName = event.target.value;
        setImages((prevImages)=> {
            const newImages = [...prevImages];
            newImages[index].name = inputName;
            return newImages
        })
    }
    //handles department change in the form
    const handleDepartmentChange = (event, index)=> {
        const inputName = event.target.value;
        setImages((prevImages)=> {
            const newImages = [...prevImages];
            newImages[index].department = inputName;
            return newImages
        })
    }
    //handles plu change in the form
    const handlePluChange = (event, index) => {
        const newPlu = event.target.value;
        setImages((prevImages)=> {
            const newImages = [...prevImages];
            newImages[index].plu = newPlu;
            return newImages; 
        })
    }
    // const validateUniqueEntry = (array) => {
    //     //NOT IMPLEMENTED YET (REQUIRES A COLLECTION OF PLU INPUTS)
    //     //creates a new Set to see if the set is less than original array.
    //     //if set is less than original i.e 1 or more repeat items, then it will return false.
    //     const set = new Set(array);
    //     if(set.size === array.length) {
            
    //         return true
    //     } else {
    //         return false;
    //     }

    // }
    const handleSubmit = async (event)=> {
        event.preventDefault();
        //input validation to check every field is correct and populated with data.
        const inputValidation = images.every((image) => {
            //WORKING EFFECTIVELY! DONT CHANGE
            return (
                (image.department === "Produce" || image.department === "Bakery") &&
                image.plu*0 === 0 &&
                image.plu !== "" &&
                image.name !== "" &&
                image.name*0 !== 0
            );
        });

        if(inputValidation) {
            try {
                //post the completed images state to the back end
                const response = await fetch("http://localhost:3002/pluInsert", 
                    {method: "POST",
                    headers: {
                    "Content-Type": "application/json"
                    },
                    body: JSON.stringify({
                        imageGroup: images
                    })
                })
                
                const data = await response.json()
                console.log(data.data)
                setServerMessage(data.data)
            } catch (error) {
                console.log(error);
                //alert the user there was an error connecting to the server.
            }
        } else {
            alert("Please ensure all images have a Unique Name,Plu and select a Department")
        }
    };
  return (
    <div>

        <form onSubmit={handleSubmit}>
            <input type="file" className="a-s-center"onChange={handleImageChange} multiple/>
            {serverMessage ? <h2 className='serverResponse'>{serverMessage}</h2>: null}
            <div className='uploadedImages'>
                {images.map((image, index)=> (
                    <div className='eachUpload d-f-col'key={index}>
                        <img src={image.url} alt={`${index}`}/>
                        <input type="text" onChange={(event)=>handleNameChange(event,index)} placeholder='Name'/>
                        <input type="text" onChange={(event)=>handlePluChange(event,index)} placeholder='PLU'/>
                        <select onChange={(event)=>handleDepartmentChange(event,index)}>
                            <option>Select Department</option>
                            <option>Produce</option>
                            <option>Bakery</option>
                        </select>
                    </div>
                ))};
            </div>
            <button type="submit" className='uploadButton'>Upload</button>      
        </form>
    </div>
  )
}

export default UpdateForm;