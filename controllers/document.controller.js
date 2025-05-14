const Document = require("../models/Document.model");
const User = require("../models/User.model");
const Cloudinary = require("../cloudinary");

/* ---------------- GET ------------------ */
const getDocumentsLists = async (req, res) => {
  try {
    const documents = await Document.find()
      .select("title type url uploadedBy filesize")
      .populate("uploadedBy")
      .lean();

    if (documents.length === 0) {
      return res
        .status(200)
        .json({ message: "There is no documents right now.", success: true });
    }

    return res.status(200).json({
      message: "Documents list fetched successfully",
      success: true,
      data: documents,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getDocument = async (req, res) => {
  try {
    const { id } = req.params();
    const document = await Document.findOne({ _id: id })
      .select("title type url uploadedBy filesize")
      .populate("uploadedBy")
      .lean();

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Document retrieved successfully",
      success: true,
      data: document,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------- POST ------------------ */
const createDocument = async (req, res) => {
  try {
    const { title, url, uploadedBy } = req.body;

    if (!uploadedBy) {
      return res.status(400).json({ message: "User is required", success: false });
    }

    let imgPath = "";

    if (req.file) {
      imgPath = await Cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto", // 👈 this allows pdf, docx, images, etc.
      });
    }

    const user = await User.findOne({ _id: uploadedBy }).lean();

    if (!user) {
      return res
        .status(404)
        .json({ message: "User not found", success: false });
    }

    const newDocument = await Document.create({
      title,
      file: imgPath ? imgPath.secure_url : "",
      type: imgPath ? imgPath.format : "",
      url,
      uploadedBy,
      filesize: imgPath ? imgPath.bytes * 0.000001 : "",
    });

    return res.status(200).json({
      message: "Document created successfully",
      success: true,
      data: newDocument,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server error", success: false });
  }
};

/* ---------------- PUT ------------------ */
const updateDocument = async (req, res) => {
  try {
    const { id } = req.params();
    const { title, url, uploadedBy } = req.body;

    const document = await Document.findOne({ _id: id }).lean();
    if (!document) {
      return res.status(404).json({ message: "Document not found", success: false });
    }

    let imgPath = "";

    if (req.file) {
      imgPath = await Cloudinary.uploader.upload(req.file.path, {
        resource_type: "auto", // 👈 this allows pdf, docx, images, etc.
      });
    }

    const updated = await Document.findByIdAndUpdate(
      { _id: id },
      {
        title,
        file: imgPath ? imgPath.secure_url : document.file,
        type: imgPath ? imgPath.format : document.type,
        url,
        uploadedBy,
        filesize: imgPath ? imgPath.bytes * 0.000001 : document.filesize,
      },
      {
        new: true,
      }
    );

    if (!updated) {
      return res.status(404).json({ message: "Document not found", success: false });
    }

    return res.status(200).json({
      success: true,
      data: updated,
      message: "Document updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "server error" });
  }
};

/* ---------------- DELETE ------------------ */
const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params();
    const deleted = await Document.findByIdAndDelete({ _id: id });

    if (!deleted) {
      return res.status(404).json({ message: "Document not found", success: false });
    }

    return res.status(200).json({
      success: true,
      data: deleted,
      message: "Document deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "server error" });
  }
};

module.exports = {
  getDocumentsLists,
  getDocument,
  createDocument,
  updateDocument,
  deleteDocument,
};
