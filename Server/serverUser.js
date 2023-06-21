const express = require("express");
const app = express();
const cors = require("cors");
const sql =  require("mssql");
const multer = require("multer");
const fs = require("fs");
const upload = multer();
const path = require("path");
const bcrypt = require('bcryptjs');
const https = require("https");
const PORT = 3333;

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

app.post("/pluListRetrieve", async (req, res) =>{
    const depChoice = await req.body.department;

    try {
        await sql.connect(config);
        const response = await sql.query(`SELECT * FROM [Plu-Items] WHERE [Department] = '${depChoice}' ORDER BY CAST([Plu] AS INT) ASC`)
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
/*******************Test functions******************* */
app.post("/postAnswer", async (req, res) => {
    console.log("PostAnswer Route Taken")
    const data = req.body;
    console.log(data)
    console.log(data.testData.region)
    console.log(data.testData.storeNumber)
    const percentage = Math.ceil(data.percentage);
    let storeNumber;
    //assess and change store number value based on 1-3 digits. can accept 101 but not 1 or 10. must be 001 or 010
    if(data.testData.storeNumber.length === 3) {
        storeNumber = data.testData.storeNumber
    }else if(data.testData.storeNumber.length === 2) {
        storeNumber = `0${data.testData.storeNumber}`
    } else if (data.testData.storeNumber.length === 1) {
        storeNumber = `00${data.testData.storeNumber}`
    } 

    // console.log(data.storeNumber,data.department,data.testSize,data.scoreCorrect)
    try {
        //query the db for an admin login
        const date = new Date().toISOString().slice(0, 10);
        const insertQuery = "INSERT INTO [Test-Results-Data] (region,storeNumber,department,testSize,scoreCorrect,percentage,date) VALUES (@region,@storeNumber,@department,@testSize,@scoreCorrect,@percentage, @date)";
        const connection =  await sql.connect(config);
        const request = new sql.Request()
        request.input('region', sql.Int, data.testData.region);
        request.input('storeNumber', sql.Int, storeNumber);
        request.input('department', sql.VarChar, data.testData.department);
        request.input('testSize', sql.Int, data.answeredCount);
        request.input('scoreCorrect', sql.Int, data.scoreCorrect);
        request.input('percentage', sql.Int, percentage);
        request.input('date', sql.Date, date);
        await request.query(insertQuery);

        res.status(200).send({message: "Test Successfully Submitted."})
    } catch(error) {
        console.log(error);
        res.status(500).send("Error Submitting test to Database.")
    };
});
//***************Login Work **************************/    
app.post("/login", async (req, res) => {
    try {
        //query the db for an admin login
        const {storeNo,region} = req.body;
        let regionNum = parseInt(region);
        let storeNumber; 
        //check if the correct amount of digits are sent. must be 3, such as 145 or 075 not 75.
        if(storeNo.length === 3) {
            storeNumber = storeNo
        }else if(storeNo.length === 2) {
            storeNumber = `0${storeNo}`
        } else if (storeNo.length === 1) {
            storeNumber = `00${storeNo}`
        } 
        const date = new Date().toISOString().slice(0, 10);
        const insertQuery = "INSERT INTO [User_Activity] (Region,store_number, date) VALUES (@region,@store_number,@date)";
        console.log(date)
        const connection =  await sql.connect(config);
        const request = new sql.Request()
        request.input('region', sql.Int, regionNum);
        request.input('store_number', sql.Int, storeNumber);
        request.input('date', sql.Date, date);
        await request.query(insertQuery);

        res.status(200).send({message: "Store number logged to database successfully."})
    } catch(error) {
        console.log(error);
        res.status(500).send("Error inserting store number into the database.")
    };
});
app.post("/grabRegions", async (req, res) =>{
    console.log("grabRegions route taken")
    try {
        await sql.connect(config);
        const response = await sql.query(`SELECT DISTINCT [Region],[Name] FROM [Region_List] `)
        const regions = response.recordset.map((record) =>({ region:record.Region, Name:record.Name } ))
        if(regions.length > 0) {
            res.status(200).send(regions);
        } else {
            res.status(500).send({body: "No Regions found. Please refresh or contact the administrator."})
        }
    } catch (error) {
        console.log(error);
        console.log("Failure to connect to database")
        res.status(500).send("Error retrieving data from the database.");
    }
    
})


const ip = "81.152.120.136";
const ipLive ="209.141.50.150"
app.listen(PORT, ()=> {
    console.log("data post is running app running", PORT)
});

// // Configure SSL certificate and private key paths
// const privateKeyPath = 'certificates/private.key';
// const certificatePath = 'certificates/certificate.crt';

// // Read the SSL certificate and private key files
// const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
// const certificate = fs.readFileSync(certificatePath, 'utf8');

// // Create the HTTPS server with SSL options
// const server = https.createServer({
//   key: privateKey,
//   cert: certificate
// }, app);

// // Start the HTTPS server
// server.listen(PORT, () => {
//   console.log("HTTPS server is running on port", PORT);
// });