const express =require("express");
const routes = require("./routes");

const app = express();


app.use("/api", routes);



const PORT = 3001;
app.set("port", PORT);

//Open Port and Listen
app.listen(PORT, ()=> {
    console.log("data post is running app running")
});
