const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: { type: String },
    file: { type: String },
    type: { type: String, enum: ["pdf", "png", "jpeg", "jpg", "docx", "doc"] },
    url: { type: String },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    filesize: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Document", documentSchema);
