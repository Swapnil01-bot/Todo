let auth = require("../model/auth");

async function register(req,res) {
    let data = await auth.register(req.body).catch((error)=>{return{error}})
    console.log("data",data);
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status:500; 
        return res.status(status).send({error})
    }
    return res.send({data:data.data})
}
async function login(req,res) {
    let data = await auth.login(req.body).catch((error)=>{return{error}})
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status:500; 
        return res.status(status).send({error})
    }
    return res.header("token",data.token).send({status:"success"})
}
async function forgetPassword(req,res) {
    let data = await auth.forgetPassword(req.body).catch((error)=>{return{error}})
    if (!data || (data && data.error)) {
        let error = (data && data.error) ? data.error : "internal server error";
        let status = (data && data.status) ? data.status:500; 
        return res.status(status).send({error})
    }
    return res.send({status:"success"})
}
module.exports = {register,login,forgetPassword}