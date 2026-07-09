import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Pie } from "react-chartjs-2";
import {
  ArcElement,
  Chart as ChartJS,
  Legend,
  Tooltip
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

type CategoryReport = {
  name: string;
  total: string;
};

export default function ReportsScreen() {
  const [categoryData, setCategoryData] = useState<CategoryReport[]>([]);

  useEffect(() => {
    async function loadReports() {
      const response = await api.get("/reports/categories");
      setCategoryData(response.data);
    }

    loadReports();
  }, []);

  const chartData = {
    labels: categoryData.map((item) => item.name),
    datasets: [
      {
        label: "Spending",
        data: categoryData.map((item) => Number(item.total))
      }
    ]
  };

  return (
    <div>
      <h1>Reports</h1>
      <p className="muted">Spending breakdown by category.</p>

      <div className="chart-card">
        {categoryData.length > 0 ? (
          <Pie data={chartData} />
        ) : (
          <p>No expense data yet.</p>
        )}
      </div>
    </div>
  );
}