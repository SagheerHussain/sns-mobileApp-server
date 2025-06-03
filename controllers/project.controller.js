const mongoose = require("mongoose");
const Project = require("../models/Project.model");
const Task = require("../models/Task.model");

/* --------------- GET --------------- */
const getProjectsLists = async (req, res) => {
  try {
    const projects = await Project.find({ progress_percentage: { $lt: 100 } })
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
    console.error("Error saving client:", error);
    return res.status(500).json({
      message: "Error saving client",
      error: error.message,
      success: false,
    });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await Project.findById({ _id: id })
      .select(
        "title overview total_cost client deadline lead_date assign_users documents priority stage progress_percentage tags created_by"
      )
      .populate("assign_users")
      .populate("documents")
      .populate("client")
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
    const {
      search,
      priority,
      stage,
      status,
      users,
      client,
      page = 1,
    } = req.query;

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

const getProjectSpecificInfo = async (req, res) => {
  try {
    const project = await Project.find().select("title").lean();

    if (project.length === 0) {
      return res
        .status(200)
        .json({ message: "There is no projects right now.", success: true });
    }

    return res.status(200).json({
      message: "Projects fetched successfully",
      success: true,
      data: project,
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

const getCompletedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: "completed" })
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
      client,
      status: "hold_on",
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
    console.error("Error saving client:", error);
    return res.status(500).json({
      message: "Error saving client",
      error: error.message,
      success: false,
    });
  }
};

/* --------------- PUT ---------------- */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    let {
      title,
      overview,
      total_cost,
      deadline,
      lead_date,
      assign_users,
      // documents,
      progress_percentage,
      client,
      priority,
      stage,
      status,
      tags,
      edit_project_user,
    } = req.body;

    console.log(req.body);

    let completedAt;

    if (status === "completed") {
      progress_percentage = 100;
      completedAt = new Date();
    }

    const updated = await Project.findByIdAndUpdate(
      { _id: id },
      {
        title,
        overview,
        total_cost: Number(total_cost),
        deadline,
        lead_date,
        assign_users,
        // documents,
        client,
        priority,
        stage,
        status,
        progress_percentage: Number(progress_percentage),
        tags,
        edit_project_user,
        completedAt,
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
    console.error("Error saving client:", error);
    return res.status(500).json({
      message: "Error saving client",
      error: error.message,
      success: false,
    });
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
  getProjectSpecificInfo,
  filteredProjects,
  getCompletedProjects,
  createProject,
  updateProject,
  deleteProject,
};
