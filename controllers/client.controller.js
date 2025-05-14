const Client = require("../models/Client.model");

/* ---------------- GET ------------------ */
const getClientsList = async (req, res) => {
  try {
    const clients = await Client.find({})
      .populate("user")
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
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

const getClient = async (req, res) => {
  try {
    const { email } = req.params;

    const client = await Client.findOne({ email })
      .populate("user")
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
    return res.status(500).json({
      message: "Server error",
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

    const newClient = await Client.create({
      name,
      email,
      phone_number,
      organization,
      type,
    });

    return res.status(200).json({
      message: "Client created successfully",
      success: true,
      data: newClient,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Server error",
      success: false,
    });
  }
};

/* ---------------- PUT ------------------ */
const updateClient = async (req, res) => {
  try {
    const { id } = req.params();
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
    return res.status(500).json({
      message: "Server error",
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
