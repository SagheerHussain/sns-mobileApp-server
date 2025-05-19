const Department = require("../models/Department.model");
const slugify = require("slugify");

/* ---------------- GET ------------------ */
const getDepartmentsList = async (req, res) => {
  try {
    const departments = await Department.find();
    if (departments.length === 0) {
      return res
        .status(200)
        .json({ success: true, message: "No departments found" });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: departments,
        message: "Departments retrieved successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const getDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const department = await Department.findById({ _id: id });
    if (!department) {
      return res.status(404).json({ message: "Department not found", success: false });
    }
    return res.status(200).json({ success: true, data: department });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- POST ------------------ */
const addDepartment = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Name is required", success: false });
    }

    const exists = await Department.findOne({ name });
    if (exists) {
      return res.status(409).json({ message: "Department already exists", success: false });
    }

    const newDept = await Department.create({ name });
    return res
      .status(201)
      .json({
        success: true,
        data: newDept,
        message: "Department created successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- PUT ------------------ */
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const slug = slugify(name, { lower: true, strict: true });

    const updated = await Department.findByIdAndUpdate({ _id: id }, { name, slug }, {
      new: true,
    });

    if (!updated) {
      return res.status(404).json({ message: "Department not found", success: false });
    }

    return res
      .status(200)
      .json({
        success: true,
        data: updated,
        message: "Department updated successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

/* ---------------- DELETE ------------------ */
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Department.findByIdAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({ message: "Department not found", success: false });
    }

    return res.status(200).json({ success: true, message: "Department deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  addDepartment,
  getDepartmentsList,
  getDepartment,
  updateDepartment,
  deleteDepartment,
};
