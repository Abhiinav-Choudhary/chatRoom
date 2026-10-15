import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MessageCircle,
  UserRound,
  LockKeyhole,
  ArrowRight,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import "../styles/login.css";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(form);
      navigate("/profile");
    } catch (err) {
      setError(err?.message || "Invalid username or password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <div className="login-decoration login-decoration-one" />
      <div className="login-decoration login-decoration-two" />

      <header className="login-brand">
        <Link to="/" className="login-brand-link">
          <span className="login-brand-icon">
            <MessageCircle size={22} />
          </span>
          <span>ChatHub</span>
        </Link>

        <span className="login-brand-caption">
          Your space to connect
        </span>
      </header>

      <section className="login-layout">
        <aside className="login-intro">
          <div className="login-intro-badge">
            <Sparkles size={15} />
            <span>Your conversations are waiting</span>
          </div>

          <h1>
            Pick up where
            <br />
            you left off.
            <br />
            <span>Let's connect.</span>
          </h1>

          <p>
            Sign in to reconnect with your people, jump into your
            chat rooms, and keep the conversation going.
          </p>

          <div className="login-trust">
            <span className="login-trust-icon">
              <ShieldCheck size={19} />
            </span>
            <div>
              <strong>Welcome back to ChatHub</strong>
              <span>Your rooms and conversations are just a sign-in away.</span>
            </div>
          </div>
        </aside>

        <div className="login-box">
          <div className="login-card-heading">
            <span className="login-card-icon">
              <LockKeyhole size={23} />
            </span>

            <span className="login-eyebrow">WELCOME BACK</span>
            <h2 className="login-title">Sign in to ChatHub</h2>
            <p className="login-subtitle">
              Enter your credentials to continue.
            </p>
          </div>

          {error && (
            <div className="login-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <label className="login-label" htmlFor="username">
              Username
            </label>

            <div className="login-input-wrap">
              <UserRound size={18} className="login-input-icon" />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Enter your username"
                value={form.username}
                onChange={handleChange}
                className="login-input"
                autoComplete="username"
                required
                disabled={loading}
              />
            </div>

            <label className="login-label" htmlFor="password">
              Password
            </label>

            <div className="login-input-wrap">
              <LockKeyhole size={18} className="login-input-icon" />
              <input
                id="password"
                name="password"
                type="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                className="login-input"
                autoComplete="current-password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >
              <span>{loading ? "Signing in..." : "Sign in"}</span>
              {!loading && <ArrowRight size={18} />}
              {loading && <span className="login-spinner" />}
            </button>
          </form>

          <div className="login-divider">
            <span>NEW TO CHATHUB?</span>
          </div>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/register" className="register-link">
              Create one
            </Link>
          </p>
        </div>
      </section>

      <footer className="login-bottom">
        <span>© {new Date().getFullYear()} ChatHub</span>
        <span className="login-bottom-dot" />
        <span>Made for better conversations</span>
      </footer>
    </main>
  );
};

export default Login;