const User = require("../models/User")
const { PRODUCTION } = require("../utils/config")
const jwt = require("jsonwebtoken")
exports.adminProtect = async (req, res, next) => {
    try {
        //check for cookie
        //                        cookie name from auth.controller.js
        const TOKEN = req.cookies.TOKEN
        if (!TOKEN) {
            return res.status(401).json({
                message: process.env.NODE_ENV === PRODUCTION
                    ? "unable to authenticate"
                    : "cookie not found"
            })
        }
        //validate token
        jwt.verify(TOKEN, process.env.JWT_KEY, async (err, decode) => {
            if (err) {
                return res.status(401).json({ message: "invalid token" })
            }
            const result = await User.findById(decode._id)
            if (!result) {

                return res.status(401).json({ message: "invalid Id" })
            }
            if (result.role !== "admin") {

                return res.status(403).json({ message: "not autheraized to access this route" })
            }
            req.user = decode._id // from auth.controller.js (signin)
            next()
        })

        //validate is admin or not


    } catch (error) {
        console.log(error);

        res.status(401).json({ message: "unable to authanticate" })
    }
}