
import mongoose from "mongoose";

const chatRoomSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    location: {
      type: {
        type: String,
        enum: ["Point"],
        required: true,
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },

    radius: {
      type: Number,
      required: true,
    },

    // null means unlimited members
    maxMembers: {
      type: Number,
      default: null,
      min: 1,
      validate: {
        validator: (value) =>
          value === null ||
          value === undefined ||
          (Number.isInteger(value) && value >= 1),
        message: "Room limit must be a positive integer.",
      },
    },

    isActive: {
      type: Boolean,
      default: true,
    },
    bannedUsers: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
],
  },
  { timestamps: true }
);

// Geo index
chatRoomSchema.index({ location: "2dsphere" });

export default mongoose.model("ChatRoom", chatRoomSchema);
