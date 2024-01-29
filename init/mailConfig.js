let mailer = require("nodemailer");
let transport = mailer.createTransport({
    service:"gmail",
    port: 465,
    host:"smtp.gmail.com",
    secure:true,
    auth:{
        user:"swapnilp8313@gmail.com",
        pass:"ysdw kvqn txan nsku"
    }
})
module.exports = {transport}