let {transport} = require("../init/mailConfig");
let {forgetPassword} = require("../model/auth")
async function sendMail() {
    let send = await transport.sendMail({
        from: 'swapnilp8313@gmail.com', // sender address
        to: 'sayyedammu99@gmail.com', // list of receivers
        subject: 'Your OTP', // Subject line
        text: // plain text body
    }).catch((error)=>{return {error}})
    if (!send || (send && send.error)) {
        return {error:"internal server error",status:500}
    }
    return{data:send}
}
module.exports = {sendMail}