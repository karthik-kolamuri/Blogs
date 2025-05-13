const mongoose = require("mongoose");
// const commentSchema=require("./Comment");
const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true,
        primaryKey: true
    },
    image: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    demoContent: {
        type: String,
        required: true,
        minlength: [10, "Demo content must be at least 10 characters long"],
        maxlength: [350, "Demo content must be at most 350 characters long"]
    },
    fullContent: {
        type: String,
        required: true,
        trim: false
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
    updatedAt: {
        type: Date,
        default: Date.now()
    },
    likes: {
        type: Number,
        required: true,
        default: 0
    }
});

module.exports = mongoose.model("Blog", blogSchema);