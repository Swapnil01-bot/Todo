let {User} = require("../schema/user");
let joi = require("joi");
let bcrypt = require("bcrypt");
let security = require("../helper/security")

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
    // User data validation
    let check = await validateLogin(params).catch((error)=>{return{error}})
    if (!check || (check && check.error)) {
        return {error:check.error,status:400};
    }
    // Check if email exist in DB
    let user = await User.findOne({where:{emailID:params.email}}).catch((error)=>{return{error}})
    // console.log("user",user);
    if (!user || (user && user.error)) {
        return {error:"User Not Found",status:404}
    }
    // Check if password match
    let compare = await bcrypt.compare(params.password,user.password).catch((error)=>{return{error}})
    if (!compare || (compare && compare.error)) {
        return {error:"User Email and password invalid",status:403}
    }
    // Generate Token
    let token = await security.signAsync({id:user.id}).catch((error)=>{return{error}})
    if (!token || (token && token.error)) {
        return {error:"Internal server error",status:500}
    }
    // Save token in db
    let update = await User.update({token},{where:{id:user.id}}).catch((error)=>{return{error}})
    // console.log("update",update);
    if (!update || (update && update.error)) {
        return{error:"user not login, please try again",status:500}
    }
    // Return token in json
    return{token};
}
async function validateLogin(params) {
    let schema = joi.object({
        email:joi.string().max(255).email().required(),
        password:joi.string().min(8).max(18).required()
    })
    let valid = await schema.validateAsync(params,{abortEarly:false}).catch((error)=>{return{error}})
    if (!valid || (valid && valid.error)) {
        let msg = [];
        for (const i of valid.error.details) {
            msg.push(i.message)
        }
        return{error:msg}
    }
    return{data:valid}
}
async function logout(params) {
    
}

module.exports = {register,validateRegister,login,logout};