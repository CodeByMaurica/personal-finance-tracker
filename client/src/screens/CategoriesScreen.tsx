import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../services/api";
import type { Category } from "../types";

export default function CategoriesScreen() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [name, setName] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [error, setError] = useState("");

  async function loadCategories() {
  try {
    console.log("Loading categories...");

    const res = await api.get("/categories");

    console.log("Categories response:", res.data);

    setCategories(res.data);
  } catch (error: any) {
    console.error("CATEGORY ERROR:", error);

    if (error.response) {
      console.error("Status:", error.response.status);
      console.error("Data:", error.response.data);
    }
  }
}

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/categories", { name, type });
      setName("");
      setType("expense");
      await loadCategories();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not add category");
    }
  }

  async function deleteCategory(id: number) {
    await api.delete(`/categories/${id}`);
    await loadCategories();
  }

  useEffect(() => {
    loadCategories();
  }, []);

  return (
    <div>
      <h1>Categories</h1>
      <p className="muted">Create income and expense categories.</p>

      {error && <div className="error-box">{error}</div>}

      <form className="form-row" onSubmit={handleSubmit}>
        <input
          required
          placeholder="Category name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <button type="submit">Add Category</button>
      </form>

      <div className="table-card">
        {categories.map((category) => (
          <div className="list-row" key={category.id}>
            <span>{category.name}</span>
            <span>{category.type}</span>
            <button type="button" onClick={() => deleteCategory(category.id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}