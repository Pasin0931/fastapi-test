// models/User.js
import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
})

// Prevent model overwrite error in development
export const User = mongoose.models.User || mongoose.model('User', UserSchema)
