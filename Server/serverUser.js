const express = require("express");
const app = express();
const cors = require("cors");
const sql =  require("mssql");
const multer = require("multer");
const fs = require("fs");
const upload = multer();
const path = require("path");
const bcrypt = require('bcryptjs');
const PORT = 3002;

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

const ip = "192.168.1.81";
const ipLive ="209.141.50.150"
app.listen(PORT, ()=> {
    console.log("data post is running app running", PORT)
});
