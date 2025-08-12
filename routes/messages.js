// backend/routes/messages.js
import express from 'express';
import Message from '../models/Message.js';

const router = express.Router();

/**
 * conversations - grouped by wa_id with last message
 */
router.get('/conversations', async (req, res) => {
  try {
    const convs = await Message.aggregate([
      { $sort: { timestamp: -1 } },
      { $group: {
          _id: '$wa_id',
          name: { $first: '$name' },
          lastMessage: { $first: '$text' },
          lastMsgId: { $first: '$msg_id' },
          lastTime: { $first: '$timestamp' },
          lastStatus: { $first: '$status' },
          count: { $sum: 1 }
        }
      },
      { $sort: { lastTime: -1 } }
    ]);
    res.json({ success: true, convs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * messages for a conversation
 */
router.get('/conversations/:wa_id/messages', async (req, res) => {
  try {
    const { wa_id } = req.params;
    const msgs = await Message.find({ wa_id }).sort({ timestamp: 1 });
    res.json({ success: true, msgs });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

/**
 * send (store outgoing) - demo
 */
router.post('/messages/send', async (req, res) => {
  try {
    const { wa_id, name, message } = req.body;
    if (!wa_id || !message) return res.status(400).json({ success: false, message: 'wa_id and message required' });

    const msg = new Message({
      msg_id: `local_${Date.now()}`,
      wa_id,
      name: name || wa_id,
      from: 'me',
      to: wa_id,
      text: message,
      direction: 'out',
      status: 'sent',
      timestamp: new Date()
    });

    await msg.save();
    res.json({ success: true, msg });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

export default router;
