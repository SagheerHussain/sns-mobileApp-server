const PaymentMethod = require("../models/PaymentMethod.model");
const slugify = require("slugify");

/* --------------------- GET -------------------- */
const getPaymentMethods = async (req, res) => {
  try {
    const paymentMethods = await PaymentMethod.find().lean();
    if (paymentMethods.length === 0) {
      return res
        .status(404)
        .json({ message: "Payment Methods not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: paymentMethods,
      message: "No Payment Methods found",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

const getPaymentMethodById = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findById({ _id: id }).lean();
    if (!paymentMethod) {
      return res
        .status(404)
        .json({ message: "Payment Method not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: paymentMethod,
      message: "Payment Method retrieved successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* --------------------- POST -------------------- */
const addPaymentMethod = async (req, res) => {
  try {
    const { method } = req.body;
    console.log(req.body)

    if (!method) {
      return res
        .status(400)
        .json({ message: "Payment Method is required", success: false });
    }

    const isExist = await PaymentMethod.findOne({ method }).lean();
    if (isExist) {
      return res
        .status(409)
        .json({ message: "Payment Method already exists", success: false });
    }

    const paymentMethod = await PaymentMethod.create({ method });
    return res.status(201).json({
      success: true,
      data: paymentMethod,
      message: "Payment Method created successfully",
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

/* --------------------- PUT -------------------- */
const updatePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const { method } = req.body;

    const slug = slugify(method, { lower: true, strict: true });

    const paymentMethod = await PaymentMethod.findByIdAndUpdate(
      { _id: id },
      { method, slug },
      { new: true }
    );
    if (!paymentMethod) {
      return res
        .status(404)
        .json({ message: "Payment Method not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: paymentMethod,
      message: "Payment Method updated successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

/* --------------------- DELETE -------------------- */
const deletePaymentMethod = async (req, res) => {
  try {
    const { id } = req.params;
    const paymentMethod = await PaymentMethod.findByIdAndDelete({ _id: id });
    if (!paymentMethod) {
      return res
        .status(404)
        .json({ message: "Payment Method not found", success: false });
    }
    return res.status(200).json({
      success: true,
      data: paymentMethod,
      message: "Payment Method deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: "Server Error", success: false });
  }
};

module.exports = {
    getPaymentMethods,
    getPaymentMethodById,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
} 