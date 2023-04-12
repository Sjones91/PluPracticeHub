const express = require("express");
const app = express();
const cors = require("cors");
const mysql =  require("mysql");
const multer = require("multer");
const fs = require("fs");
const upload = multer();
const path = require("path");

app.use(cors());
app.use(upload.array("files", 50))
app.use(express.json({limit: "200mb"}));

const uploadDir = path.join(__dirname, 'uploads');

const pool = mysql.createPool({
    host: "plu-practice-hub.cygacds5e57w.eu-west-2.rds.amazonaws.com",
    user: "admin",
    password: "Control34",
    database:"PLU_Practice_Hub",
    port: 3308,
    connectionLimit: 10 // Set the maximum number of connections in the pool
})
const storage = multer.memoryStorage();
const uploadImages = multer(
    { 
        storage: storage, 
        limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
    }).array("images");

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
    let insertQuery = "INSERT IGNORE INTO PLU_Practice_Hub.PLU_ITEMS (Department, Name, Plu, image) VALUES (?, ?, ?, ?)";
    let skippedItems = 0;
    const promises =  imageData.map(async (image)=> {
        const base64Data = image.file.data;
        const binaryData = Buffer.from(base64Data, 'base64');
        
        const imageFileName = `${Date.now()}_${image.name}`;
        const imagePath = path.join(uploadDir, imageFileName);

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
            imageFileName,
        ];
        return new Promise( (resolve, reject) => {
            pool.query(insertQuery, values, (error, results, fields)=> {
                if(error){
                    console.log(error)
                    reject(error)
                } else {
                    // this just logs the item being queried to array depending on if it was inserted.
                    if(results.affectedRows > 0) {
                        console.log("inserted, not dupe")
                    } else {  
                    }
                }
                resolve(results);
            });   
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

app.post("/pluListRetrieve", async (req, res) =>{
    const depChoice = await req.body.department;
    const retrieveQuery = `SELECT * FROM PLU_Practice_Hub.PLU_ITEMS WHERE Department = (?)`;
    pool.query(retrieveQuery, depChoice, (error, results, fields) =>{
        if(error) {
            console.log(error)
            console.log("failed")
            res.status(500).send("Error retrieving data from the database.");
        } else {
            res.status(200).json(results)
        }
    })
})
    
//declares port and starts listening on that port.   
const PORT = 3002;

app.listen(PORT, ()=> {
    console.log("data post is running app running")
});
