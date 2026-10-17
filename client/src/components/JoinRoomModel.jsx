import React, { useEffect, useState } from "react";
import {
  X,
  MessageCircle,
  MapPin,
  LocateFixed,
  Users,
  ArrowRight,
  LoaderCircle,
  RefreshCw,
  Sparkles,
} from "lucide-react";
import { useChat } from "../contexts/ChatContext";
import "../styles/JoinRoomModal.css";

function JoinRoomModal({ onClose, onJoin }) {
  const { getNearRooms, loading } = useChat();

  const [rooms, setRooms] = useState([]);
  const [error, setError] = useState("");
  const [locationStatus, setLocationStatus] = useState("loading");
  const [fetching, setFetching] = useState(false);
  const [joiningRoomId, setJoiningRoomId] = useState(null);

  // const fetchNearbyRooms = () => {
  //   setError("");
  //   setRooms([]);
  //   setLocationStatus("loading");

  //   if (!navigator.geolocation) {
  //     setLocationStatus("error");
  //     setError("Geolocation is not supported by your browser.");
  //     return;
  //   }

  //   navigator.geolocation.getCurrentPosition(
  //     async (pos) => {
  //       setLocationStatus("success");
  //       setFetching(true);

  //       try {
  //         const result = await getNearRooms({
  //           latitude: pos.coords.latitude,
  //           longitude: pos.coords.longitude,
  //         });

  //         setRooms(Array.isArray(result) ? result : []);
  //       } catch (err) {
  //         setError(err?.message || "Failed to fetch nearby rooms.");
  //       } finally {
  //         setFetching(false);
  //       }
  //     },
  //     (err) => {
  //       setLocationStatus("error");

  //       if (err.code === err.PERMISSION_DENIED) {
  //         setError("Location permission denied. Allow location access to discover nearby rooms.");
  //       } else if (err.code === err.TIMEOUT) {
  //         setError("Getting your location took too long. Please try again.");
  //       } else {
  //         setError("Unable to get your location. Check your browser settings.");
  //       }
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 10000,
  //       maximumAge: 60000,
  //     }
  //   );
  // };

  
const fetchNearbyRooms = () => {
  setError("");
  setRooms([]);
  setLocationStatus("loading");
  setFetching(false);

  if (!navigator.geolocation) {
    setLocationStatus("error");
    setError("Geolocation is not supported by this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    async (pos) => {
      setFetching(true);

      try {
        const { latitude, longitude, accuracy } = pos.coords;

        console.log("Location detected:", {
          latitude,
          longitude,
          accuracy,
        });

        const result = await getNearRooms({
          latitude,
          longitude,
        });

        setRooms(Array.isArray(result) ? result : []);
        setLocationStatus("success");
      } catch (err) {
        setLocationStatus("error");
        setError(err?.message || "Failed to fetch nearby rooms.");
      } finally {
        setFetching(false);
      }
    },
    (err) => {
      setLocationStatus("error");
      setFetching(false);

      console.error("Geolocation error:", {
        code: err.code,
        message: err.message,
      });

      if (err.code === 1) {
        setError(
          "Location access denied. Allow location access in your browser and device settings."
        );
      } else if (err.code === 2) {
        setError(
          "Your device could not determine its location. Enable device location services and try again."
        );
      } else if (err.code === 3) {
        setError(
          "Location request timed out. Check your internet connection and try again."
        );
      } else {
        setError("Unable to get your location. Please try again.");
      }
    },
    {
      enableHighAccuracy: false,
      timeout: 20000,
      maximumAge: 60000,
    }
  );
};


  useEffect(() => {
    fetchNearbyRooms();
    // Fetch once when the modal opens.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isLoading = fetching || loading || locationStatus === "loading";

  const handleJoin = async (roomId) => {
    if (joiningRoomId) return;

    setJoiningRoomId(roomId);

    try {
      await onJoin(roomId);
      onClose();
    } catch (err) {
      setError(err?.message || "Unable to join this room. Please try again.");
      setJoiningRoomId(null);
    }
  };

  const formatDistance = (distance) => {
    const value = Number(distance);

    if (!Number.isFinite(value) || value < 0) return "Nearby";
    if (value < 1000) return `${Math.round(value)} m away`;

    return `${(value / 1000).toFixed(1)} km away`;
  };

  return (
    <div
      className="join-modal-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !joiningRoomId) onClose();
      }}
    >
      <section
        className="join-modal-content"
        role="dialog"
        aria-modal="true"
        aria-labelledby="join-modal-title"
      >
        <button
          type="button"
          className="join-modal-close"
          onClick={onClose}
          disabled={Boolean(joiningRoomId)}
          aria-label="Close dialog"
        >
          <X size={19} />
        </button>

        <div className="join-modal-heading">
          <div className="join-modal-icon">
            <MessageCircle size={25} />
            <span className="join-modal-sparkle">
              <Sparkles size={12} />
            </span>
          </div>

          <span className="join-modal-eyebrow">FIND YOUR PEOPLE</span>
          <h2 id="join-modal-title">Nearby chatrooms</h2>
          <p>Discover conversations happening around you.</p>
        </div>

        <div className={`join-location-status ${locationStatus}`}>
          <span className="join-location-icon">
            {locationStatus === "loading" ? (
              <LoaderCircle size={18} className="join-spinner" />
            ) : (
              <MapPin size={18} />
            )}
          </span>

          <div className="join-location-copy">
            <strong>
              {locationStatus === "loading"
                ? "Finding your location..."
                : locationStatus === "success"
                  ? "Location detected"
                  : "Location unavailable"}
            </strong>
            <span>
              {locationStatus === "success"
                ? "Looking for rooms near you."
                : locationStatus === "loading"
                  ? "Please allow location access in your browser."
                  : "Allow location access to discover nearby rooms."}
            </span>
          </div>

          {locationStatus === "success" && (
            <LocateFixed size={17} className="join-location-check" />
          )}
        </div>

        {error && (
          <div className="join-error-message" role="alert">
            <span className="join-error-mark">!</span>
            <span>{error}</span>
          </div>
        )}

        <div className="join-rooms-heading">
          <div>
            <h3>Explore rooms</h3>
            <p>
              {isLoading
                ? "Searching for nearby conversations..."
                : `${rooms.length} ${rooms.length === 1 ? "room" : "rooms"} found`}
            </p>
          </div>

          <button
            type="button"
            className="join-refresh-btn"
            onClick={fetchNearbyRooms}
            disabled={isLoading || Boolean(joiningRoomId)}
            aria-label="Refresh nearby rooms"
            title="Refresh nearby rooms"
          >
            <RefreshCw size={16} />
          </button>
        </div>

        <div className="join-rooms-scroll">
          {isLoading && (
            <div className="join-skeleton-list" aria-label="Loading rooms">
              {[1, 2, 3].map((item) => (
                <div className="join-skeleton-card" key={item}>
                  <span className="join-skeleton-avatar" />
                  <div className="join-skeleton-lines">
                    <span />
                    <span />
                  </div>
                  <span className="join-skeleton-button" />
                </div>
              ))}
            </div>
          )}

          {!isLoading && !error && rooms.length === 0 && (
            <div className="join-empty-state">
              <div className="join-empty-icon">
                <Users size={27} />
              </div>
              <h3>No rooms nearby yet</h3>
              <p>
                There aren't any discoverable chatrooms near your current
                location. Try refreshing or create a room of your own.
              </p>
              <button
                type="button"
                className="join-empty-retry"
                onClick={fetchNearbyRooms}
              >
                <RefreshCw size={15} />
                Try again
              </button>
            </div>
          )}

          {!isLoading && rooms.length > 0 && (
            <ul className="join-rooms-list">
              {rooms.map((room) => (
                <li key={room._id} className="join-room-item">
                  <div className="join-room-avatar">
                    <MessageCircle size={20} />
                  </div>

                  <div className="join-room-info">
                    <p className="join-room-name">{room.name}</p>
                    <span className="join-room-distance">
                      <MapPin size={12} />
                      {formatDistance(room.distance)}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleJoin(room._id)}
                    className="join-room-btn"
                    disabled={Boolean(joiningRoomId)}
                  >
                    {joiningRoomId === room._id ? (
                      <LoaderCircle size={16} className="join-spinner" />
                    ) : (
                      <>
                        Join
                        <ArrowRight size={15} />
                      </>
                    )}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="join-modal-footer">
          <span>
            <MapPin size={14} />
            Location-based discovery
          </span>

          <button
            type="button"
            onClick={onClose}
            className="join-cancel-btn"
            disabled={Boolean(joiningRoomId)}
          >
            Close
          </button>
        </div>
      </section>
    </div>
  );
}

export default JoinRoomModal