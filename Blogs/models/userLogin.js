const mongoose=require("mongoose");
// const Comment=require("./Comment");
const userSchema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters long"]
    },
    resetToken:{
        type:String
    },
    resetTokenExpiration:{  
        type:Date
    },
    },
    {
        new:true,
        runValidators: true
    }
)
module.exports=mongoose.model("userLogin",userSchema)