const mongoose = require('mongoose');

const chatSchema = mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  messages: [
    {
      messageId: {
        type: String,
        default: () => new mongoose.Types.ObjectId().toString()
      },
      sender: {
        type: String,
        enum: ['user', 'admin'],
        required: true
      },
      senderName: {
        type: String,
        required: true
      },
      message: {
        type: String,
        required: true,
        trim: true
      },
      timestamp: {
        type: Date,
        default: Date.now
      },
      isRead: {
        type: Boolean,
        default: false
      },
      attachments: [
        {
          type: String,
          url: String,
          filename: String
        }
      ]
    }
  ],
  status: {
    type: String,
    enum: ['active', 'closed', 'pending'],
    default: 'active'
  },
  subject: {
    type: String,
    default: 'Support Chat'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  assignedAdmin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  unreadCount: {
    user: { type: Number, default: 0 },
    admin: { type: Number, default: 0 }
  }
}, {
  timestamps: true
});

// Update lastActivity when new message is added
chatSchema.pre('save', function(next) {
  this.lastActivity = new Date();
  next();
});

// Index for better performance
chatSchema.index({ userId: 1, lastActivity: -1 });
chatSchema.index({ status: 1, lastActivity: -1 });
chatSchema.index({ 'messages.timestamp': -1 });

module.exports = mongoose.model('Chat', chatSchema);
