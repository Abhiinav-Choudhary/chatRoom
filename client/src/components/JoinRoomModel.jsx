import React, { useEffect, useState } from "react";
import { useChat } from "../contexts/ChatContext";
import "../styles/JoinRoomModal.css";

function JoinRoomModal({ onClose, onJoin }) {
  const { getNearRooms, loading } = useChat();

  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");

  // 📍 Fetch nearby rooms automatically
  useEffect(() => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const res = await getNearRooms({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
          setRooms(res);
        } catch (err) {
          setError("Failed to fetch nearby rooms");
        }
      },
      () => {
        setError("Location permission denied");
      }
    );
  }, []);

  return (
    <div className="join-modal-overlay">
      <div className="join-modal-content">
        <h3 className="join-modal-title">
          Nearby Chatrooms
        </h3>

        {error && (
          <p className="join-error-message">{error}</p>
        )}

        {loading && <p className="join-loading">Loading...</p>}

        {!loading && rooms.length === 0 && (
          <p className="join-no-rooms">
            No chatrooms nearby
          </p>
        )}

        <ul className="rooms-list">
          {rooms.map((room) => (
            <li key={room._id} className="room-item">
              <div className="room-info">
                <p className="room-name">{room.name}</p>
                <p className="room-distance">
                  {room.distance}m away
                </p>
              </div>

              <button
                onClick={() => {
                  onJoin(room._id);
                  onClose();
                }}
                className="join-btn"
              >
                Join
              </button>
            </li>
          ))}
        </ul>

        <button
          onClick={onClose}
          className="join-cancel-btn"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default JoinRoomModal;