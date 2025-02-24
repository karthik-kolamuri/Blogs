const blogSchema=require("../models/Blog")
// const commentSchema=require("../models/Comment")


exports.addBlog=async(req,res)=>{
    console.log("Register Blog API is called...")
    res.render("./blogs/createBlog")
}
exports.createBlog=async(req,res)=>{
    console.log("POST Create Blog API is called...")
    const blog=req.body;
    console.log(blog);
    try{
        const newBlog=new blogSchema(blog);
        await newBlog.save().then(result=>{
            console.log("Blog Created Successfully...");
            res.redirect("/api/blog/blogs");
        }).catch(err=>{
            console.log(err);
            res.status(500).json({message:err});
        })
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:"server error occured"});
    }
}

exports.getAllBlogs=async(req,res)=>{
    console.log("Get All Blogs API is called...");
    try{
        const blogs=await blogSchema.find();
        console.log("Blogs are fetched...");
        res.render('./blogs/viewBlog',{blogs:blogs})
    }catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}


exports.getBlogById=async(req,res)=>{
    const id=req.params.id;
    console.log("Get Blog By Id API is called...");
    console.log(`id:${id}`);
    try{
        const blog=await  blogSchema.findById(id);
        console.log("Blog is fetched...");
        if(blog){
            res.render('./blogs/viewSingleBlog',{blog:blog});
        }
        else{
            res.status(404).json({message:"Blog not found..."});
        }
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}

exports.updateBlog=async(req,res)=>{
    const id=req.params.id;
    console.log("Update Blog API is called...");
    console.log(`id:${id}`);
    const blog=req.body;
    const blogs= await blogSchema.findByIdAndUpdate(id,blog);
    console.log(blogs);
    if(!blogs){
        res.status(404).json({message:"Blog not found..."});
    }
    res.status(200).json(blogs)
}

exports.deleteBlog=async(req,res)=>{
    const id=req.params.id;
    console.log("Delete Blog API is called...");
    console.log(`id:${id}`);
    try{
        const blog=await blogSchema.findByIdAndDelete(id);
        console.log("Blog is deleted...");
    }
    catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }
}