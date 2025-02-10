const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const mongoose = require("mongoose")
dotEnv.config()
const User = require("./models/user_login")


app.use(express.json())   // to parse the incoming request with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }))


mongoose.connect(process.env.MONGO_URI)
    .then(result => {
        console.log("Data Base is connected... ");
        // console.log(result);
       
    })
    .catch(err => console.log(err))
app.get("/", (req, res) => {
    console.log("Welcome to Login Page");
    res.send("Welcome to Login Page")
})

app.post("/register", (req, res) => {
    console.log("Register API is called...");
    const user = req.body;
    console.log(user);
    const newUser = new User(user);
    newUser.save()
    .then(() => {
        res.status(201).json({
            message: "Successfully added"
        });
    })
    .catch(err => {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    });
})
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on PORT: ${PORT}`)    
})