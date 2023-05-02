const express = require("express");
const app = express();
const cors = require("cors");
const sql =  require("mssql");
const multer = require("multer");
const fs = require("fs");
const upload = multer();
const path = require("path");
const bcrypt = require('bcryptjs');
const https = require('https');
const PORT = 3001;

const options = {
    key: fs.readFileSync('C:/Users/Administrator/Documents/Websites/certs/privkey.pem'),
    cert: fs.readFileSync('C:/Users/Administrator/Documents/Websites/certs/certificate.pem')
};

app.set("port", PORT);

app.use(cors());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(upload.array("files", 50))
app.use(express.json({limit: "200mb"}));
//************************plu work**************************


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
const storage = multer.memoryStorage();
const uploadImages = multer(
    { 
        storage: storage, 
        limits: { fileSize: 10 * 1024 * 1024 } // 10 MB
    }).array("images");
/**************Admin Plu updating, uploading and deleting*/
app.post("/pluInsert", uploadImages, async (req,res)=> {
    console.log("Plu insert route taken")
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
    console.log(images)
    console.log(imageData)
    //console.log(imageData)
    let insertQuery = "INSERT INTO [Plu-Items] ([Department], [Name], [Plu], [image], [imageSource]) VALUES (@department,@name,@plu,@image, @imageSource)";
    let skippedItems = 0;
    const promises =  imageData.map(async (image)=> {
        const base64Data = image.file.data;
        const binaryData = Buffer.from(base64Data, 'base64');
        const imageFileName = `${Date.now()}.jpg`;
        // PAUSE const imagePath = path.join(uploadDir, imageFileName);
        const imagePath = `uploads/${imageFileName}`;
        const grabImagePath = `${req.protocol}://${req.hostname}:${req.app.get('port')}/uploads/${imageFileName}`;
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
            imagePath
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
                request.input('imageSource',sql.VarChar, imagePath);
                const transaction = new sql.Transaction();
                transaction.begin()
                    .then(()=> {
                    //Check if PLU or name already exists
                        return request.query('SELECT COUNT(*) AS count FROM [Plu-Items] WHERE [Plu] = @plu or [Name] = @name;');
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
});
app.post("/updatePluItem", async (req,res)=>{
    const {id,name,plu} = req.body;
    console.log(id,name,plu)
    ///////need to add checks to see if the plu or name already exists ******TO DO!*******
    try {
        await sql.connect(config);
        const results = await sql.query(`SELECT COUNT(*) AS count FROM [Plu-Items] WHERE Plu = '${plu}';`)
        const {count} = results.recordset[0];
        console.log("counts for plu and name", count)
        if(count > 0) {
            res.status(409).send({message: "Not updated. Plu already used."});
        } else {
            try {
                const response = await sql.query(`UPDATE [Plu-Items] SET Name = '${name}', Plu = '${plu}' WHERE id = '${id}'`)
                const results = response.rowsAffected;
                console.log(results)
                res.status(200).send({message: "Item Successfully Updated."})
            } catch(error) {
                console.log(error)
            }
        }
    } catch(error) {
        console.log(error)
    }
    
})
app.post("/deletePlu", async (req,res)=>{
    const {id,name,plu,image} = req.body;
    console.log(id,name,plu, image)
    ///////need to add checks to see if the plu or name already exists ******TO DO!*******
    try {
        await sql.connect(config);
        const response = await sql.query(`DELETE FROM [Plu-Items] WHERE id = '${id}'`)
        const results = response.rowsAffected;
        console.log(results)

        await fs.unlink(image, (error)=> {
            if(error){
                console.log(error);
                console.log("not deleted from folder")
            } else {
                console.log("file successfully deleted from", image)
            }

        }) 
        res.status(200).send({message: "Deleted Successfully"})
    } catch(error) {
        console.log(error)
    }
})
app.post("/deleteALL", async (req,res)=> {
    try{
        await sql.connect(config);
        const response = await sql.query("TRUNCATE TABLE [Plu-Items];");
        const results = response.rowsAffected;
        console.log(results)
    } catch(error) {
        console.log(error);
    }

    const folderPath = "./uploads"
    await fs.readdir(folderPath, (error, files)=> {
        if(error) throw error;

        for(const file of files) {
            fs.unlink(`${folderPath}/${file}`, error => {
                if(error) throw error;
            })
        }

    })
    res.status(200).send({message: "all items deleted from server"})
})
/*************Retrieve queries for user experience ****/
app.post("/pluListRetrieve", async (req, res) =>{
    const depChoice = await req.body.department;

    try {
        await sql.connect(config);
        const response = await sql.query(`SELECT * FROM [Plu-Items] WHERE [Department] = '${depChoice}' ORDER BY [Plu] ASC`)
        const results = response.recordset
        

        if(results.length > 0) {
            res.status(200).send((await response).recordset);
        } else {
            res.status(500).send({body: "No Plu's found. Please refresh or contact the administrator."})
        }

    } catch (error) {
        console.log(error);
        console.log("failed")
        res.status(500).send("Error retrieving data from the database.");
    }
    // const retrieveQuery = `SELECT * FROM PLU_Practice_Hub.PLU_ITEMS WHERE Department = (?)`;
    // pool.query(retrieveQuery, depChoice, (error, results, fields) =>{
    //     if(error) {
    //         console.log(error)
    //         console.log("failed")
    //         res.status(500).send("Error retrieving data from the database.");
    //     } else {
    //         res.status(200).json(results)
    //     }
    // })
})
app.post("/pluListRetrieveAll", async (req, res) =>{
    const depChoice = await req.body.department;

    try {
        await sql.connect(config);
        const response = await sql.query(`SELECT * FROM [Plu-Items] ORDER BY [Plu] ASC`)
        const results = response.recordset
        

        if(results.length > 0) {
            res.status(200).send((await response).recordset);
        } else {
            res.status(500).send({body: "No Plu's found. Please refresh or contact the administrator."})
        }

    } catch (error) {
        console.log(error);
        console.log("failed")
        res.status(500).send("Error retrieving data from the database.");
    }
    // const retrieveQuery = `SELECT * FROM PLU_Practice_Hub.PLU_ITEMS WHERE Department = (?)`;
    // pool.query(retrieveQuery, depChoice, (error, results, fields) =>{
    //     if(error) {
    //         console.log(error)
    //         console.log("failed")
    //         res.status(500).send("Error retrieving data from the database.");
    //     } else {
    //         res.status(200).json(results)
    //     }
    // })
})
//***************Login Work **************************/    
app.post("/login", async (req, res) => {
    try {
        //query the db for an admin login
        const {storeNo} = req.body;
        console.log(storeNo)
        const date = new Date().toISOString().slice(0, 10);
        const insertQuery = "INSERT INTO [User-Visits] (store_number, date) VALUES (@store_number,@date)";
        console.log(date)
        const connection =  await sql.connect(config);
        const request = new sql.Request()
        request.input('store_number', sql.VarChar, storeNo);
        request.input('date', sql.Date, date);
        await request.query(insertQuery);

        res.status(200).send({message: "Store number logged to database successfully."})
    } catch(error) {
        console.log(error);
        res.status(500).send("Error inserting store number into the database.")
    };
});

app.post("/adminlogin", async (req, res) => {
    const {username,password} = req.body;
    const connection = await sql.connect(config);
    const response = await sql.query(`SELECT * FROM [Administrators] WHERE [Username] = '${username}'`)
    console.log(password)
if(response.rowsAffected > 0) {
    const adminPasswordHash = response.recordset[0].Password;
    console.log(adminPasswordHash)

            bcrypt.compare(password,adminPasswordHash, (err,results)=> {
                if(err) {
                    console.log(error)
                    res.status(500).send({message:"Error validating password."})
                } else if(results){
                    console.log(results);
                    res.status(200).send({message:"Passwords match. User logged in."})
        
                } else {
                    console.log(results)
                    res.status(409).send({message:"The password you entered is incorrect. Please try again."})
                }
            })
    } else {
        res.status(404).send({message:"User Not found."})
        sql.close()
    }
    
});
app.post("/register", async (req, res) => {
    const {Authkey,username,password} = req.body;
    console.log(Authkey,username,password)
    const saltRounds = 10; // number of rounds to generate the salt
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log(hashedPassword)
    //Query if the auth key is valid and allow to create a new user, if authkey is invalid, user does not have auth
    const connection = await sql.connect(config);
    const result = await sql.query(`SELECT * FROM [Administrators] WHERE [AuthKey] = '${Authkey}'`);
    const count = result.rowsAffected
    console.log(result)
    //todo - hash the password before soring it into the database.
    if(Authkey === result.recordset[0].Authkey) {
        try{
            const response= await sql.query(`INSERT INTO [Administrators] (username,password) VALUES ('${username}','${hashedPassword}')`);
            console.log(response.rowsAffected)
            res.status(200).send({message: "Administrator successfully registered."})
        } catch(error){
            console.log(error)
        }
    } else {
        res.status(409).send({message: "Authorisation key invalid. Please enter a valid Authorisation Key."})
    }
});



// //declares port and starts listening on that port.   
const ip = "192.168.1.81";
const ipLive ="209.141.50.150"
// app.listen(PORT, ipLive, ()=> {
//     console.log("data post is running app running", PORT)
// });

https.createServer(options, app).listen(PORT, ipLive, ()=> {
    console.log("data post is running app running", PORT)
});