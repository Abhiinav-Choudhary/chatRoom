import React, { createContext, useContext, useState } from "react";
import {
  createChatRoom,
  closeChatRoom,
  joinChatRoom,
  getMyRooms,
  getNearbyRooms
} from "../api/chat.api";

const ChatContext = createContext(null);

export const ChatProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


const getNearRooms = async ({ latitude, longitude }) => {
  setLoading(true);
  try {
    const res = await getNearbyRooms({ latitude, longitude });
    return res.data;
  } finally {
    setLoading(false);
  }
};


  /* =====================
     CREATE ROOM
  ===================== */
  const createRoom = async (data) => {
    try {
      setLoading(true);
      setError(null);

      const res = await createChatRoom(data);

      // optional: auto add room to state
      setRooms((prev) => [...prev, res.data]);

      return res.data; // useful for redirect / socket join
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create room");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     CLOSE ROOM
  ===================== */
  const closeRoom = async (roomId) => {
    try {
      setLoading(true);
      setError(null);

      await closeChatRoom(roomId);

      setRooms((prev) =>
        prev.filter((room) => room._id !== roomId)
      );
    } catch (err) {
      setError(err.response?.data?.message || "Failed to close room");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     GET MY ROOMS (future)
  ===================== */
  const fetchMyRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getMyRooms();
      setRooms(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load rooms");
    } finally {
      setLoading(false);
    }
  };

  /* =====================
     JOIN ROOM (future)
  ===================== */
  const joinRoom = async (roomId) => {
    try {
      setLoading(true);
      setError(null);

      await joinChatRoom(roomId);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to join room");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        rooms,
        loading,
        error,
        createRoom,
        closeRoom,
        joinRoom,
        fetchMyRooms,
        getNearRooms
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

/* =====================
   CUSTOM HOOK
===================== */
export const useChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within ChatProvider");
  }
  return context;
};
