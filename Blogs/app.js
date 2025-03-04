const express = require("express");
const dotEnv = require("dotenv");
const bodyParser = require("body-parser");
const app = express();
const cors=require("cors")
const path = require("path");
const session=require("express-session");
const mongoDBStore=require("connect-mongodb-session")(session)
const mongoose = require("mongoose")
dotEnv.config();
// const User = require("./models/user_login")
const loginRoutes = require("./routes/loginRoutes");
const blogRoutes=require("./routes/blogRoutes");

app.use(express.json())   // to parse the incoming request with JSON payloads
app.use(bodyParser.urlencoded({ extended: true }))
app.set("view engine", "pug")
app.set("views", path.join(__dirname,"views"))

app.use(cors());
const PORT =  8080;
mongoose.connect(process.env.MONGO_URI)
    .then(async(result) => {
        // console.log(result);
        await app.listen(PORT, () => {
            console.log(`Server is running on PORT: ${PORT}`)    
        })
        console.log("Data Base is connected... ");
    })
    .catch(err => console.log(err))
    

const store=new mongoDBStore({
    uri:process.env.MONGO_URI,
    collection:"sessions"
})
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false,
    store:store
}))

//creating aa locals...
app.use(async(req,res,next)=>{
    res.locals.isLoggedin=req.session.isLoggedin
    res.locals.log=(res.locals.isLoggedin)?"Logout":"Login"
    console.log(res.locals.log)
    next()
    
})


//All middlewares 
app.use("/api", loginRoutes);
// app.use("/api/blog",async(req,res,next)=>{
//     if(await req.session.userCredientials){
//         next();
//     }
//     else{
//         console.log("To Access the blog the User has to Login");
//         res.redirect("/api/user/login");
//     }
// })
app.use("/api/blog",blogRoutes);

// app.get("/session/check",async(req,res)=>{
//     req.session.test="Test passed";
//     res.send(req.session.test);
// })