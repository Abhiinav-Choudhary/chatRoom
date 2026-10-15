
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

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Navigate
              to={user ? "/profile" : "/login"}
              replace
            />
          }
        />

        {/* Public routes */}
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

        {/* Protected routes */}
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

        {/* Unknown routes */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
