const cloudinary = require("../cloudinary");
const User = require("../models/User.model");

/* ---------------- GET ------------------ */
const getUsersList = async (req, res) => {
  try {
    const users = await User.find()
      .populate("department designation role")
      .lean();
    if (users.length === 0) {
      return res
        .status(200)
        .json({ message: "There is no users right now.", success: true });
    }
    return res.status(200).json({
      message: "Users retrieved successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getSpecifiedUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "682ae2e98e8f7a2c9f75c3d8" })
      .populate("role")
      .select("fullname")
      .lean();
    if (users.length === 0) {
      return res
        .status(200)
        .json({ message: "There is no users right now.", success: true });
    }
    return res.status(200).json({
      message: "Users retrieved successfully",
      success: true,
      data: users,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email })
      .lean()
      .populate("department designation role");
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }
    const sanitizedUser = {
      _id: user._id,
      email: user.email,
      fullname: user.fullname,
      username: user.username,
      phone_number: user.phone_number,
      department: user.department.name,
      designation: user.designation.title,
      profile_picture: user.profile_picture,
      role: user.role,
    };
    return res.status(200).json({
      message: "User profile retrieved successfully",
      success: true,
      data: sanitizedUser,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ---------------- PUT ------------------ */
const updateProfile = async (req, res) => {
  try {
    const { fullname, username, email, phone_number, status, role, designation, department } = req.body;
    const user = await User.findOne({ email })
      .lean()
    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    let imgPath = "";
    if (req.file) {
        imgPath = await cloudinary.uploader.upload(req.file.path);
    }

    await User.findByIdAndUpdate(
      {_id: user._id},
      {
        fullname,
        username,
        email,
        phone_number,
        status,
        role,
        designation,
        department,
        profile_picture: imgPath ? imgPath.secure_url : user.profile_picture,
      },
      { new: true }
    ).lean();

    return res.status(200).json({
      message: "User profile updated successfully",
      success: true,
      data: user,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message, success: false });
  }
};

/* ---------------- DELETE ------------------ */
const deleteProfile = async (req, res) => {
    try {
        const { email } = req.params;
        const user = await User.findOne({ email }).lean();
        if (!user) {
           return res.status(404).json({ message: "User not found", success: false });
        }
        await User.findByIdAndDelete({ _id: user._id }).lean();
        return res.status(200).json({
            message: "User profile deleted successfully", success: true,
            data: user,
        });
    } catch (error) {
        return res.status(500).json({ message: error.message, success: false });
    }
};

module.exports = {
  getUserProfile,
  getUsersList,
  getSpecifiedUsers,
  updateProfile,
  deleteProfile
};
