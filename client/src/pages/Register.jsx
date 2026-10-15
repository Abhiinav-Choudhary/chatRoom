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
import "../styles/register.css";

const Register = () => {
  const { register } = useAuth();
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
      await register(form);
      navigate("/");
    } catch (err) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="register-page">
      <div className="register-decoration register-decoration-one" />
      <div className="register-decoration register-decoration-two" />

      <header className="register-brand">
        <Link to="/" className="register-brand-link">
          <span className="register-brand-icon">
            <MessageCircle size={22} />
          </span>
          <span>ChatHub</span>
        </Link>
        <span className="register-brand-caption">
          Your space to connect
        </span>
      </header>

      <section className="register-layout">
        <aside className="register-intro">
          <div className="register-intro-badge">
            <Sparkles size={15} />
            <span>Better conversations start here</span>
          </div>

          <h1>
            Your people.
            <br />
            Your rooms.
            <br />
            <span>Your conversations.</span>
          </h1>

          <p>
            Create your account and bring your conversations together.
            Join a room, invite your friends, and start chatting.
          </p>

          <div className="register-trust">
            <span className="register-trust-icon">
              <ShieldCheck size={19} />
            </span>
            <div>
              <strong>Get started in seconds</strong>
              <span>Create an account to join the conversation.</span>
            </div>
          </div>
        </aside>

        <div className="register-box">
          <div className="register-card-heading">
            <span className="register-card-icon">
              <UserRound size={23} />
            </span>
            <span className="register-eyebrow">GET STARTED</span>
            <h2 className="register-title">Create your account</h2>
            <p className="register-subtitle">
              Enter your details to join ChatHub.
            </p>
          </div>

          {error && (
            <div className="register-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="register-form">
            <label className="register-label" htmlFor="username">
              Username
            </label>

            <div className="register-input-wrap">
              <UserRound size={18} className="register-input-icon" />
              <input
                id="username"
                name="username"
                type="text"
                placeholder="Choose a username"
                value={form.username}
                onChange={handleChange}
                className="register-input"
                autoComplete="username"
                required
                disabled={loading}
              />
            </div>

            <label className="register-label" htmlFor="password">
              Password
            </label>

            <div className="register-input-wrap">
              <LockKeyhole size={18} className="register-input-icon" />
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Create a password"
                value={form.password}
                onChange={handleChange}
                className="register-input"
                autoComplete="new-password"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              className="register-button"
              disabled={loading}
            >
              <span>{loading ? "Creating account..." : "Create account"}</span>
              {!loading && <ArrowRight size={18} />}
              {loading && <span className="register-spinner" />}
            </button>
          </form>

          <div className="register-divider">
            <span>ALREADY A MEMBER?</span>
          </div>

          <p className="register-footer">
            Welcome back!{" "}
            <Link to="/login" className="login-link">
              Sign in instead
            </Link>
          </p>
        </div>
      </section>

      <footer className="register-bottom">
        <span>© {new Date().getFullYear()} ChatHub</span>
        <span className="register-bottom-dot" />
        <span>Made for better conversations</span>
      </footer>
    </main>
  );
};

export default Register;
