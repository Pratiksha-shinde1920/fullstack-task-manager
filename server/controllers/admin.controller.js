const Task = require("../models/Task")
const User = require("../models/User")

exports.getAllEmployees = async (req, res) => {
    try {
        const result = await User.find({ role: "employee" }).select("name email mobile role active isDelete")
        res.status(200).json({ message: " fetch all employee" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to fetch all employee" })
    }
}
exports.updateEmployees = async (req, res) => {
    try {
        const { eid } = req.params
        const obj = {}
        const { name, email, mobile } = req.body
        if (name) {
            obj = { ...obj, name: name }
        }
        if (email) {
            obj = { ...obj, email }
        }
        if (mobile) {
            obj = { ...obj, mobile }
        }
        if (obj.name || obj.email || obj.mobile) {

            await User.findByIdAndUpdate(eid, obj, { runValidators: true })
        }
        res.status(200).json({ message: "  employee update" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to update  employee" })
    }
}
exports.toggleEmployees = async (req, res) => {
    try {
        const { status } = req.body
        if (typeof status !== "boolean") {
            return res.status(400).json({ message: "status is required" })
        }
        const { eid } = req.params
        await User.findByIdAndUpdate(eid, { active: status }, { runValidators: true })
        res.status(200).json({ message: "  employee status update" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to status update  employee" })
    }
}
exports.deleteEmployees = async (req, res) => {
    try {
        const { eid } = req.params
        await User.findByIdAndUpdate(eid, { isDelete: true }, { runValidators: true })
        res.status(200).json({ message: "  employee dalete success" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to delete   employee" })
    }
}
exports.restoreEmployees = async (req, res) => {
    try {
        const { eid } = req.params
        await User.findByIdAndUpdate(eid, { isDelete: true }, { runValidators: true })
        res.status(200).json({ message: "  employee restore success" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to restore   employee" })
    }
}
exports.permanantDeleteEmployees = async (req, res) => {
    try {
        const { eid } = req.params
        await User.findByIdAndDelete(eid, { isDelete: true }, { runValidators: true })
        res.status(200).json({ message: "  employee permanant Delete success" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to permanant Delete   employee" })
    }
}
exports.createTask = async (req, res) => {
    try {
        const { task, desc, priority, employee, due } = req.body
        if (!task || !desc || !priority || !employee || !due) {
            return res.status(400).json({ message: "all fields require" })
        }
        await Task.create({ task, desc, priority, employee, due })
        res.status(200).json({ message: "  Task create success" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to create task" })
    }
}
exports.readTask = async (req, res) => {
    try {
        const result = await Task.find()
        res.status(200).json({ message: "  Task read success", result })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to read task" })
    }
}
exports.updateTask = async (req, res) => {
    try {
        const { tid } = req.params
        const { task, desc, priority, employee, due } = req.body
        const obj = {}
        if (task) {
            obj.task = task
        }
        if (desc) {
            obj.desc = desc
        }
        if (priority) {
            obj.priority = priority
        }
        if (employee) {
            obj.employee = employee
        }
        if (due) {
            obj.due = due
        }
        await Task.findByIdAndUpdate(tid, obj, { runValidators: true })
        res.status(200).json({ message: "  Task update success" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to update task" })
    }
}
exports.deleteTask = async (req, res) => {
    try {
        const { tid } = req.params
        await Task.findByIdAndDelete(tid)
        res.status(200).json({ message: "  Task permanant delete success" })

    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to delete task" })
    }
}