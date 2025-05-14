const express = require("express");

const router = express.Router();

const {
  getProjectsLists,
  getProjectById,
  filteredProjects,
  createProject,
  updateProject,
  deleteProject,
} = require("../controllers/project.controller");

// GET
router.get("/lists", getProjectsLists);
router.get("/get/:id", getProjectById);
router.get("/lists/filtered-projects", filteredProjects);

// POST
router.post("/", createProject);

// PUT
router.put("/update/:id", updateProject);

// DELETE
router.delete("/delete/:id", deleteProject);

module.exports = router;
