import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "ChatRoom",
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },

  type: {
    type: String,
    enum: ["text", "image", "file", "emoji", "poll"],
    default: "text"
  },

  content: {
    type: String // text / emoji / image url / file url
  },

  fileName: String,   // for documents
  fileSize: Number,

  poll: {
    question: String,
    options: [
      {
        option: String,
        votes: [mongoose.Schema.Types.ObjectId]
      }
    ]
  }

}, { timestamps: true });


export default mongoose.model("Message", messageSchema);
