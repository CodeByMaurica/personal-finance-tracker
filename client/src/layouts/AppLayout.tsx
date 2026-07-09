import { NavLink, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AppLayout() {
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <h2>WealthTrack</h2>
        <p>{user?.name}</p>

        <nav>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/transactions">Transactions</NavLink>
          <NavLink to="/categories">Categories</NavLink>
          <NavLink to="/budgets">Budgets</NavLink>
          <NavLink to="/reports">Reports</NavLink>
        </nav>

        <button onClick={logout}>Logout</button>
      </aside>

      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}