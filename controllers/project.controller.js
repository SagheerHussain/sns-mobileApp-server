const mongoose = require("mongoose");
const Project = require("../models/Project.model");
const Task = require("../models/Task.model");

/* --------------- GET --------------- */
const getProjectsLists = async (req, res) => {
  try {
    const projects = await Project.find()
      .select(
        "title overview total_cost deadline lead_date assign_users documents priority stage progress_percentage tags created_by"
      )
      .populate("assign_users")
      .populate("documents")
      .populate("created_by")
      .lean();

    if (projects.length === 0) {
      return res
        .status(200)
        .json({ message: "There is no projects right now.", success: true });
    }

    return res.status(200).json({
      message: "Projects fetched successfully",
      success: true,
      data: projects,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById({ _id: id })
      .select(
        "title overview total_cost deadline lead_date assign_users documents priority stage progress_percentage tags created_by"
      )
      .populate("assign_users")
      .populate("documents")
      .populate("created_by")
      .lean();

    if (!project) {
      return res
        .status(404)
        .json({ message: "Project not found", success: false });
    }

    return res.status(200).json({
      message: "Project fetched successfully",
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const filteredProjects = async (req, res) => {
  try {
    const { search, priority, stage, status, users, client, page = 1 } = req.query;

    let query = {};

    if (users) {
      query.assign_users = {
        $in: users.split(",").map((id) => new mongoose.Types.ObjectId(id)),
      };
    }

    if (client) {
      query.client = new mongoose.Types.ObjectId(client);
    }

    if (priority) {
      query.priority = priority;
    }

    if (stage) {
      query.stage = stage;
    }

    if (status) {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { overview: { $regex: search, $options: "i" } },
      ];
    }


    const limit = 10;
    const skip = (parseInt(page) - 1) * limit;

    const projects = await Project.find(query)
      .select(
        "title overview total_cost deadline lead_date assign_users documents priority stage progress_percentage tags created_by"
      )
      .populate("assign_users")
      .populate("documents")
      .populate("created_by")
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Project.countDocuments(query);

    if (projects.length === 0) {
      return res
        .status(200)
        .json({ message: "There is no projects right now.", success: true });
    }

    return res.status(200).json({
      message: "Projects fetched successfully",
      success: true,
      data: projects,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(page),
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* --------------- POST --------------- */
const createProject = async (req, res) => {
  try {
    const {
      title,
      overview,
      total_cost,
      deadline,
      lead_date,
      assign_users,
      documents,
      client,
      priority,
      stage,
      tags,
      created_by,
    } = req.body;

    if (
      !title ||
      !overview ||
      !total_cost ||
      !deadline ||
      !lead_date ||
      !assign_users ||
      !client ||
      !priority ||
      !stage ||
      !created_by
    ) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const project = await Project.create({
      title,
      overview,
      total_cost,
      deadline,
      lead_date,
      assign_users,
      documents,
      client,
      priority,
      stage,
      tags,
      created_by,
    });

    return res.status(200).json({
      message: "Project created successfully",
      success: true,
      data: project,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* --------------- PUT ---------------- */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      overview,
      total_cost,
      deadline,
      lead_date,
      assign_users,
      documents,
      client,
      priority,
      stage,
      status,
      tags,
      created_by,
    } = req.body;

    const taskAssignThisProject = await Task.find({ project_id: id }).lean();
    // Calculate progress_percentage
    let progress_percentage = 0;
    const totalTasks = taskAssignThisProject.length;

    if (totalTasks > 0) {
      const completedTasks = taskAssignThisProject.filter(
        (task) => task.status === "completed"
      ).length;

      progress_percentage = Math.round((completedTasks / totalTasks) * 100);
    }

    const updated = await Project.findByIdAndUpdate(
      { _id: id },
      {
        title,
        overview,
        total_cost,
        deadline,
        lead_date,
        assign_users,
        documents,
        client,
        priority,
        stage,
        status,
        progress_percentage,
        tags,
        created_by,
      },
      {
        new: true,
      }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ message: "Project not found", success: false });
    }

    return res.status(200).json({
      message: "Project updated successfully",
      success: true,
      data: updated,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* -------------- DELETE -------------- */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Project.findByIdAndDelete({ _id: id });

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Project not found", success: false });
    }

    return res.status(200).json({
      message: "Project deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

module.exports = {
  getProjectsLists,
  getProjectById,
  filteredProjects,
  createProject,
  updateProject,
  deleteProject,
};
