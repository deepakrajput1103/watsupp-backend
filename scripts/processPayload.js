// backend/scripts/processPayload.js
import fs from "fs";
import path from "path";
import connectDB from "../config/mongodb.js";
import Message from "../models/Message.js";

const payloadDir = path.join(process.cwd(), "payloads");

// Ensure folder exists
if (!fs.existsSync(payloadDir)) {
  fs.mkdirSync(payloadDir, { recursive: true });
  console.log(`📂 Created missing folder: ${payloadDir}`);
}

async function processPayloads() {
  await connectDB();

  const files = fs.readdirSync(payloadDir);
  
  for (const file of files) {
    if (file.endsWith(".json")) {
      const filePath = path.join(payloadDir, file);
      const rawData = fs.readFileSync(filePath, "utf-8");
      const payload = JSON.parse(rawData);

      const contact = payload.metaData.entry[0].changes[0].value.contacts?.[0]; // moved here ✅

      if (payload.payload_type === "whatsapp_webhook") {
        const messageData = payload.metaData.entry[0].changes[0].value.messages?.[0];
        if (messageData) {
          await Message.create({
            wa_id: contact?.wa_id || messageData.from, // fallback to 'from'
            msg_id: messageData.id,
            from: messageData.from,
            text: messageData.text?.body || "",
            timestamp: messageData.timestamp,
            status: "sent"
          });
        }
      }
    }
  }

  console.log("✅ All payloads processed");
  process.exit(0);
}

processPayloads();
