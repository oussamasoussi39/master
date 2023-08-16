const { login, logout, register, verifyEmail, forgetPassword, resetPassword } = require("../controllers/authControllers")
const authenticateUser = require("../middlewares/authentificateUser")

const router=require("express").Router()
router.post("/register",register)
router.post("/login",login)
router.delete("/logout",authenticateUser,logout)
router.post("/verify-email",verifyEmail)
router.post("/forget-password",forgetPassword)
router.post("/reset-password",resetPassword)





module.exports=router