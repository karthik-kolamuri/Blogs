const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose")
dotEnv.config()
// const User = require("./models/user_login")
const loginRoutes = require("./routes/loginRoutes")

app.use(express.json())   // to parse the incoming request with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        console.log("Data Base is connected... ");
        // console.log(result);
       
    })
    .catch(err => console.log(err))
    
app.use("/api/user", loginRoutes)
const PORT =  8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)    
})