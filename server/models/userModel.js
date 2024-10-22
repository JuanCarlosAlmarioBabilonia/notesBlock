// models/User.js
import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true,
  },
  apellido: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true, 
    lowercase: true, 
  },
  username: {
    type: String,
    required: true,
    unique: true, 
  },
  password: {
    type: String,
    required: true,
  },
  rol: {
    type: String,
    enum: ['Usuario', 'Admin'], 
    default: 'Usuario', 
  },
}, { 
    collection: "usuario",
    versionKey: false, 
    timestamps: true 
}); 

const User = mongoose.model('User', UserSchema);

export default User;
