const { baseTemplate } = require("./baseTemplate")

exports.registerTemplate = ({ name, password }) => {
    const content = `
    <h2>Welcome to Skillhub</h2>
    <p>hi, ${name}</p>
    <div>Your Temprary password is <h1>${password}</h1></div>
    <p>Thank you for choosing Skillhub</p>
    `
    return baseTemplate({
        title: "welcome to skillhub",
        content
    })
}