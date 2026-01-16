import React, { useState,useEffect } from "react";
import { useChat } from "../contexts/ChatContext";
import "../styles/CreateRoomModal.css";

function CreateRoomModal({ onClose, onRoomCreated }) {
  const { createRoom, loading } = useChat();

  const [name, setName] = useState("");
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState("");
  const [error, setError] = useState("");


   useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation is not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
      },
      () => {
        setError("Location permission denied");
      }
    );
  }, []);

 const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!location) {
      setError("Location not available");
      return;
    }

    try {
      const room = await createRoom({
        name,
        latitude: location.latitude,
        longitude: location.longitude,
        radius: Number(radius),
      });

      onRoomCreated(room._id);
      onClose();
    } catch (err) {
      setError("Failed to create room");
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3 className="modal-title">Create Room</h3>

        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleSubmit} className="modal-form">
          <input
            type="text"
            placeholder="Room name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="modal-input"
            required
          />

          <input
            type="number"
            placeholder="Radius (meters)"
            value={radius}
            onChange={(e) => setRadius(e.target.value)}
            className="modal-input"
            required
          />

          <div className="modal-buttons">
            <button 
              type="submit" 
              disabled={loading}
              className="submit-btn"
            >
              {loading ? "Creating..." : "Create"}
            </button>

            <button
              type="button"
              onClick={onClose}
              className="cancel-btn"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateRoomModal;