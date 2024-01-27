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
module.exports = {register}