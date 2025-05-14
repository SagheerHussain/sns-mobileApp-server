const Role = require("../models/Role.model");

/* ---------------- GET ------------------ */
const getRolesList = async (req, res) => {
  try {
    const roles = await Role.find().lean();
    if (roles.length === 0) {
      return res.status(200).json({ message: "No roles found", success: true });
    }
    return res.status(200).json({ success: true, data: roles, message: "Roles retrieved successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getRole = async (req, res) => {
  try {
    const { id } = req.params;
    const role = await Role.findById({ _id: id }).lean();
    if (!role) {
      return res.status(404).json({ message: "Role not found", success: false });
    }
    return res.status(200).json({ success: true, data: role, message: "Role retrieved successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ---------------- POST ------------------ */
const addRole = async (req, res) => {
  try {
    const { name, permissions } = req.body;
    const roleExists = await Role.findOne({ name }).lean();

    if (roleExists) {
      return res.status(409).json({ message: "Role already exists", success: false });
    }

    const newRole = await Role.create({ name, permissions });

    return res.status(200).json({ success: true, data: newRole, message: "Role created successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ---------------- PUT ------------------ */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, permissions } = req.body;
    const updated = await Role.findByIdAndUpdate(
      { _id: id },
      { name, permissions },
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Role not found", success: false });
    }

    return res.status(200).json({ success: true, data: updated, message: "Role updated successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ---------------- DELETE ------------------ */
const deleteRole = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Role.findByIdAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({ message: "Role not found", success: false });
    }

    return res.status(200).json({ success: true, data: deleted, message: "Role deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = { addRole, getRolesList, getRole, updateRole, deleteRole };
