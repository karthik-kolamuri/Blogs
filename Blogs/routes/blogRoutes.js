const express=require("express");
const router=express.Router();

const blogController=require("../controllers/blogController");
router.get("/add-blog",blogController.addBlog);
router.post("/add-blog",blogController.createBlog);
router.get("/blogs",blogController.getAllBlogs);
router.get("/blogs/:id",blogController.getBlogById);
router.put("/blogs/:id",blogController.updateBlog);
router.delete("/blogs/:id",blogController.deleteBlog);
module.exports=router;