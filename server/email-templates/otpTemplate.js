const { baseTemplate } = require("./baseTemplate")

exports.otpTemplate = ({ name, otp, min, sec }) => {
    const content = `<h2>OTP</h2>
    <p>Hi,${name}</p>
    <p>Please use following OTP</p>
   <h1>${otp}</h1>
    <p>This OTP will expire in ${min} min (${sec} seconds) </p>
    <p>You did not Request this , please ignore this email </p>
    `
    return baseTemplate({
        title: "",
        content
    })
}

