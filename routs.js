let express = require("express");
let authController = require("./controller/auth");
let router = express.Router();

router.get("/",(req,res)=>{
    return res.send("welcome to todo");
})

router.post("/register",authController.register);
router.post("/login",authController.login);
router.post("/forgetPassword",authController.forgetPassword);

module.exports = router;