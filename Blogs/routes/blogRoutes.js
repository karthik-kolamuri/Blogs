const express=require("express");
const router=express.Router();
const {auth}=require("../middleware/auth")

const blogController=require("../controllers/blogController");
router.get("/add-blog",auth,blogController.addBlog);
router.post("/add-blog",auth ,blogController.createBlog);
router.get("/blogs",blogController.getAllBlogs);
router.get("/blogs/:id",blogController.getBlogById);
router.put("/blogs/:id",auth ,blogController.updateBlog);
router.delete("/blogs/:id",auth,blogController.deleteBlog);
module.exports=router;