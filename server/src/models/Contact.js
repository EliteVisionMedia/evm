const mongoose = require('mongoose');
const { isValidPhone } = require('../utils/validators');

const contactSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: [true, 'First name is required'], trim: true, maxlength: 60 },
    lastName: { type: String, required: [true, 'Last name is required'], trim: true, maxlength: 60 },
    location: { type: String, required: [true, 'Location is required'], trim: true, maxlength: 120 },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
      maxlength: 254,
      match: [/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, 'Email is invalid'],
    },
    phone: {
      type: String,
      required: [true, 'Phone number is required'],
      trim: true,
      validate: { validator: isValidPhone, message: 'Phone number is invalid' },
    },
    services: {
      type: [{ type: String, trim: true, maxlength: 80 }],
      required: true,
      validate: { validator: (v) => Array.isArray(v) && v.length > 0, message: 'Select at least one service' },
    },
    message: { type: String, trim: true, default: '', maxlength: 5000 },
    // CRM fields. `status` is the lead status (kept under its existing name for older records).
    status: { type: String, enum: ['New', 'Contacted', 'In Progress', 'Converted', 'Closed'], default: 'New' },
    assigned: { type: String, trim: true, maxlength: 80, default: 'Not Assigned' },
    followUp: { type: String, enum: ['Pending', 'Scheduled', 'Done'], default: 'Pending' },
    emailSent: { type: Boolean, default: false },
  },
  { timestamps: true, versionKey: false },
);

contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1 });

module.exports = mongoose.model('Contact', contactSchema);
