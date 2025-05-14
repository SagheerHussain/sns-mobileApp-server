const User = require("../models/User.model");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const SECRET_KEY = process.env.JWT_KEY || "your_secret_key";

const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Unauthorized" });

    const decoded = await jwt.verify(token, SECRET_KEY);

    // Just get role only
    const user = await User.findOne({ email: decoded.email })
      .select("role")
      .populate("role");

    if (!user) return res.status(404).json({ message: "User not found" });

    req.userRole = user.role; // Only role, not full user
    next();
  } catch (err) {
    res.status(403).json({ message: "Token Expired" });
  }
};

const checkPermissions = (moduleName, actions) => {
  return (req, res, next) => {
    const { permissions } = req.userRole;

    const hasAccess = permissions.some((permission) => {
      return (
        permission.module === moduleName &&
        actions.includes(permission.action)
      );
    });

    if (!hasAccess) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

module.exports = { verifyToken, checkPermissions };
