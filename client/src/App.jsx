import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChatRoom from "./pages/ChatRoom";
import { useAuth } from "./contexts/AuthContext";

function App() {
  const { user, loading } = useAuth();

  // Avoid rendering protected routes before the auth check finishes.
  if (loading) {
    return (
      <div className="app-loading-screen" role="status" aria-live="polite">
        <span className="app-loading-spinner" aria-hidden="true" />
        <p>Loading your workspace...</p>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect the home route based on authentication status. */}
        <Route
          path="/"
          element={
            <Navigate
              to={user ? "/profile" : "/login"}
              replace
            />
          }
        />

        {/* Public routes: authenticated users go to their profile. */}
        <Route
          path="/login"
          element={
            user ? <Navigate to="/profile" replace /> : <Login />
          }
        />
        <Route
          path="/register"
          element={
            user ? <Navigate to="/profile" replace /> : <Register />
          }
        />

        {/* Protected routes. */}
        <Route
          path="/profile"
          element={
            user ? <Profile /> : <Navigate to="/login" replace />
          }
        />
        <Route
          path="/chatroom/:roomId"
          element={
            user ? <ChatRoom /> : <Navigate to="/login" replace />
          }
        />

        {/* Unknown routes return to the appropriate home destination. */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
