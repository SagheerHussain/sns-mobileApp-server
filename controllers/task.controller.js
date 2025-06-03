// controllers/task.controller.js
const Task = require("../models/Task.model");
const Project = require("../models/Project.model");

/* ---------------- POST ------------------ */
const createTask = async (req, res) => {
  try {
    const {
      title,
      details,
      project,
      assign_users,
      stage,
      status,
      priority,
      due_date,
      tags,
    } = req.body;

    if (
      !title ||
      !details ||
      !project ||
      !assign_users ||
      !stage ||
      !status ||
      !priority ||
      !due_date ||
      !tags
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const projectExist = await Project.findById(project);
    if (!projectExist) {
      return res
        .status(404)
        .json({ message: "Project not found", success: false });
    }

    const task = await Task.create({
      title,
      details,
      project,
      assign_users,
      stage,
      status,
      priority,
      due_date,
      tags,
    });
    return res.status(200).json({
      message: "Task created successfully",
      success: true,
      data: task,
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

/* ---------------- GET ------------------ */
const getTaskLists = async (req, res) => {
  try {
    const tasks = await Task.find({ progress_percentage: { $lt: 100 } })
      .populate("assign_users")
      .populate("project")
      .populate("edit_task_user")
      .lean();

    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found", success: true });
    }

    return res
      .status(200)
      .json({
        message: "Tasks retrieved successfully",
        success: true,
        data: tasks,
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

const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findById({ _id: id }).populate(
      "assign_users edit_task_user project"
    );
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    return res
      .status(200)
      .json({
        message: "Task retrieved successfully",
        success: true,
        data: task,
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

const getFilteredTasks = async (req, res) => {
  try {
    const {
      page = 1,
      search = "",
      priority,
      status,
      stage,
      project_id,
      assign_user,
    } = req.query;
    const query = { isActive: true };

    if (search) {
      query.title = { $regex: search, $options: "i" };
    }
    if (priority) {
      query.priority = priority;
    }
    if (status) {
      query.status = status;
    }
    if (stage) {
      query.stage = stage;
    }
    if (project_id) {
      query.project_id = project_id;
    }
    if (assign_user) {
      query.assign_users = assign_user;
    }

    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    const tasks = await Task.find(query)
      .populate(
        "assign_users createdBy edit_task_user project document comments.user_id"
      )
      .sort({ due_date: 1 })
      .skip(skip)
      .limit(limit);

    const total = await Task.countDocuments(query);

    return res.status(200).json({
      data: tasks,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
      success: true,
      message: "Tasks retrieved successfully",
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

const getTaskStats = async (req, res) => {
  try {
    const completed = await Task.find({ status: "completed", progress_percentage: 100 });
    const in_progress = await Task.find({
      status: "in_progress",
      progress_percentage: { $lt: 100 },
    });
    const pending = await Task.find({ status: "pending", progress_percentage: { $lt: 100 } });

    res.status(200).json({
      completedTasks: completed,
      inProgressTasks: in_progress,
      pendingTasks: pending,
      success: true,
      message: "Tasks stats retrieved successfully",
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

const getCompletedTasks = async (req, res) => {
  try {
    const completed = await Task.find({ status: "completed", progress_percentage: 100 })
      .populate("assign_users edit_task_user project")
      .lean();
    res.status(200).json({
      data: completed,
      success: true,
      message: "Completed tasks retrieved successfully",
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
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      title,
      details,
      project,
      assign_users,
      stage,
      status,
      priority,
      due_date,
      completedAt,
      progress_percentage,
      edit_task_user,
      tags,
    } = req.body;

    if (status === "completed") {
      completedAt = new Date();
      progress_percentage = 100;
    }

    const task = await Task.findByIdAndUpdate(
      { _id: id },
      {
        title,
        details,
        project,
        assign_users,
        stage,
        status,
        priority,
        due_date,
        completedAt,
        progress_percentage,
        tags,
        edit_task_user,
      },
      {
        new: true,
      }
    );
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    res.status(200).json({
      message: "Task updated successfully",
      success: true,
      data: task,
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

/* ---------------- DELETE ------------------ */
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!task) {
      return res
        .status(404)
        .json({ message: "Task not found", success: false });
    }
    res.status(200).json({
      message: "Task deleted successfully",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  createTask,
  getTaskLists,
  getFilteredTasks,
  getCompletedTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
};
