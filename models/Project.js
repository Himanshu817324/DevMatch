import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a task title'],
    trim: true,
  },
  description: {
    type: String,
    default: '',
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'review', 'completed'],
    default: 'todo',
  },
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

const ProjectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a project title'],
    trim: true,
  },
  description: {
    type: String,
    required: [true, 'Please provide a project description'],
  },
  thumbnail: {
    type: String,
    default: '',
  },
  requiredSkills: {
    type: [String],
    default: [],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    role: {
      type: String,
      enum: ['owner', 'admin', 'member'],
      default: 'member',
    },
    joinedAt: {
      type: Date,
      default: Date.now,
    },
  }],
  tasks: [TaskSchema],
  status: {
    type: String,
    enum: ['planning', 'in-progress', 'completed', 'on-hold'],
    default: 'planning',
  },
  repoLink: {
    type: String,
    default: '',
  },
  demoLink: {
    type: String,
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Pre-save hook to make sure the owner is also a member with 'owner' role
ProjectSchema.pre('save', function (next) {
  if (this.isNew) {
    // Check if the owner is not already in members list
    const isOwnerMember = this.members.some(member =>
      member.user.toString() === this.owner.toString()
    );

    if (!isOwnerMember) {
      this.members.push({
        user: this.owner,
        role: 'owner',
        joinedAt: new Date(),
      });
    }
  }
  next();
});

// Check if the model already exists to prevent overwrite during hot reloads
const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

export default Project; 