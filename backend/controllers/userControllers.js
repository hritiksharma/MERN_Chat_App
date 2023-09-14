const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");
const generateToken = require("../config/jsonwebtoken.js")

//  /api/user/register
const register = asyncHandler(async (req, res) => {
    const { name, email, password, pic } = req.body;
    console.log(name, email, password, pic);

    if (!name || !email || !password) {
        console.log("name and email required");
        res.status(400);
        throw new Error("name, email, password must required");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
        console.log("user allready exists");
        res.status(400);
        throw new Error("User allready exists");
    }

    const user = await User.create({ name, email, password, pic })

    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Failed to create User");
    }
})

//  /api/user/authUser
const authUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        console.log("name and email required");
        res.status(400);
        throw new Error("email, password must required");
    }

    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400);
        throw new Error("Invalid Credentials");
    }
})


//  /api/user?search=Hritik
const allUsers = asyncHandler(async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { email: { $regex: req.query.search, $options: "i" } },
        ],
    } : {};

    console.log("keywords", keyword);
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
    console.log(users);
    res.send(users);
})


module.exports = { register, authUser, allUsers }
