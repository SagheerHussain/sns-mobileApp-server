const Comment = require("../models/Comment.model");
const Task = require("../models/Task.model");

/* ---------------- POST ------------------ */
const createComment = async (req, res) => {
  try {
    const { message, task_id, user_id } = req.body;

    if (!message || !task_id || !user_id) {
      return res
        .status(400)
        .json({ message: "All Fields Required", success: false });
    }

    const task = await Task.findById(task_id);
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    const comment = await Comment.create({
      message,
      task_id,
      user_id,
    });

    return res.status(200).json({
      message: "Comment created successfully",
      success: true,
      data: comment,
    });
  } catch (error) {
    return res.status(400).json({ message: "Server Error", success: false });
  }
};

/* ---------------- GET ------------------ */
const getCommentsByTaskId = async (req, res) => {
  try {
    const { task_id } = req.params;
    const comments = await Comment.find({ task_id }).populate("user_id");
    if (comments.length === 0) {
      return res
        .status(200)
        .json({ message: "No comments found", success: true });
    }
    return res.status(200).json({
      message: "Comments retrieved successfully",
      success: true,
      data: comments,
    });
  } catch (error) {
    return res.status(400).json({ message: "Server Error", success: false });
  }
};


/* ---------------- Delete ------------------ */
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const comment = await Comment.findByIdAndDelete(id);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createComment,
  getCommentsByTaskId,
  deleteComment,
};
