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
const PORT = 3001;

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
      trustServerCertificate: true, // Use only for development/testing purposes, remove in production
      requestTimeout: 90000
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
                            fs.writeFile(imagePath, binaryData, (err) => {
                                if (err) {
                                    console.error(err);
                                    // handle error
                                } else {
                                    console.log(`File written successfully to ${imagePath}`);  
                                }
                            });
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
    console.log("updatePluItem Route Taken")
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
    console.log("deletePlu Route Taken")
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
    console.log("deleteAll Route Taken")
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
/*********************Functions for reporting********************** */
app.post("/grabDailyFigures", async (req,res)=>{
    console.log("grab Daily Stores route taken.")
    const date = new Date().toISOString().slice(0, 10);
    try {
        await sql.connect(config);
        console.log("connected")
        ///grab dailyVisits
        const response = await sql.query(`SELECT COUNT(*) AS totalCount FROM [User_Activity] WHERE [date] = '${date}'`)
        const visits = response.recordset[0].totalCount;
        /// grab dailyTests
        const tests = await sql.query(`SELECT COUNT(*) AS totalCount FROM [Test-Results-Data] WHERE [date] = '${date}'`)
        const testsTaken = tests.recordset[0].totalCount;

        /// grab daily percentage
        const percentage = await sql.query(`SELECT AVG(percentage) AS averagePercentage FROM [Test-Results-Data] WHERE [date] = '${date}';`)
        const averageScore = percentage.recordset[0].averagePercentage;
        /// grab daily most visited
        const Visits = await sql.query(`
            SELECT TOP 1 Region, store_number, COUNT(*) AS totalVisits
            FROM [User_Activity]
            WHERE [date] = '${date}'
            GROUP BY Region, store_number
            ORDER BY totalVisits DESC;
            `);
            const mostVisitedStore = Visits.recordset.map((record) => ({
            region: record.Region,
            storeNumber: record.store_number,
            totalVisits: record.totalVisits
            }));

        /// grab least visited.
        const leastVisits = await sql.query(`
            SELECT region, store_number, COUNT(*) AS totalVisits
            FROM [User_Activity]
            WHERE [date] = '${date}'
            GROUP BY region, store_number
            ORDER BY totalVisits ASC;
            `);
            const leastVisitedStores = leastVisits.recordset.map((record) => ({
            region: record.region,
            storeNumber: record.store_number,
            totalVisits: record.totalVisits
            }));

        /// Send response back to client
        res.status(200).send({
            message: "Retrieved", 
            visits: visits, 
            tests: testsTaken,
            mostVisits: mostVisitedStore,
            leastVisits: leastVisitedStores,
            averageScore: averageScore})
    } catch(error) {
        console.log(error);
        res.status(500).send({ error: "An error occurred" })
    }
})
app.post("/grabDailyFigures7", async (req, res) => {
    console.log("grab Weekly Stores route taken.");

    try {
        await sql.connect(config);

        const today = new Date().toISOString().slice(0, 10);
        const dailyFigures = [];
        //loop for daily figures
        for (let i = 0; i < 7; i++) {
            const currentDate = new Date();
            currentDate.setDate(currentDate.getDate() - i);
            const date = currentDate.toISOString().slice(0, 10);
            //grab total visits
            const response = await sql.query(`SELECT COUNT(*) AS totalCount FROM [User_Activity] WHERE [date] = '${date}'`);
            const visits = response.recordset[0].totalCount;
            //grab daily tests figures
            const tests = await sql.query(`SELECT COUNT(*) AS totalCount FROM [Test-Results-Data] WHERE [date] = '${date}'`);
            const testsTaken = tests.recordset[0].totalCount;
            //grab daily percentage pass rate
            const percentage = await sql.query(`SELECT AVG(percentage) AS averagePercentage FROM [Test-Results-Data] WHERE [date] = '${date}'`);
            const averageScore = percentage.recordset[0].averagePercentage;
            //Grab Most Visits
            const Visits = await sql.query(`
                SELECT TOP 1 Region, store_number, COUNT(*) AS totalVisits
                FROM [User_Activity]
                WHERE [date] = '${date}'
                GROUP BY Region, store_number
                ORDER BY totalVisits DESC;
                `);
                const mostVisitedStore = Visits.recordset.map((record) => ({
                region: record.Region,
                storeNumber: record.store_number,
                totalVisits: record.totalVisits
                }));
            //grab least visits
            const leastVisits = await sql.query(`
                SELECT region, store_number, COUNT(*) AS totalVisits
                FROM [User_Activity]
                WHERE [date] = '${date}'
                GROUP BY region, store_number
                ORDER BY totalVisits ASC;
                `);
                const leastVisitedStores = leastVisits.recordset.map((record) => ({
                region: record.region,
                storeNumber: record.store_number,
                totalVisits: record.totalVisits
                }));
            //push the the days figures into the daily figures array. 
            dailyFigures.push({
                date: date,
                visits: visits,
                tests: testsTaken,
                averageScore: averageScore,
                mostVisits: mostVisitedStore,
                leastVisits: leastVisitedStores,
            });
        }
        res.status(200).send({ message: "Retrieved", dailyFigures });
        } catch (error) {
            console.log(error);
            res.status(500).send({ error: "An error occurred" });
    }
});
app.post("/fetchAvailableStores", async (req, res) =>{
    console.log("selectAvailableStores route taken")
    const data = req.body;
    try {
        await sql.connect(config);
        const response = await sql.query(`SELECT DISTINCT [store_number] FROM [User_Activity] WHERE [Region] = '${data.region}' ORDER BY [store_number] ASC`)
        const stores = response.recordset
        if(stores.length > 0) {
            res.status(200).send(stores);
        } else {
            res.status(200).send({body: "No Regions found. Please refresh or contact the administrator."})
        }
    } catch (error) {
        console.log(error);
        console.log("Failure to connect to database")
        res.status(500).send("Error retrieving data from the database.");
    }
    
})
app.post("/fetchUniqueStoreData", async (req, res) =>{
    console.log("fetchUniqueStoreData route taken")
    //retrieve the data
    const data = req.body;
    console.log(data)
    const dateFrom = data.time.dateFrom
    const dateTo = data.time.dateTo
    //retrieve the data
    try {
        await sql.connect(config);
        console.log("connected")
        ///grab dailyVisits
        const response = await sql.query(
            `SELECT COUNT(*) AS totalCount 
            FROM [User_Activity] 
            WHERE [date] >= '${dateFrom}'
            AND [date] <= '${dateTo}'
            AND [store_number] = '${data.store}'
            AND [region] = '${data.region}'
            `)
        const visits = response.recordset[0].totalCount;
        /// grab dailyTests
        const tests = await sql.query(`
            SELECT COUNT(*) AS totalCount
            FROM [Test-Results-Data]
            WHERE [date] >= '${dateFrom}'
            AND [date] <= '${dateTo}'
            AND [storeNumber] = '${data.store}'
            AND [region] = '${data.region}'
            `);
        const testsTaken = tests.recordset[0].totalCount;

        /// grab daily percentage
        const percentage = await sql.query(
            `SELECT AVG(percentage) AS averagePercentage 
            FROM [Test-Results-Data] 
            WHERE [date] >= '${dateFrom}'
            AND [date] <= '${dateTo}'
            AND [storeNumber] = '${data.store}'
            AND [region] = '${data.region}'
            `)
        const averageScore = percentage.recordset[0].averagePercentage;
        //grab daily Produce Percentage
        
        const producePercentage = await sql.query(
            `SELECT AVG(percentage) AS averagePercentage 
            FROM [Test-Results-Data] 
            WHERE [date] >= '${dateFrom}'
            AND [date] <= '${dateTo}'
            AND [storeNumber] = '${data.store}'
            AND [region] = '${data.region}'
            AND [department] = 'Produce'
            `)
        const produceScore = producePercentage.recordset[0].averagePercentage;
        //grab daily bakery Percentage
        
        const bakeryPercentage = await sql.query(
            `SELECT AVG(percentage) AS averagePercentage 
            FROM [Test-Results-Data] 
            WHERE [date] >= '${dateFrom}'
            AND [date] <= '${dateTo}'
            AND [storeNumber] = '${data.store}'
            AND [region] = '${data.region}'
            AND [department] = 'Bakery'
            `)
        const bakeryScore = bakeryPercentage.recordset[0].averagePercentage;
        //grab all tests from the period to display on user activity
        const userActivity = await sql.query(`
            SELECT *
            FROM [Test-Results-Data]
            WHERE [date] >= '${dateFrom}'
            AND [date] <= '${dateTo}'
            AND [storeNumber] = '${data.store}'
            AND [region] = '${data.region}'
            `);
        const userLog = userActivity.recordset.reverse();
        console.log(userLog)

        /// Send response back to client
        let userData = userLog;
        let clientResponse = {
            visits: visits,
            tests: testsTaken,
            percentage: averageScore,
            producePercentage: produceScore,
            bakeryPercentage:bakeryScore 
        }

        //flip the dates around so they are not in yyyy/mm/dd
        const dateFromFormatted = data.time.dateFrom.split('/').reverse().join('/');
        const dateToFormatted = data.time.dateTo.split('/').reverse().join('/'); 
        let reportInfo = {
            region: data.region,
            storeNumber: data.store,
            dateRange: {dateFrom: dateFromFormatted, dateTo: dateToFormatted}
        }
        console.log(clientResponse)
        res.status(200).send({data: clientResponse, storeInfo: reportInfo, userActivity: userData}
            )
    } catch(error) {
        console.log(error);
        res.status(500).send({ error: "An error occurred" })
    }


    
    
})
/*****************Functions for Login*************************** */
app.post("/adminlogin", async (req, res) => {
    console.log("adminlogin Route Taken")
    const {username,password} = req.body;
    const connection = await sql.connect(config);
    const response = await sql.query(`SELECT * FROM [Admins] WHERE [Username] = '${username}'`)
if(response.rowsAffected > 0) {
    const adminPasswordHash = response.recordset[0].Password;

            bcrypt.compare(password,adminPasswordHash, (err,results)=> {
                if(err) {
                    console.log(error)
                    res.status(500).send({message:"Error validating password."})
                } else if(results){
                    console.log(results);
                    res.status(200).send({message:"Passwords match. User logged in.", user: response.recordset})
        
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
    console.log("Register route Taken")
    const {Authkey,username,password, store_number,adminLevel} = req.body;
    console.log(Authkey,username,password,store_number,adminLevel)
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
    if (result.recordset && result.recordset.length > 0) {
        const admin = result.recordset[0];
        if(Authkey === admin.Authkey) {
            try{
                const response= await sql.query(`INSERT INTO [Admins] (store_number,Username,Password,adminLevel) VALUES (${store_number},'${username}','${hashedPassword}','${adminLevel}')`);
                console.log(response.rowsAffected)
                res.status(200).send({message: "Administrator successfully registered.", response: response.rowsAffected})
            } catch(error){
                console.log(error)
            }
        } else {
            res.status(404).send({message: "Authorisation key invalid. Please enter a valid Authorisation Key."})
        } 
    } else {
        res.status(404).send({message: "Authorisation key invalid. Please enter a valid Authorisation Key."})
    } 
});



// declares port and starts listening on that port.   
const ip = "192.168.1.81";
const ipLive ="209.141.50.150"
// app.listen(PORT, ()=> {
//     console.log("data post is running app running", PORT)
// });

// Configure SSL certificate and private key paths
const privateKeyPath = 'certificates/private.key';
const certificatePath = 'certificates/certificate.crt';

// Read the SSL certificate and private key files
const privateKey = fs.readFileSync(privateKeyPath, 'utf8');
const certificate = fs.readFileSync(certificatePath, 'utf8');

// Create the HTTPS server with SSL options
const server = https.createServer({
  key: privateKey,
  cert: certificate
}, app);

// Start the HTTPS server
server.listen(PORT, () => {
  console.log("HTTPS server is running on port", PORT);
});
