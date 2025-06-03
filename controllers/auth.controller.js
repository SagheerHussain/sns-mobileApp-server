const cloudinary = require("../cloudinary");
const User = require("../models/User.model");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/* ---------------- POST ------------------ */
const registerUser = async (req, res) => {
  try {
    const {
      fullname,
      username,
      email,
      password,
      phone_number,
      department,
      designation,
    } = req.body;
    let imgPath = "";

    const isExist = await User.findOne({ email }).lean();
    if (isExist) {
      return res
        .status(409)
        .json({ message: "User already exists", success: false });
    }

    if (
      !fullname ||
      !username ||
      !email ||
      !password ||
      !phone_number ||
      !department ||
      !designation
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    if (req.file) {
      imgPath = await cloudinary.uploader.upload(req.file.path);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullname,
      username,
      email,
      password: hashedPassword,
      phone_number,
      role: "682ae2e98e8f7a2c9f75c3d8",
      department,
      designation,
      profile_picture: imgPath ? imgPath.secure_url : "",
    });

    const sanitizedUser = {
      _id: newUser._id,
      fullname: newUser.fullname,
      username: newUser.username,
      email: newUser.email,
      profile_picture: newUser.profile_picture,
      role: newUser.role,
    };

    return res.status(200).json({
      message: "User registered successfully",
      success: true,
      data: sanitizedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).lean();
    if (!user) {
      return res
        .status(404)
        .json({ message: "A user with this email not found", success: false });
    }

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword) {
      return res
        .status(200)
        .json({ success: false, message: "Password is incorrect" });
    }

    const token = await jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role, // you’ll verify from DB anyway
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const populatedUser = await User.findById(user._id).populate("role").lean();

    const sanitizedUser = {
      _id: user._id,
      fullname: user.fullname,
      username: user.username,
      email: user.email,
      profile_picture: user.profile_picture,
      role: populatedUser.role,
      designation: user.designation,
      department: user.department,
      phone_number: user.phone_number,
      status: user.status,
    };

    return res.status(200).json({
      message: "User login successfully",
      success: true,
      token,
      data: sanitizedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

module.exports = { registerUser, loginUser };
