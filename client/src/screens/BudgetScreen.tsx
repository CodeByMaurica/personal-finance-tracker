import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../services/api";
import type { Budget, Category } from "../types";

export default function BudgetScreen() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryId, setCategoryId] = useState("");
  const [monthlyLimit, setMonthlyLimit] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const budgetRes = await api.get("/budgets");
    const catRes = await api.get("/categories");
    setBudgets(budgetRes.data);
    setCategories(catRes.data);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/budgets", {
        category_id: Number(categoryId),
        monthly_limit: Number(monthlyLimit)
      });

      setCategoryId("");
      setMonthlyLimit("");
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not add budget");
    }
  }

  async function deleteBudget(id: number) {
    await api.delete(`/budgets/${id}`);
    await loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h1>Budgets</h1>
      <p className="muted">Set monthly spending limits.</p>

      {error && <div className="error-box">{error}</div>}

      <form className="form-row" onSubmit={handleSubmit}>
        <select required value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">Select Category</option>
          {categories
            .filter((cat) => cat.type === "expense")
            .map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
        </select>

        <input
          required
          type="number"
          placeholder="Monthly limit"
          value={monthlyLimit}
          onChange={(e) => setMonthlyLimit(e.target.value)}
        />

        <button type="submit">Add Budget</button>
      </form>

      <div className="table-card">
        {budgets.map((budget) => (
          <div className="list-row" key={budget.id}>
            <span>{budget.category_name}</span>
            <strong>${Number(budget.monthly_limit).toFixed(2)}</strong>
            <button type="button" onClick={() => deleteBudget(budget.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}