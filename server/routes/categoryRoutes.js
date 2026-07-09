import express from "express";
import { pool } from "../db.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();

// Get all categories for logged-in user
router.get("/", authMiddleware, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM categories WHERE user_id = $1 ORDER BY id DESC",
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    res.status(500).json({
      message: "Could not load categories",
      error: error.message
    });
  }
});

// Create category
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, type } = req.body;

    const result = await pool.query(
      `INSERT INTO categories (user_id, name, type)
       VALUES ($1, $2, $3)
       RETURNING *`,
      [req.user.id, name, type || "expense"]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({
      message: "Could not create category",
      error: error.message
    });
  }
});

// Delete category
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM categories WHERE id = $1 AND user_id = $2",
      [req.params.id, req.user.id]
    );

    res.json({ message: "Category deleted" });
  } catch (error) {
    res.status(500).json({
      message: "Could not delete category",
      error: error.message
    });
  }
});

export default router;