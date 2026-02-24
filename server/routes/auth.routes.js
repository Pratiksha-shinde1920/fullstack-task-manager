const { signin, registerEmployee, signout, sendOTP, verifyOTP, forgetPassword, changePassword } = require("../controllers/auth.controller")


const router = require("express").Router()

router
    .post("/signin", signin)
    .post("/register-employee", registerEmployee)
    .post("/signout", signout)
    .post("/send-otp", sendOTP)
    .post("/verify-otp", verifyOTP)
    .post("/forget-password", forgetPassword)
    .post("/change-password", changePassword)

    module.exports = router