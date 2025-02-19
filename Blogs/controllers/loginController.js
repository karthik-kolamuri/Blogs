const userLogin=require('../models/userLogin');
const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");

// const ObjectId=new mongoose.Types.ObjectId();


// get all users
exports.getUsers=async(req,res)=>{
    try{
        const users=await userLogin.find();
        console.log("In Login Page...");
        res.status(200).json(users);
    }catch(err){
        res.status(500).json({message:err});
    }
};

exports.registerUserPage=async(req,res)=>{
    console.log("Register Page is called...");
    await res.render('register');     
}

// register a user
exports.registerUser= (req, res) => {
    console.log(" POST Register API is called...");
    const user = req.body;
    const hashPassword = bcrypt.hashSync(user.password, 10);
    console.log(user);
    console.log(hashPassword);
    
    const newUser = new userLogin({
        username: user.username,
        email: user.email,
        password: hashPassword
    });
    newUser.save()
    .then(() => {
    req.session.personalDetails=user;
    console.log(req.session.cookie);
    console.log("User Registered Successfully...");
        res.redirect('/api/user/login');
    })
    .catch(err => {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    });
}

exports.userLogin=async(req,res)=>{
    console.log("Login Page is called");
    res.render('login');
}

exports.loginUser=async(req,res)=>{
    console.log("POST Login API is called .... ");
    const user=req.body;
    console.log(user);
    try{
        console.log("In try block...");
        
        const userCred=await userLogin.findOne({email:user.email});
        if(userCred){
            const passwordCheck=bcrypt.compare(user.password,userCred.password);
            if(passwordCheck){
                console.log("User login successfully...");
                req.session.userCredientials=userCred;
                
                res.status(200).json({message:"User Login Successfully..."});
            }
               
        }
        else{
            console.log("User login failed...");
            // window.alert("Enter correct User Credentials...")
            res.status(404).json({message:"User Login Failed..."});
            
        }
    }
    catch(err){
        res.status(500).json({message:"server error"})
    }
};

exports.getUserById=async(req,res)=>{
    console.log("Get User By Id API is called...");
    const id=req.params.id;
    console.log(`id:${id}`);
    try{
        console.log("Validating User...");
        
        if (!mongoose.Types.ObjectId.isValid(id)) {
            console.log("Invalid User...");
            return res.status(400).json({message: "Invalid User ID"});
        }
        console.log("Valid User...");
        
        const user=await userLogin.findById(id);
        if(!user){
            res.status(404).json({message:"User Not Found"});
        } else {
            res.status(200).json({"user":user});
        }
    }
    catch(err){
        res.status(500).json({message:err});
    }
}

exports.updateUser=async(req,res)=>{
    console.log("Update User API is called...");
    const id=req.params.id;
    console.log(`id:${id}`);

    try{
        if(!mongoose.Types.ObjectId.isValid(id)){
            res.status(400).json({"message":"Not  a vaid User...l"})
        }
        console.log("Valid User.... ");
        const user=req.body;
        console.log(user);
        await userLogin.findByIdAndUpdate(id,{$set:user},{new:true,runValidators:true});
        res.status(200).json({message:"User Updated"});
    }
    catch(err){
        res.status(500).json({message:err});
    }
}

exports.deleteUser=async(req,res)=>{
    console.log("Delete User API is called...");
    const id=req.params.id;
    console.log(`id:${id}`);
    try{
        await userLogin.findByIdAndDelete(id);
        res.status(200).json({message:"User Deleted"});
    }
    catch(err){
        res.status(500).json({message:err});
    }
}