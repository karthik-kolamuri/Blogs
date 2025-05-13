const userLogin=require('../models/userLogin');
const mongoose=require('mongoose');
const bcrypt=require("bcryptjs");
const crypto=require('crypto')
const pug=require('pug')

const nodemailer=require('nodemailer')
const sendgridTransport=require('nodemailer-sendgrid-transport');
// const ObjectId=new mongoose.Types.ObjectId();

const transporter=nodemailer.createTransport(sendgridTransport({
    auth:{
      api_key:process.env.SENDGRID_API_KEY
    }
  })) 


// home page
exports.homePage=async (req,res)=>{
    res.render('./login/home');
};

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
    await res.render('./login/register');     
}

// register a user
exports.registerUser = async (req, res) => {
    console.log(" POST Register API is called...");
    try {
        const user = req.body;
        const hashPassword = bcrypt.hashSync(user.password, 10);
        console.log(user);
        console.log(hashPassword);

        const newUser = new userLogin({
            username: user.username,
            email: user.email,
            password: hashPassword
        });

        await newUser.save();
        req.session.personalDetails = user;
        console.log(req.session.cookie);
        console.log("User Registered Successfully...");
        transporter.sendMail({
            to: user.email,
            from: "karthik.kolamuri@sasi.ac.in",
            subject: "SignUp success... ",
            html: `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><title>Welcome to Blog Application</title><style>body{font-family:Arial,sans-serif;background-color:#f4f4f4;margin:0;padding:0}.container{max-width:600px;margin:0 auto;background-color:#ffffff;padding:20px;border-radius:10px;box-shadow:0 2px 5px rgba(0,0,0,0.1)}.header{background-color:#007bff;color:#ffffff;padding:10px 20px;border-radius:10px 10px 0 0;text-align:center}.content{padding:20px}.content h1{color:#333}.content p{color:#666;line-height:1.6}.footer{background-color:#007bff;color:#ffffff;padding:10px 20px;border-radius:0 0 10px 10px;text-align:center}.button{display:inline-block;padding:10px 20px;margin-top:20px;background-color:#007bff;color:#ffffff;text-decoration:none;border-radius:5px}.button:hover{background-color:#0056b3}</style></head><body><div class="container"><div class="header"><h1>Welcome to Blog Application</h1></div><div class="content"><h1>Signup Success</h1><p>Dear ${user.username},</p><p>Thank you for signing up for the Blog Application. We are excited to have you on board!</p><p>You can now log in to your account and start creating and reading amazing blog posts.</p><a href="http://localhost:8080/api/user/login" class="button">Log In</a></div><div class="footer"><p>&copy; 2025 Blog Application. All rights reserved.</p></div></div></body></html>`
        });
        console.log("Register Email sent successfully...");
        
        res.redirect('/api/user/login');
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ error: err.message });
    }
}


exports.userLogin=async(req,res)=>{
    console.log("Login Page is called");
    res.render('./login/login');
}

exports.loginUser=async(req,res)=>{
    console.log("POST Login API is called .... ");
    const user=req.body;
    console.log(user);
    try{
        console.log("In try block...");
        
        const userCred=await userLogin.findOne({email:user.email});
        if(userCred){
            console.log(userCred);
            const passwordCheck=await bcrypt.compare(user.password,userCred.password);
            if(passwordCheck){
                console.log("User login successfully...");
                req.session.isLoggedin=true;
                req.session.userCredientials=userCred;
                res.redirect('/api/blog/blogs');
            }else{
                res.status(404).json({message:"User Login Failed,Please Enter the correct credentials..."});
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


exports.logoutUser=async(req,res)=>{
    console.log("Logout User API is called...");
    try{
        // //req.logout();
        req.session.destroy();
        console.log("session is destroyed...");
        
        res.redirect('/api/user/login');
    }
    catch(err){
        res.status(500).json({message:err});
    }
}

exports.getResetPassword=async(req,res)=>{
    console.log("Get Reset Password API is called...");
    res.render('./login/resetPass')
}

exports.postResetPassword = async (req, res) => {
    console.log("Post Reset Password API is called...");
    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                console.log(err);
                return res.redirect('/api/user/reset-password');
            }
            const token = buffer.toString('hex');
            console.log(token);
            const email = req.body.email;
            const user = await userLogin.findOne({ email: email });
            if (!user) {
                console.log("User Email is not found");
                return res.redirect('/api/user/reset-password');
            }
            user.resetToken = token;
            user.resetTokenExpiration = Date.now() + 3600000; // 1 hour
            await user.save();

            transporter.sendMail({
                to: user.email,
                from: "karthik.kolamuri@sasi.ac.in",
                subject: "Reset Password",
                html: pug.renderFile('views/email-template/reset-pass.pug',{
                    name: user.name,
                    resetToken: token
                })
            });

            res.redirect('/api/user/login');
        });
    } catch (err) {
        console.error("Error:", err);
        res.status(500).json({ message: err.message });
    }
};

exports.getNewPassword=async(req,res)=>{
    console.log("New Password API is called...");
    console.log(req.params.token)
    res.render('./login/newPassword',{
        token:req.params.token
    })

}


exports.postNewPassword = async (req, res) => {
    console.log("Post New Password API is called...");
    try {
        const { password, confirmPassword } = req.body;
        const resetToken = req.body.token;

        console.log("Received Reset Token:", resetToken);

        const user = await userLogin.findOne({
            resetToken: resetToken,
            resetTokenExpiration: { $gt: Date.now() }
        });

        if (!user) {
            console.log("User not found or token expired");
            return res.status(400).json({ error: "Invalid or expired token" });
        }

        console.log("User found:", user.email);

        if (password !== confirmPassword) {
            console.log("Password and Confirm Password do not match.");
            return res.status(400).json({ error: "Passwords do not match." });
        }

        // Hash the new password before saving
        console.log(password);
        
        const hashPassword = await bcrypt.hash(password, 10);
        user.password = hashPassword;
        user.resetToken = null;
        user.resetTokenExpiration = null;

        try {
            await user.save();
            console.log("Password successfully updated.");
            return res.redirect('/api/user/login')
        } catch (saveError) {
            console.error("Error saving user:", saveError);
            return res.status(500).json({ error: "Error updating password. Try again." });
        }
        
    } catch (err) {
        console.error("Unexpected Error:", err);
        res.status(500).json({ error: "Internal Server Error." });
    }
};