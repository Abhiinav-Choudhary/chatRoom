import React, { useState, useEffect } from "react";
import {
  X,
  MessageCircle,
  MapPin,
  LocateFixed,
  Ruler,
  LoaderCircle,
  Sparkles,
} from "lucide-react";
import { useChat } from "../contexts/ChatContext";
import "../styles/CreateRoomModal.css";

function CreateRoomModal({ onClose, onRoomCreated }) {
  const { createRoom, loading } = useChat();

  const [name, setName] = useState("");
  const [location, setLocation] = useState(null);
  const [radius, setRadius] = useState("500");
  const [error, setError] = useState("");
  const [locationStatus, setLocationStatus] = useState("loading");
  const [submitting, setSubmitting] = useState(false);
  const [limitEnabled, setLimitEnabled] = useState(false);
const [maxMembers, setMaxMembers] = useState("10");

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("error");
      setError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
        });
        setLocationStatus("success");
        setError("");
      },
      (err) => {
        setLocationStatus("error");

        if (err.code === err.PERMISSION_DENIED) {
          setError("Location permission was denied. Allow location access to create a room.");
        } else if (err.code === err.TIMEOUT) {
          setError("Getting your location took too long. Please try again.");
        } else {
          setError("Unable to get your location. Check your location settings.");
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const trimmedName = name.trim();
    const radiusValue = Number(radius);

    if (!trimmedName) {
      setError("Please enter a room name.");
      return;
    }

    if (!radius || !Number.isFinite(radiusValue) || radiusValue <= 0) {
      setError("Enter a radius greater than 0 meters.");
      return;
    }

    if (limitEnabled) {
  const limit = Number(maxMembers);

  if (!Number.isInteger(limit) || limit < 2 || limit > 1000) {
    setError("Member limit must be between 2 and 1000.");
    return;
  }
}

    if (!location) {
      setError("Your location is not available yet. Please allow location access.");
      return;
    }

    if (submitting || loading) return;

    setSubmitting(true);

    try {
     const room = await createRoom({
  name: trimmedName,
  latitude: location.latitude,
  longitude: location.longitude,
  radius: radiusValue,
  maxMembers: limitEnabled ? Number(maxMembers) : null,
});

      if (!room?._id) {
        throw new Error("Room creation did not return a room ID.");
      }

      onRoomCreated(room._id);
      onClose();
    } catch (err) {
      setError(err?.message || "Failed to create room. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const isSubmitting = submitting || loading;

  return (
    <div
      className="create-room-overlay"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget && !isSubmitting) onClose();
      }}
    >
      <section
        className="create-room-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-room-title"
      >
        <button
          type="button"
          className="create-room-close"
          onClick={onClose}
          disabled={isSubmitting}
          aria-label="Close dialog"
        >
          <X size={19} />
        </button>

        <div className="create-room-heading">
          <div className="create-room-icon">
            <MessageCircle size={25} />
            <span className="create-room-icon-sparkle">
              <Sparkles size={13} />
            </span>
          </div>

          <span className="create-room-eyebrow">YOUR SPACE, YOUR RULES</span>
          <h2 id="create-room-title">Create a room</h2>
          <p>Set up a room and bring your people together.</p>
        </div>

        {error && (
          <div className="create-room-error" role="alert">
            <span className="create-room-error-mark">!</span>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="create-room-form">
          <label htmlFor="room-name" className="create-room-label">
            Room name
          </label>

          <input
            id="room-name"
            type="text"
            placeholder="e.g. Weekend Hangout"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="create-room-input"
            maxLength={60}
            autoFocus
            required
            disabled={isSubmitting}
          />

          <div className="create-room-label-row">
            <label htmlFor="room-radius" className="create-room-label">
              <Ruler size={15} />
              Discovery radius
            </label>
            <span className="create-room-unit">METERS</span>
          </div>

          <div className="create-room-radius-wrap">
            <input
              id="room-radius"
              type="number"
              min="1"
              max="100000"
              step="1"
              placeholder="500"
              value={radius}
              onChange={(e) => setRadius(e.target.value)}
              className="create-room-input"
              required
              disabled={isSubmitting}
            />
            <span className="create-room-radius-suffix">meters</span>
          </div>

          
<div className="create-room-limit">
  <label className="create-room-limit-toggle">
    <input
      type="checkbox"
      checked={limitEnabled}
      onChange={(e) => setLimitEnabled(e.target.checked)}
      disabled={isSubmitting}
    />

    <span className="create-room-limit-copy">
      <strong>Set member limit</strong>
      <small>
        {limitEnabled
          ? "The room will stop accepting new members when full."
          : "Anyone can join until you choose to set a limit."}
      </small>
    </span>
  </label>

  {limitEnabled && (
    <div className="create-room-limit-input">
      <label htmlFor="room-max-members">
        Maximum members <span>(including you)</span>
      </label>

      <input
        id="room-max-members"
        type="number"
        min="2"
        max="1000"
        step="1"
        value={maxMembers}
        onChange={(e) => setMaxMembers(e.target.value)}
        disabled={isSubmitting}
        required
      />
    </div>
  )}
</div>


          <p className="create-room-hint">
            Choose how far away people can be to discover your room.
          </p>

          <div className={`create-room-location ${locationStatus}`}>
            <span className="create-room-location-icon">
              {locationStatus === "loading" ? (
                <LoaderCircle size={19} className="create-room-spinner" />
              ) : (
                <MapPin size={19} />
              )}
            </span>

            <div className="create-room-location-copy">
              <strong>
                {locationStatus === "loading"
                  ? "Getting your location..."
                  : locationStatus === "success"
                    ? "Location ready"
                    : "Location unavailable"}
              </strong>

              <span>
                {locationStatus === "loading"
                  ? "Please allow location access in your browser."
                  : locationStatus === "success"
                    ? "Your current location will be used for this room."
                    : "Check browser permissions and try again."}
              </span>
            </div>

            {locationStatus === "success" && (
              <LocateFixed size={18} className="create-room-location-check" />
            )}
          </div>

          <div className="create-room-actions">
            <button
              type="button"
              onClick={onClose}
              className="create-room-cancel"
              disabled={isSubmitting}
            >
              Cancel
            </button>

            <button
              type="submit"
              className="create-room-submit"
              disabled={isSubmitting || !location}
            >
              {isSubmitting ? (
                <>
                  <LoaderCircle size={17} className="create-room-spinner" />
                  Creating...
                </>
              ) : (
                <>
                  Create room
                  <Sparkles size={16} />
                </>
              )}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default CreateRoomModal;