const express=require('express');
const router=express.Router();
const loginController=require('../controllers/loginController');
router.get("/",loginController.homePage);
router.get("/user/register",loginController.registerUserPage);
router.post("/user/register",loginController.registerUser);
router.get("/user/login",loginController.userLogin);
router.post("/user/login",loginController.loginUser);
// router.get("/user/:id",loginController.getUserById);
// router.get('/user/',loginController.getUsers);
// router.put("/user/:id",loginController.updateUser);
router.delete("/user/:id",loginController.deleteUser);
router.get("/user/logout",loginController.logoutUser);
router.get('/user/reset-password',loginController.getResetPassword)
router.post('/user/reset-password',loginController.postResetPassword)
router.get('/user/new-pass/:token',loginController.getNewPassword)
router.post('/user/new-pass/:token',loginController.postNewPassword)
module.exports=router;