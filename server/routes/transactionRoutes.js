import express from "express";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all transactions
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT 
        transactions.id,
        transactions.description,
        transactions.amount,
        transactions.type,
        transactions.transaction_date,
        transactions.category_id,
        categories.name AS category_name
       FROM transactions
       LEFT JOIN categories ON transactions.category_id = categories.id
       WHERE transactions.user_id = $1
       ORDER BY transactions.transaction_date DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Could not load transactions",
      error: error.message
    });
  }
});

// Create transaction
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { description, amount, type, transaction_date, category_id } = req.body;

    if (!description || !amount || !type || !transaction_date) {
      return res.status(400).json({
        message: "Description, amount, type, and date are required"
      });
    }

    const result = await pool.query(
      `INSERT INTO transactions 
       (user_id, description, amount, type, transaction_date, category_id)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [
        req.user.id,
        description,
        amount,
        type,
        transaction_date,
        category_id || null
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Could not create transaction",
      error: error.message
    });
  }
});

// Delete transaction
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM transactions WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Transaction deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete transaction",
      error: error.message
    });
  }
});

export default router;