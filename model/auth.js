let {User} = require("../schema/user");
let joi = require("joi");
let bcrypt = require("bcrypt");

async function register(params) {
    //user data validation
    let check = await validateRegister(params).catch((error)=>{return{error}})
    if (!check || (check && check.error)) {
        return {error:check.error,status:400};
    }
    // check if user exist 
    let user = await User.findOne({where:{emailID:params.email}}).catch((error)=>{return{error}})
    if (user) {
        return {error:"user already exist",status:409};
    }
    // Hash Password
    let password = await bcrypt.hash(params.password,10).catch((error)=>{return{error}})
    if (!password || (password && password.error)) {
        return {error:"internal server error",status:500};
    }
    // Data format 
    let data = {
        name:params.username,
        emailID:params.email,
        password:password
    }
    // insert in database
    let insert = await User.create(data).catch((error)=>{return{error}})
    if (!insert || (insert && insert.error)) {
        return {error:"internal server error",status:500};
    }
    let response = {
        id:insert.id,
        username:insert.name,
        email:insert.emailID
    } 
    // Return response 
    return {data:response}
}
async function validateRegister(data) {
    let schema = joi.object({
        username:joi.string().min(2).max(155).required(),
        email:joi.string().email().max(255).required(),
        password:joi.string().min(8).max(16).required()
    }) 
    let valid = await schema.validateAsync(data,{abortEarly:false}).catch((error)=>{return{error}})
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (const i of valid.error.details) {
            msg.push(i.message);
        }
        return {error:msg}
    }
    return {data:valid};
}
async function login(params) {
    
}
async function logout(params) {
    
}

module.exports = {register,validateRegister,login,logout};