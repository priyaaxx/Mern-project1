const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require("../middlewares/authMiddleware");

// New user registration
router.post('/register', async (req, res) => {
    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).send({
                success: false,
                message: "User already exists",
            });
        }

        // Create new user - hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Map request body fields to schema fields
        const newUser = new User({
            name: req.body.fullName, // Ensure this field matches
            phone: req.body.phoneNumber, // Ensure this field matches
            email: req.body.email,
            password: hashedPassword,
        });

        // Save new user
        await newUser.save();
        res.status(201).send({
            success: true,
            message: "User created successfully",
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

// User login
router.post('/login', async (req, res) => {
    try {
        // Check if user exists
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(400).send({
                success: false,
                message: "User not found",
            });
        }

        //if user is blocked
        if(user.status !== "active"){
            throw new Error("The user account is blocked, please contact the admin");
        }

        // Compare password
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(400).send({
                success: false,
                message: "Invalid password",
            });
        }

        // Create and assign token
        const token = jwt.sign({ userId: user._id }, process.env.jwt_secret);

        // Send response
        res.status(200).send({
            success: true,
            message: "User logged in successfully",
            data: token,
        });
    } catch (error) {
        res.status(500).send({
            success: false,
            message: error.message,
        });
    }
});

//get current user
router.get("/get-current-user",authMiddleware, async(req,res)=>{
    try{
        const user = await User.findById(req.body.userId);
        res.send({
            success: true,
            message: "User fetched successfully",
            data: user,
        });
    } catch(error){
        res.send({
            success: false,
            message: error.message,
        });
    }
})

//get all users
router.get("/get-users",authMiddleware, async(req,res)=>{
    try{
        const users = await User.find();
        res.send({
            success: true,
            message: "users fetched successfully",
            data: users,
        });
    } catch(error){
        res.send({
            success: false,
            message: error.message,
        });
    }
});

//update user status
router.put("/update-user-status/:id", authMiddleware, async(req, res)=>{
    try{
        await User.findByIdAndUpdate(req.params.id, req.body);
        res.send({
            success: true,
            message: "User status updated successfully",
        });
    }catch(error){
        res.send({
            success: false,
            message: error.message,
        });
    }
});



module.exports = router;
