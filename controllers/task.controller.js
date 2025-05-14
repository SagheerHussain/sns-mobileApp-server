// controllers/task.controller.js
const Task = require("../models/Task.model");

/* ---------------- POST ------------------ */
const createTask = async (req, res) => {
  try {
    const { title, details, project_id, assign_users, stage, status, priority, due_date } = req.body;
    const task = await Task.create({
      title,
      details,
      project_id,
      assign_users,
      stage,
      status,
      priority,
      due_date,
    });
    return res.status(200).json({
      message: "Task created successfully",
      success: true,
      data: task,
    });
  } catch (error) {
    return res.status(400).json({ message: "Server Error", success: false });
  }
};

/* ---------------- GET ------------------ */
const getTaskLists = async (req, res) => {
  try {
    const tasks = await Task.find().populate(
      "assign_users createdBy edit_task_user project_id document comments.user_id"
    );

    if (tasks.length === 0) {
      return res.status(200).json({ message: "No tasks found", success: true });
    }

    return res
      .status(200)
      .json({ message: "Tasks retrieved successfully", success: true, tasks });
  } catch (error) {
    return res.status(500).json({ message: "server error", success: false });
  }
};

const getTaskById = async (req, res) => {
  try {
    const { id } = useParams;
    const task = await Task.findById({ _id: id }).populate(
      "assign_users createdBy edit_task_user project_id document comments.user_id"
    );
    if (!task) {
      return res.status(404).json({ message: "Task not found", success: false });
    }
    return res.status(200).json({ message: "Task retrieved successfully", success: true, task });
  } catch (error) {
    return res.status(500).json({ message: "server error", success: false });
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
        "assign_users createdBy edit_task_user project_id document comments.user_id"
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
    return res.status(500).json({ message: "server error", success: false });
  }
};

const getTaskStats = async (req, res) => {
  try {
    const completed = await Task.find({ status: "completed", isActive: true });
    const in_progress = await Task.find({
      status: "in_progress",
      isActive: true,
    });
    const pending = await Task.find({ status: "pending", isActive: true });

    res.status(200).json({
      completedTasks: completed,
      inProgressTasks: in_progress,
      pendingTasks: pending,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

/* ---------------- PUT ------------------ */
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createTask,
  getTaskLists,
  getFilteredTasks,
  getTaskById,
  updateTask,
  deleteTask,
  getTaskStats,
};
