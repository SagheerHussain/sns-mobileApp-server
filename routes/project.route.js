const express = require("express");

const router = express.Router();

const {
  getProjectsLists,
  getProjectById,
  getProjectSpecificInfo,
  filteredProjects,
  getCompletedProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

// GET
router.get("/lists", getProjectsLists);
router.get("/lists/project-specific-info", getProjectSpecificInfo);
router.get("/get/:id", getProjectById);
router.get("/lists/filtered-projects", filteredProjects);
router.get("/lists/completed-projects", getCompletedProjects);

// POST
router.post("/", createProject);

// PUT
router.put("/update/:id", updateProject);

// DELETE
router.delete("/delete/:id", deleteProject);

module.exports = router;
