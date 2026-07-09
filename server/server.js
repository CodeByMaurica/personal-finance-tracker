import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db.js";

import authRoutes from "./routes/authRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";
import budgetRoutes from "./routes/budgetRoutes.js";
import reportRoutes from "./routes/reportRoutes.js";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");

    res.json({
      message: "Personal Finance Tracker API is running",
      database: "Connected",
      time: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({
      message: "API running, but database failed",
      error: error.message
    });
  }
});

app.use("/api/auth", authRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/budgets", budgetRoutes);
app.use("/api/reports", reportRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});