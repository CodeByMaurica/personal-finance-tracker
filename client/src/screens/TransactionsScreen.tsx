import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { api } from "../services/api";
import type { Category, Transaction } from "../types";

export default function TransactionsScreen() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("expense");
  const [categoryId, setCategoryId] = useState("");
  const [transactionDate, setTransactionDate] = useState("");
  const [error, setError] = useState("");

  async function loadData() {
    const transRes = await api.get("/transactions");
    const catRes = await api.get("/categories");
    setTransactions(transRes.data);
    setCategories(catRes.data);
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");

    try {
      await api.post("/transactions", {
        description,
        amount: Number(amount),
        type,
        category_id: categoryId ? Number(categoryId) : null,
        transaction_date: transactionDate
      });

      setDescription("");
      setAmount("");
      setType("expense");
      setCategoryId("");
      setTransactionDate("");
      await loadData();
    } catch (err: any) {
      setError(err.response?.data?.message || "Could not add transaction");
    }
  }

  async function deleteTransaction(id: number) {
    await api.delete(`/transactions/${id}`);
    await loadData();
  }

  useEffect(() => {
    loadData();
  }, []);

  return (
    <div>
      <h1>Transactions</h1>
      <p className="muted">Track income and expenses.</p>

      {error && <div className="error-box">{error}</div>}

      <form className="form-grid" onSubmit={handleSubmit}>
        <input required placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
        <input required placeholder="Amount" type="number" value={amount} onChange={(e) => setAmount(e.target.value)} />

        <select value={type} onChange={(e) => setType(e.target.value as "income" | "expense")}>
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>

        <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
          <option value="">No Category</option>
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>{cat.name}</option>
          ))}
        </select>

        <input required type="date" value={transactionDate} onChange={(e) => setTransactionDate(e.target.value)} />
        <button type="submit">Add</button>
      </form>

      <div className="table-card">
        {transactions.map((t) => (
          <div className="list-row" key={t.id}>
            <span>{t.description}</span>
            <span>{t.category_name || "No category"}</span>
            <span>{t.type}</span>
            <strong>${Number(t.amount).toFixed(2)}</strong>
            <button type="button" onClick={() => deleteTransaction(t.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}