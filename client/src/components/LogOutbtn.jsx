import React from 'react'
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from 'react-router-dom'
import "../styles/logout.css"

function Logout() {
const navigate = useNavigate()
 const { logout } = useAuth();
   const handleLogout =()=>{
    console.log("logout")
    logout()
    navigate("/login")
   }

  return (
     <div>
    <button onClick={handleLogout} className="logout-btn">Logout</button>
    </div>
  )
}

export default Logout