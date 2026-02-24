exports.signin = async (req, res) => {
    try {

        res.status(200).json({ message: "login success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to login" })

    }
}
exports.registerEmployee = async (req, res) => {
    try {

        res.status(200).json({ message: "register employee success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to register" })

    }
}
exports.signout = async (req, res) => {
    try {

        res.status(200).json({ message: "signout success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to signout employee" })

    }
}
exports.sendOTP = async (req, res) => {
    try {

        res.status(200).json({ message: "OTP send  success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to send OTP" })

    }
}
exports.verifyOTP = async (req, res) => {
    try {

        res.status(200).json({ message: "verifyOTP send  success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to verify OTP" })

    }
}
exports.forgetPassword = async (req, res) => {
    try {

        res.status(200).json({ message: "forgetpassword  success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to forgetpassword" })

    }
}
exports.changePassword = async (req, res) => {
    try {

        res.status(200).json({ message: "changepassword  success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to changepassword" })

    }
}