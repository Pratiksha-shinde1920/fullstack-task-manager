const mongoose = require("mongoose")
module.exports = mongoose.model("user", new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, unique: true, trim: true },
    password: { type: String, required: true },
    mobile: { type: String, required: true },
    active: { type: Boolean, default: true },
    role: { type: String, enum: ["admin", "employee"], default: "employee" },
    profilePic: { type: String },
    otp: { type: String },
    otpSendOn: { type: Date },
    accessToken: { type: String },
    isDelete: { type: Boolean, default: false },

}, { timestamps: true }))