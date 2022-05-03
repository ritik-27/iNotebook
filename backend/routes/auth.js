const express = require('express')
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator'); //For validating email, password(length of password)
const bcrypt = require('bcryptjs');  //For generating hashpasswords
const jwt = require('jsonwebtoken');
const JWT_SECRET = "XYZisasecret";
const fetchuser = require('../middleware/fetchuser');


// Route 1 : Create a User using: POST "/api/auth/createuser". (No login require**)
router.post('/createuser', [
    //Validating name,email and password field.
    body('name', "Invalid Name, Enter a valid Name").isLength({ min: 3 }),
    body('email', "Invalid Email, Enter a valid Email").isEmail(),
    body('password', "Password must be atleast 5 character").isLength({ min: 5 })
], async (req, res) => {
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        //Checking wether the user with same email already exists
        let user = await User.findOne({ email: req.body.email }); //Note here this is promise so using here await keyword
        if (user) {
            return res.status(400).json({ error: 'Sorry user with this email already exists' })
        }
        //Generating salt for the password
        const salt = await bcrypt.genSalt(10);
        // console.log(user);
        
        user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: await bcrypt.hash(req.body.password, salt),
        })
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json({ authtoken })
        // console.log(authtoken);
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// Route 2 :Authenticating a User using: POST "/api/auth/login". (No Login require**)
router.post('/login', [
    body('email', "Invalid Email, Enter a valid Email").isEmail(),
    body('password', "Password cannot be blank").exists()
], async (req,res) => {
    //If there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const {email,password}=req.body //destructuring email and password(req.body mai se, user ne jo email aur password daala hai usko bahar nikalna hai aur object ke form mai store kr lena hai)
    try {
        //Comparing (matching) Email with database here
        let user=await User.findOne({email}); //Comparing Email
        if (!user) {
            return res.status(400).json({ error: "Login Failed : Please try to login with correct credentials"});
        }

        //Comparing Password here
        const passwordCompare= await bcrypt.compare(password,user.password)
        if(!passwordCompare){
            return res.status(400).json({ error: "Login Failed : Please try to login with correct credentials" });
        }

        //Generating Authtoken again after every login (copying the step from above)
        const data = {
            user: {
                id: user.id
            }
        }
        const authtoken = jwt.sign(data, JWT_SECRET)
        res.json({ authtoken })
    }catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

// Route 3 :Get logged in user details using: POST "/api/auth/getuser". (Login require***)
router.post('/getuser',fetchuser, async(req, res)=>{
    try {
        const userId=req.user.id;  //fetched user id from token
        const user=await User.findById(userId).select("-password")  // here we finding user details from fetched uder id and also we are excluding password field to be fetched
        res.send(user)
    } catch (error) {
        console.error(error.message)
        res.status(500).send("Internal Server Error")
    }
})

module.exports = router