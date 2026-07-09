import express from "express";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/dashboard", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
        COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE 0 END), 0) AS income,
        COALESCE(SUM(CASE WHEN type = 'expense' THEN amount ELSE 0 END), 0) AS expenses
       FROM transactions
       WHERE user_id = $1`,
      [req.user.id]
    );

    const income = Number(result.rows[0].income);
    const expenses = Number(result.rows[0].expenses);

    res.json({
      income,
      expenses,
      balance: income - expenses
    });
  } catch (error) {
    res.status(500).json({ message: "Could not load dashboard", error: error.message });
  }
});

router.get("/categories", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT categories.name, SUM(transactions.amount) AS total
       FROM transactions
       JOIN categories ON transactions.category_id = categories.id
       WHERE transactions.user_id = $1 AND transactions.type = 'expense'
       GROUP BY categories.name
       ORDER BY total DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ message: "Could not load category report", error: error.message });
  }
});

export default router;