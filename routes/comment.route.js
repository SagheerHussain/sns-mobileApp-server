const express = require("express");
const router = express.Router();

const { createComment, getCommentsByTaskId, deleteComment } = require("../controllers/comments.controller");

/* POST */
router.post("/", createComment);

/* GET */
router.get("/get/:task_id", getCommentsByTaskId);

/* DELETE */
router.delete("/delete/:id", deleteComment);

module.exports = router;