const express = require("express");
const router = express.Router();

const {
  createTask,
  getTaskLists,
  getFilteredTasks,
  getCompletedTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
} = require("../controllers/task.controller");

router.post("/", createTask);
router.get("/lists", getTaskLists);
router.get("/filtered-tasks", getFilteredTasks);
router.get("/lists/completed-tasks", getCompletedTasks);
router.get("/get/:id", getTaskById);
router.put("/update/:id", updateTask);
router.delete("/delete/:id", deleteTask);
router.get("/task-stats", getTaskStats);

module.exports = router;