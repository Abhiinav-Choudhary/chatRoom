import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ChatProvider } from "./contexts/ChatContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  
     <AuthProvider>
    <ChatProvider>
      <App />
    </ChatProvider>
  </AuthProvider>
 
);
