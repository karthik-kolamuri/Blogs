const userLogin=require('../models/userLogin');


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

// register a user
exports.registerUser= (req, res) => {
    console.log("Register API is called...");
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

exports.loginUser=async(req,res)=>{
    console.log("Login API is called...");
    const {email,password}=req.body;
    console.log(`email:${email}`);
    console.log(`password:${password}`);
    try{
        const user=await userLogin.findOne({email:email});
        if(user.password===password){
            res.status(200).json(user);
        }
        else{
            res.status(400).json({message:"Invalid Credentials"});
        }
    }
    catch(err){
        res.status(500).json({message:err});
    }
};

exports.getUserById=async(req,res)=>{
    console.log("Get User By Id API is called...");
    const id=req.params.id;
    console.log(`id:${id}`);
    try{
        const user=await userLogin.findById(id);
        res.status(200).json(user);
    }
    catch(err){
        res.status(500).json({message:err});
    }
}

exports.updateUser=async(req,res)=>{
    console.log("Update User API is called...");
    const id=req.params.id;
    console.log(`id:${id}`);
    const user=req.body;
    console.log(user);
    try{
        await userLogin.findByIdAndUpdate(id,user);
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