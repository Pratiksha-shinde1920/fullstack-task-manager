const User = require("../models/User")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const { PRODUCTION, FRONTEND_URL } = require("../utils/config")
const crypto = require("crypto")
const { sendEmail } = require("../utils/email")
const { registerTemplate } = require("../email-templates/registerTemplate")
const { otpTemplate } = require("../email-templates/otpTemplate")
const { differenceInSeconds } = require("date-fns")
const { forgetPasswordTemplate } = require("../email-templates/forgetPasswordTemplate")
exports.signin = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(400).json({ message: "email and password are required" })
        }
        const result = await User.findOne({ email })
        if (!result) {

            res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "invalid credential"
                    : "email not found"
            })
        }
        if (!result.active) {
            return res.status(401).json({ message: "account block by admin" })
        }
        const verify = await bcrypt.compare(password, result.password)
        if (!verify) {
            res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "invalid credential"
                    : "invalid password"
            })
        }
        // token
        const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        res.cookie("TOKEN", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === PRODUCTION,
            maxAge: 1000 * 60 * 60 * 24
        })
        res.status(200).json({
            message: "login success", result: {
                name: result.name,
                email: result.email,
                mobile: result.mobile,
                profilePic: result.profilePic,
                _id: result._id,
                role: result.role,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to login" })

    }
}
exports.registerEmployee = async (req, res) => {
    try {
        // only admin register to employee
        const { name, email, mobile } = req.body
        if (!name || !email || !mobile) {

            return res.status(400).json({ message: "All fields required" })
        }
        const isFound = await User.findOne({ $or: [{ email }, { mobile }] })
        if (isFound) {
            return res.status(401).json({ message: "email/mobile already exist" })

        }
        const pass = crypto.randomBytes(8).toString("hex")
        const password = await bcrypt.hash(pass, 10)
        // send email to emp for password for register

        await sendEmail({
            email,
            subject: 'welcome to Task Manager',
            message: registerTemplate({ name, password: pass })
        })
        await User.create({ name, email, mobile, password, role: "employee" })
        res.status(200).json({ message: "register employee success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to register" })

    }
}
exports.signout = async (req, res) => {
    try {
        res.clearCookie("TOKEN")
        res.status(200).json({ message: "signout success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to signout employee" })

    }
}
exports.sendOTP = async (req, res) => {
    try {
        const { username } = req.body
        if (!username) {

            return res.status(200).json({ message: "email/mobile required" })
        }
        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
        if (!result) {
            return res.status(200).json({ message: "email/mobile not register with us" })

        }
        //create otp
        const otp = crypto.randomInt(100000, 1000000)
        // for hash otp                    
        const hashOTP = await bcrypt.hash(String(otp), 10)
        // add in database
        await User.findByIdAndUpdate(result._id, { otp: hashOTP, otpSendOn: new Date() })
        //send otp in email/sms/whasapp
        await sendEmail({
            email: result.email,
            subject: "Login OTP",
            message: otpTemplate({
                name: result.name,
                otp,
                sec: process.env.OTP_EXPIRY,
                min: process.env.OTP_EXPIRY / 60

            })
        })
        res.status(200).json({ message: "OTP send  success" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to send OTP" })

    }
}
exports.verifyOTP = async (req, res) => {
    try {
        const { username, otp } = req.body
        if (!username || !otp) {

            return res.status(400).json({ message: "email/mobile required" })
        }
        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
        if (!result) {
            return res.status(400).json({ message: "email/mobile not register with us" })

        }
        const verify = await bcrypt.compare(otp, String(result.otp))
        if (!verify) {
            return res.status(200).json({ message: "invalid otp" })
        }
        // npm i date-fns pakage 
        if (differenceInSeconds(new Date(), new Date(result.otpSendOn)) > process.env.OTP_EXPIRY) {
            await User.findByIdAndUpdate(result._id, { otp: null })
            res.status(200).json({ message: " OTP expired" })
        }
        const token = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "1d" })
        res.cookie("TOKEN", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === PRODUCTION,
            maxAge: 1000 * 60 * 60 * 24
        })
        res.status(200).json({
            message: "login success", result: {
                name: result.name,
                email: result.email,
                mobile: result.mobile,
                profilePic: result.profilePic,
                _id: result._id,
                role: result.role,
            }
        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to verify OTP" })

    }
}
exports.forgetPassword = async (req, res) => {
    try {
        const { username } = req.body
        if (!username) {

            return res.status(200).json({ message: "email/mobile required" })
        }
        const result = await User.findOne({ $or: [{ email: username }, { mobile: username }] })
        if (!result) {
            return res.status(200).json({ message: "email/mobile not register with us" })

        }
        const accessToken = jwt.sign({ _id: result._id }, process.env.JWT_KEY, { expiresIn: "15m" })
        await User.findByIdAndUpdate(result._id, { accessToken })
        const link = `${FRONTEND_URL}/forget-password/?token=${accessToken}`
        await sendEmail({
            email: result.email,
            subject: "Request for Change password",
            message: forgetPasswordTemplate({ name: result.name, resetLink: link })
        })

        res.status(200).json({ message: "forget password  successfully" })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to forget password" })

    }
}
exports.changePassword = async (req, res) => {
    try {
        const { token } = req.query
        const { password } = req.body
        if (!token) {
            return res.status(400).json({ message: "Token required" })

        }
        const result = await User.findOne({ accessToken: token })
        if (!result) {
            return res.status(400).json({ message: "Token not found" })

        }
        jwt.verify(token, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                console.log(err);
                await User.findByIdAndUpdate(result._id, { accessToken: null })
                return res.status(400).json({ message: "Invalid token" })

            }
            const hash = await bcrypt.hash(password, 10)
            await User.findByIdAndUpdate(result._id, { password: hash })
            res.status(200).json({ message: "change password  successfully" })

        })
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "unable to changepassword" })

    }
}