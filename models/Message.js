import mongoose from 'mongoose';

const MessageSchema = new mongoose.Schema({
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  content: {
    type: String,
    required: [true, 'Message content is required'],
    trim: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true
  },
  readBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true });

// Add indexes for faster queries
MessageSchema.index({ projectId: 1, createdAt: -1 });
MessageSchema.index({ sender: 1 });

// Check if the model already exists to prevent overwrite during hot reloads
const Message = mongoose.models.Message || mongoose.model('Message', MessageSchema);

export default Message; 