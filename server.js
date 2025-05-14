const express = require("express");
require("dotenv").config();
const dbConnection = require("./config/config");
const cron = require("node-cron");

const app = express();

const {
  markAutoAbsentOrLeaveHandler,
} = require("./controllers/attendance.controller");

// Routes Call
const userRoutes = require("./routes/user.route");
const authRoutes = require("./routes/auth.route");
const roleRoutes = require("./routes/role.route");
const designationRoutes = require("./routes/designation.route");
const departmentRoutes = require("./routes/department.route");
const clientRoutes = require("./routes/client.route");
const documentRoutes = require("./routes/document.route");
const projectRoutes = require("./routes/project.route");
const taskRoutes = require("./routes/task.route");
const attendanceRoutes = require("./routes/attendance.route");
const commentRoutes = require("./routes/comment.route");
const currencyRoutes = require("./routes/currency.route");
const investmentRoutes = require("./routes/investment.route");
const leaveRequestRoutes = require("./routes/leaveRequest.route");
const leaveEntitlementRoutes = require("./routes/leaveEntitlement.route");
const paymentMethodRoutes = require("./routes/paymentMethod.route");
const profitAndLossRoutes = require("./routes/profitAndLoss.route");
const transactionRoutes = require("./routes/transaction.route");
const transactionCategoryRoutes = require("./routes/transactionCategory.route");
const holidayRoutes = require("./routes/holiday.route");

// Mongo Db Connection
dbConnection();

// Built in Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Welcome Message
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to SNS Task Management API" });
});

// ⏱ Schedule to run at 7 PM daily (Pakistan Time = UTC+5)
cron.schedule(
  "0 14 * * *",
  async () => {
    console.log("⏰ Running Auto Absent Handler at 7 PM PKT...");
    await markAutoAbsentOrLeaveHandler();
  },
  {
    timezone: "Asia/Karachi",
  }
);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/attendance", attendanceRoutes);
app.use("/api/clients", clientRoutes);
app.use("/api/comments", commentRoutes);
app.use("/api/currencies", currencyRoutes);
app.use("/api/designations", designationRoutes);
app.use("/api/departments", departmentRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/holidays", holidayRoutes);
app.use("/api/investments", investmentRoutes);
app.use("/api/leaves-requests", leaveRequestRoutes);
app.use("/api/leave-entitlements", leaveEntitlementRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/payment-methods", paymentMethodRoutes);
app.use("/api/profit-and-losses", profitAndLossRoutes);
app.use("/api/roles", roleRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/transactions-categories", transactionCategoryRoutes);
app.use("/api/users", userRoutes);

// Listening Server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});
