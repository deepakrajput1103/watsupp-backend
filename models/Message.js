// backend/models/Message.js
import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  msg_id: { type: String, index: true },
  wa_id: { type: String, required: true },
  name: String,
  from: String,
  to: String,
  text: String,
  media: Object,
  timestamp: { type: Date, default: Date.now },
  status: { type: String, enum: ['sent','delivered','read','pending','failed'], default: 'sent' },
  direction: { type: String, enum: ['in','out'], default: 'in' },
  raw: Object
}, { timestamps: true });

export default mongoose.model('Message', MessageSchema);
