const express = require("express");
const { register, authUser, allUsers } = require("../controllers/userControllers")
const { protect } = require("../middlewares/authMiddleware")
const router = express.Router();


router.post("/register", register);
router.post("/authUser", authUser);
router.get("/", protect, allUsers);




module.exports = router