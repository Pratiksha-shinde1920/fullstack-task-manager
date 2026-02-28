// const { signin, registerEmployee, signout, sendOTP, verifyOTP, forgetPassword, changePassword } = require("../controllers/auth.controller")
const { adminProtect } = require("../middlewares/auth.middlewares")

const { getAllEmployees, updateEmployees, deleteEmployees, createTask, toggleEmployees, readTask, updateTask, deleteTask, restoreEmployees, permanantDeleteEmployees } = require("../controllers/admin.controller")
const router = require("express").Router()

router
    .get("/employee", getAllEmployees)
    .put("/update-employee/:eid", updateEmployees)
    .put("/toggle-employee-status/:eid", toggleEmployees)
    .delete("/delete-employee/:eid", deleteEmployees)
    .put("/restore-employee/:eid", restoreEmployees)
    .put("/remove-employee/:eid", permanantDeleteEmployees)


    .post("/todo-create", createTask)
    .get("/todo", readTask)
    .put("/todo/:tid", updateTask)
    .delete("/todo/:tid", deleteTask)

module.exports = router