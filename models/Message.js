import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    userId: { 
        type: String, 
        required: true 
    },
    role: {
        type: String, 
        enum: ["user", "bot", "model"], 
        required: true 
    },
    content: { 
        type: String, 
        required: true 
    },
  },
  { timestamps: true }
);

export const Message = mongoose.model("Message", messageSchema);
