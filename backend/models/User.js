const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/* =========================
   ADDRESS SCHEMA
========================= */
const addressSchema = new mongoose.Schema(
  {
    label: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    zipCode: {
      type: String,
      trim: true,
    },
    country: {
      type: String,
      default: 'Nigeria',
      trim: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: true }
);

/* =========================
   USER SCHEMA
========================= */
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
    },
    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    phone: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false,
    },
    addresses: {
      type: [addressSchema],
      default: [],
    },
    role: {
      type: String,
      enum: ['customer', 'admin'],
      default: 'customer',
      immutable: true, // prevents role changes by update
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   PASSWORD HASHING
========================= */
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

/* =========================
   METHODS
========================= */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Hide sensitive fields
userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

/* =========================
   MODEL EXPORT
========================= */
module.exports =
  mongoose.models.User || mongoose.model('User', userSchema);