import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function RegisterScreen() {
  const { registerUser } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    console.log("REGISTER BUTTON CLICKED");

    setError("");
    setLoading(true);

    try {
      await registerUser(name, email, password);
      navigate("/dashboard");
    } catch (err: any) {
      console.error("REGISTER ERROR:", err);
      setError(err.response?.data?.message || "Register failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-screen">
      <form className="auth-card" onSubmit={handleSubmit}>
        <p className="eyebrow">WealthTrack</p>
        <h1>Create Account</h1>
        <p className="muted">Start tracking your finances.</p>

        {error && <div className="error-box">{error}</div>}

        <input
          required
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          required
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          required
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Account..." : "Register"}
        </button>

        <small>
          Already have an account? <Link to="/login">Login</Link>
        </small>
      </form>
    </div>
  );
}