import { useEffect, useState } from "react";
import { api } from "../services/api";

type DashboardData = {
  income: number;
  expenses: number;
  balance: number;
};

export default function DashboardScreen() {
  const [data, setData] = useState<DashboardData>({
    income: 0,
    expenses: 0,
    balance: 0
  });

  useEffect(() => {
    async function loadDashboard() {
      const response = await api.get("/reports/dashboard");
      setData(response.data);
    }

    loadDashboard();
  }, []);

  const savingsRate =
    data.income > 0 ? ((data.balance / data.income) * 100).toFixed(1) : "0";

  return (
    <div>
      <section className="hero-card">
        <div>
          <p className="eyebrow">Personal Finance Tracker</p>
          <h1>Welcome back to WealthTrack</h1>
          <p className="muted">
            Track income, expenses, budgets, and spending patterns in one secure dashboard.
          </p>
        </div>

        <div className="hero-badge">
          <span>Balance</span>
          <strong>${data.balance.toFixed(2)}</strong>
        </div>
      </section>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Income</h3>
          <h2>${data.income.toFixed(2)}</h2>
          <p className="muted">Money earned</p>
        </div>

        <div className="stat-card">
          <h3>Total Expenses</h3>
          <h2>${data.expenses.toFixed(2)}</h2>
          <p className="muted">Money spent</p>
        </div>

        <div className="stat-card">
          <h3>Savings Rate</h3>
          <h2>{savingsRate}%</h2>
          <p className="muted">Balance divided by income</p>
        </div>
      </div>
    </div>
  );
}