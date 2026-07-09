import express from "express";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all budgets
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        budgets.id,
        budgets.category_id,
        budgets.monthly_limit,
        categories.name AS category_name
       FROM budgets
       JOIN categories ON budgets.category_id = categories.id
       WHERE budgets.user_id = $1
       ORDER BY budgets.id DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Could not load budgets",
      error: error.message
    });
  }
});

// Create budget
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { category_id, monthly_limit } = req.body;

    if (!category_id || !monthly_limit) {
      return res.status(400).json({
        message: "Category and monthly limit are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO budgets (user_id, category_id, monthly_limit)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, category_id, monthly_limit]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Could not create budget",
      error: error.message
    });
  }
});

// Delete budget
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM budgets WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Budget deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete budget",
      error: error.message
    });
  }
});

export default router;