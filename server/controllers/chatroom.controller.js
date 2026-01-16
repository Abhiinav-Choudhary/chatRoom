import ChatRoom from "../models/ChatRoom.js";
import Message from "../models/message.model.js"; // if messages stored in DB
import  {io}  from "../socket/socket.js";

export const createRoom = async (req, res) => {
  try {
    const { name, latitude, longitude, radius } = req.body;

    // 1. Basic validation
    if (
  !name ||
  latitude === undefined ||
  longitude === undefined ||
  radius === undefined
) {
  return res.status(400).json({ message: "All fields are required" });
}

    // 2. Create chatroom
    const room = await ChatRoom.create({
      name,
      createdBy: req.user._id,
      location: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      radius
    });

    // 3. Respond
    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: "Failed to create room" });
  }
};

export const closeRoom = async (req, res) => {
  try {
    const { roomId } = req.params;
    const userId = req.user._id;

    // 1️⃣ Find room
    const room = await ChatRoom.findById(roomId);
    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    // 2️⃣ Owner check
    if (room.createdBy.toString() !== userId.toString()) {
      return res.status(403).json({ message: "Only owner can close the room" });
    }

    // 3️⃣ Notify users FIRST
    io.to(roomId).emit("room_closed", {
      roomId,
      message: "Room has been closed by the owner"
    });

    // 4️⃣ Remove all sockets from room
    io.in(roomId).socketsLeave(roomId);

    // 5️⃣ Delete messages
    await Message.deleteMany({ roomId: room._id });

    // 6️⃣ Delete room
    await ChatRoom.findByIdAndDelete(roomId);

    res.json({ message: "Room deleted successfully" });

  } catch (error) {
    console.error("CLOSE ROOM ERROR:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getChatRoomById = async (req, res) => {
  try {
    const { roomId } = req.params;

    const room = await ChatRoom.findById(roomId);

    if (!room) {
      return res.status(404).json({ message: "Room not found" });
    }

    res.json(room);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch room" });
  }
};



export const getNearbyRooms = async (req, res) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        message: "Latitude and longitude are required"
      });
    }

    const lat = parseFloat(latitude);
    const lng = parseFloat(longitude);

    const rooms = await ChatRoom.aggregate([
      {
        $geoNear: {
          near: {
            type: "Point",
            coordinates: [lng, lat]
          },
          distanceField: "distance",
          spherical: true
        }
      },
      {
        $match: {
          isActive: true,
          $expr: {
            $lte: ["$distance", "$radius"]
          }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "createdBy",
          foreignField: "_id",
          as: "createdBy"
        }
      },
      { $unwind: "$createdBy" },
      {
        $project: {
          name: 1,
          radius: 1,
          distance: { $round: ["$distance", 0] },
          createdBy: {
            _id: 1,
            username: 1
          }
        }
      },
      {
        $sort: { distance: 1 }
      }
    ]);

    res.json(rooms);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch nearby rooms"
    });
  }
};