const express = require("express");
const upload = require("../upload");

const router = express.Router();

const { getDocumentsLists, getDocument, createDocument, updateDocument, deleteDocument } = require("../controllers/document.controller");

// GET
router.get("/lists", getDocumentsLists);
router.get("/get/:id", getDocument);

// POST
router.post("/", upload.single("file"), createDocument);

// UPDATE
router.put("/update/:id", upload.single("file"), updateDocument);

// DELETE
router.delete("/delete/:id", deleteDocument);

module.exports = router;