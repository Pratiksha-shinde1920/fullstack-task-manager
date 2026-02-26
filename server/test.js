const crypto = require("crypto")
const pass = crypto.randomBytes(10).toString("hex")
console.log(pass);
