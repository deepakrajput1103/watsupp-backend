// backend/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/mongodb.js';
import messageRoutes from './routes/messages.js';

dotenv.config();
const app = express();
app.use(express.json());

// allow frontend
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true
}));

// connect DB
connectDB(process.env.MONGO_URI);

// api routes
app.use('/api', messageRoutes);

app.get('/', (req, res) => res.send('WhatsApp clone backend is running'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
