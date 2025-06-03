const Client = require("../models/Client.model");

/* ---------------- GET ------------------ */
const getClientsList = async (req, res) => {
  try {
    const clients = await Client.find({})
      .select("name email organization phone_number type isActive")
      .lean();

    if (clients.length === 0) {
      return res
        .status(200)
        .json({ message: "There is no clients right now.", success: true });
    }

    return res.status(200).json({
      message: "Clients list fetched successfully",
      success: true,
      data: clients,
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

const getClient = async (req, res) => {
  try {
    const { id } = req.params;

    const client = await Client.findOne({ _id: id })
      .select("name email organization phone_number type isActive")
      .lean();

    if (!client) {
      return res
        .status(200)
        .json({ message: "Client not found", success: true });
    }

    return res.status(200).json({
      message: "Client retrieved successfully",
      success: true,
      data: client,
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

/* ---------------- POST ------------------ */
const createClient = async (req, res) => {
  try {
    const { name, email, phone_number, organization, type } = req.body;

    if (!name || !email) {
      return res
        .status(400)
        .json({ message: "All fields are required", success: false });
    }

    const isExist = await Client.findOne({ email }).lean();

    if (isExist) {
      return res
        .status(409)
        .json({ message: "Client already exists", success: false });
    }

    const newClient = new Client({
      name,
      email,
      phone_number,
      organization,
      type,
    });

    await newClient.save();

    return res.status(200).json({
      message: "Client created successfully",
      success: true,
      data: newClient,
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
const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone_number, organization, type, isActive } =
      req.body;

    

    const newClient = await Client.findByIdAndUpdate(
      { _id: id },
      {
        name,
        email,
        phone_number,
        organization,
        type,
        isActive,
      },
      { new: true }
    );

    return res.status(200).json({
      message: "Client updated successfully",
      success: true,
      data: newClient,
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
const deleteClient = async (req, res) => {
  try {
    const { id } = req.params();

    await Client.findByIdAndDelete({ _id: id });
    return res.status(200).json({
      message: "Client deleted successfully",
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

module.exports = {
  getClientsList,
  getClient,
  createClient,
  updateClient,
  deleteClient,
};
