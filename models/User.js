import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    select: false,
  },
  image: {
    type: String,
    default: '',
  },
  bio: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  skills: {
    type: [String],
    default: [],
  },
  links: {
    github: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    portfolio: { type: String, default: '' },
    twitter: { type: String, default: '' },
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
  }],
  accountType: {
    type: String,
    enum: ['oauth', 'credentials'],
    default: 'credentials',
  },
  oauthProvider: {
    type: String,
    enum: ['google', 'github', ''],
    default: '',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password') || !this.password) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
UserSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error(error);
  }
};

// Check if the model already exists to prevent overwrite during hot reloads
const User = mongoose.models.User || mongoose.model('User', UserSchema);

export default User; 