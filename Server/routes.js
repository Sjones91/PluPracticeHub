const sql = require('mssql');
const express = require("express");
const app = express();
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const upload = multer();
const path = require("path");
const { transcode } = require('buffer');
const router = express.Router();


const PORT = 3001;
app.set("port", PORT);


//setting file upload limits and setting static directory for storing files within server folder "uploads"
app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(upload.array("files", 50))
app.use(express.json({limit: "200mb"}));
const storage = multer.memoryStorage();
const uploadImages = multer(
    { 
        storage: storage, 
        limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
    }).array("images");

// Create a connection configuration object
const config = {
  server: '209.141.50.150', // server ip or localhost when running from the server
  user: 'Admin', // sql login
  password: 'Marley22-', // sql password
  database: 'Plu-Practice-Hub', // sql database
  port: 1433,
  encrypt: true, // Enable encryption
  options: {
    trustServerCertificate: true // Use only for development/testing purposes, remove in production
  }
};
//*********************************************Routes ****************************** */
app.post("/pluInsert", uploadImages, async (req,res)=> {
  //PAYLOAD
  //             file: {
  //                 name: image.name,
  //                 type: image.type,
  //                 buffer: image.buffer
  //             },
  //             url: URL.createObjectURL(image),
  //             name:"",
  //             plu:"",
  //             department: ""
  //}
  const images = req.files;
  const imageData = req.body.imageGroup;
  //console.log(imageData)
  let insertQuery = "INSERT INTO [dbo].[Plu-Items] ([Department], [Name], [Plu], [image]) VALUES (@department,@name,@plu,@image)";
  let skippedItems = 0;
  const promises =  imageData.map(async (image)=> {
      const base64Data = image.file.data;
      const binaryData = Buffer.from(base64Data, 'base64');
      const imageFileName = `${Date.now()}.jpg`;
      // PAUSE const imagePath = path.join(uploadDir, imageFileName);
      const imagePath = `uploads/${imageFileName}`;
      const grabImagePath = `${req.protocol}://${req.hostname}:${req.app.get('port')}/uploads/${imageFileName}`;
      console.log(grabImagePath)
      //write the file to the disk
      await fs.writeFile(imagePath, binaryData, (err) => {
          if (err) {
              console.error(err);
              // handle error
          } else {
              
              console.log(`File written successfully to ${imagePath}`);
              // continue with your logic after file is written successfully
          }
      });
      const values = [
          image.department,
          image.name,
          image.plu,
          grabImagePath,
      ];
      return new Promise( async (resolve, reject) => {
          sql.connect(config)
          .then(()=> {
            //create a new request object
            const request = new sql.Request();

            //bind the values to the request object
            request.input('Department', sql.VarChar, image.department);
            request.input('Name', sql.VarChar, image.name);
            request.input('Plu', sql.VarChar, image.plu);
            request.input('image', sql.VarChar, grabImagePath);

            const transaction = new sql.Transaction();
            transaction.begin()
            .then(()=> {
              //Check if PLU or name already exists
              return request.query('SELECT COUNT(*) AS count FROM [dbo].[Plu-Items] WHERE [Plu] = @plu or [Name] = @name;');
            })
            .then((results)=> {
              const {count} = results.recordset[0];
              if(count > 0) {
                //if count is greater than 0 the skip the insert
                console.log("Duplicate Plu or Name, Skipping insert");
                transaction.commit()
                .then(()=> {
                  //resolve with the skip message
                  resolve({status:"Skipped", message: "Duplicate Plu or Name"})
                })
                .catch((error)=> {
                  reject(error);
                })
              } else {
                //insert the line into the database
                return request.query(insertQuery);
              }
            })
            .then((results)=> {
              console.log("Successfully inserted data into the database");
              transaction.commit()
              .then(()=> {
                resolve(results)
              })
              .catch((error)=> {
                reject(error);
              })
            })
            .catch((error)=> {
              transaction.rollback()
                .then(()=> {
                  console.log(error);
                  reject(error);
                })
                .catch((rollbackError)=> {
                  console.log(rollbackError);
                  reject(rollbackError);
                })
            })
            .finally(()=> {
              sql.close();
            })  
          })
          .catch((error)=> {
            console.log(error);
            reject(error);
          })
      })
  try {
      //trys to carry out all promises created afterwhich logs to the console what is inserted and what isnt.
      const result = 
          await Promise.all(promises);
          const responseString = "Products sent to database. Duplicate 'PLU' or 'Name' have NOT been inserted. Please audit current PLU's in the database regularly."                  
          res.json({data: responseString })
          //this will then send back skipped items to the client
  }catch (error) {
      console.log(error);
  } 
})
});






