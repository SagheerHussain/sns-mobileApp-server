const express = require("express");
const upload = require("../upload");

const router = express.Router();

const { registerUser, loginUser } = require("../controllers/auth.controller");

// POST
router.post("/register", upload.single("profile_picture"), registerUser);
router.post("/login", loginUser);

module.exports = router;
