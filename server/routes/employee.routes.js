// const { signin, registerEmployee, signout, sendOTP, verifyOTP, forgetPassword, changePassword } = require("../controllers/auth.controller")
const { getAllTodo, toggleTodoStatus, getProfile, updateProfile } = require("../controllers/employee.controller")
// const { adminProtect } = require("../middlewares/auth.middlewares")


const router = require("express").Router()

router
    .get("/todos", getAllTodo)
    .put("/todo-update/:tid", toggleTodoStatus)
    .get("/profile", getProfile)
    .put("/profile-update", updateProfile)


module.exports = router