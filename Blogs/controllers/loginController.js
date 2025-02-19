const userLogin=require('../models/userLogin');
const mongoose=require('mongoose');
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
    console.log(user);
    const newUser = new userLogin(user);
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
}

// exports.loginUser=async(req,res)=>{
//     console.log("Login API is called...");
//     const {email,password}=req.body;
//     console.log(`email:${email}`);
//     console.log(`password:${password}`);
//     try{
//         const user=await userLogin.findOne({email:email});
//         if(user.password===password){
//             res.status(200).json(user);
//         }
//         else{
//             res.status(400).json({message:"Invalid Credentials"});
//         }
//     }
//     catch(err){
//         res.status(500).json({message:err});
//     }
// };

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