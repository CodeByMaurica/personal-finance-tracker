import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";

import ProtectedRoute from "./components/ProtectedRoute";
import AppLayout from "./layouts/AppLayout";

import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import DashboardScreen from "./screens/DashboardScreen";
import CategoriesScreen from "./screens/CategoriesScreen";
import TransactionsScreen from "./screens/TransactionsScreen";
import BudgetScreen from "./screens/BudgetScreen";
import ReportsScreen from "./screens/ReportsScreen";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/login" />} />

          <Route path="/login" element={<LoginScreen />} />
          <Route path="/register" element={<RegisterScreen />} />

          <Route
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<DashboardScreen />} />
            <Route path="/categories" element={<CategoriesScreen />} />
            <Route path="/transactions" element={<TransactionsScreen />} />
            <Route path="/budgets" element={<BudgetScreen />} />
            <Route path="/reports" element={<ReportsScreen />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}