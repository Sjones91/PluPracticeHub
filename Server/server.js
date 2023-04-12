const express = require("express");
const app = express();
const cors = require("cors");
const mysql =  require("mysql");

app.use(cors());
app.use(express.json());

const connection = mysql.createConnection({
    host: "plu-practice-hub.cygacds5e57w.eu-west-2.rds.amazonaws.com",
    user: "admin",
    password: "Control34",
    database:"PLU_Practice_Hub",
    port: 3308
})

app.post("/login", async (req, res) => {
    try {
        //query the db for an admin login
        const {storeNo, name} = req.body;
        console.log("we receieved something")
        const insertQuery = "INSERT INTO PLU_Practice_Hub.Activity (storeNumber, name) VALUES (?,?)";
        const insertValues = [storeNo,name];
        connection.query(insertQuery,insertValues, (error, results) => {
            if(error) {
                console.log(error);
                res.status(500).send("Server Error");   
            } else {
                console.log(results);
                res.status(200).send("Data inserted successfully")
            }
            
        })
    } catch(error) {
        console.log(error);
        res.status(500).send("didnt work bro")
    };
});

app.post("/adminlogin", async (req, res) => {
    try {
        const {email,password} = req.body;
        //query the DB for a admin login (PLU_Practice_Hub.admins)
        const queryString = "SELECT * from PLU_Practice_Hub.admins WHERE email = ? AND password = ?";
        const queryValues = [email,password];

        connection.query(queryString,queryValues, (error, results) => {
            if(error) {
                console.log(error);
                res.status(500).send("Server Error");   
            } else {
                if(results.length > 0) {
                    res.status(200).send(true);
                } else {
                    res.status(401).send(false)
                }
            }  
        }) 
    } catch(error) {
        console.log(error);
        res.status(500).send("Error connecting to backend.")
    };
});

const PORT = 3001;

app.listen(PORT, ()=> {
    console.log("app running")
});
