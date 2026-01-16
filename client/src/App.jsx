import React from "react";
import { BrowserRouter, Routes, Route,Navigate} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import ChatRoom from "./pages/ChatRoom";
import { useAuth } from "./contexts/AuthContext";


function App() {
  
  const {user,loading} = useAuth()

   if (loading) {
    return <div>Loading...</div>; // or spinner
  }
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            user ? <Navigate to="/profile" /> : <Navigate to="/login" />
          }
        />

          {/* Public Routes */}
        <Route path="/login" element={!user ? <Login /> : <Navigate to="/profile" />} />
        <Route path="/register" element={!user ? <Register /> : <Navigate to="/profile" />} />

        {/* Protected Routes */}
        <Route
          path="/profile"
          element={user ? <Profile /> : <Navigate to="/login" />}
        />

        <Route
          path="/chatroom/:roomId"
          element={user ? <ChatRoom /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
