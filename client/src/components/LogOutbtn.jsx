import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { LogOut as LogOutIcon, LoaderCircle } from "lucide-react";
import "../styles/logout.css";

function Logout() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) return;

    setLoading(true);

    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      navigate("/login", { replace: true });
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="logout-btn"
      disabled={loading}
      aria-label="Log out of ChatHub"
    >
      {loading ? (
        <LoaderCircle size={17} className="logout-spinner" />
      ) : (
        <LogOutIcon size={17} />
      )}

      <span>{loading ? "Signing out..." : "Logout"}</span>
    </button>
  );
}

export default Logout;