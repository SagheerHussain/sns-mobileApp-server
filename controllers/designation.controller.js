const Designation = require("../models/Designation.model");
const slugify = require("slugify");

/* ---------------- GET ------------------ */
const getDesignationsList = async (req, res) => {
  try {
    const designations = await Designation.find().lean();
    if (!designations) {
      return res
        .status(404)
        .json({ message: "Designations not found", success: false });
    }
    return res
      .status(200)
      .json({
        success: true,
        message: "Designations fetched successfully",
        data: designations,
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

const getDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const designation = await Designation.findById({ _id: id }).lean();
    if (!designation) {
      return res
        .status(404)
        .json({ message: "Designation not found", success: false });
    }
    return res
      .status(200)
      .json({
        success: true,
        data: designation,
        message: "Designation retrieved successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ---------------- POST ------------------ */
const addDesignation = async (req, res) => {
  try {
    const { name } = req.body;

    const exists = await Designation.findOne({ name });
    if (exists) {
      return res
        .status(409)
        .json({ message: "Designation already exists", success: false });
    }

    console.log(name, exists);

    const newDesignation = await Designation.create({ name });
    return res
      .status(201)
      .json({
        success: true,
        message: "Designation added successfully",
        data: newDesignation,
      });
  } catch (error) {
    console.error("Error saving client:", error);
    return res.status(500).json({
      message: "Error saving client",
      error: error.message,
      success: false,
    });
  }
};

/* ---------------- PUT ------------------ */
const updateDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const slug = slugify(name, { lower: true, strict: true });

    const updated = await Designation.findByIdAndUpdate(
      { _id: id },
      { name, slug },
      {
        new: true,
      }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Designation not found", success: false });
    }

    return res
      .status(200)
      .json({
        success: true,
        data: updated,
        message: "Designation updated successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

/* ---------------- DELETE ------------------ */
const deleteDesignation = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Designation.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Designation not found", success: false });
    }

    return res
      .status(200)
      .json({ success: true, message: "Designation deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Server Error" });
  }
};

module.exports = {
  getDesignationsList,
  getDesignation,
  addDesignation,
  updateDesignation,
  deleteDesignation,
};
