const express = require("express");

const router = express.Router();

const { getClientsList, getClient, createClient, updateClient, deleteClient } = require("../controllers/client.controller");

// GET
router.get("/lists", getClientsList);
router.get("/lists/:email", getClient);

// POST
router.post("/", createClient);

// PUT
router.put("/update/:id", updateClient);

// DELETE
router.delete("/delete/:id", deleteClient);

module.exports = router;
