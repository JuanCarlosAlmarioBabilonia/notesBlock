import mongoose from 'mongoose';

const historialSchema = new mongoose.Schema({
  id_usuario: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User' 
  },
  accion: {
    type: String,
    required: true,
  },
  fecha: {
    type: String, 
    required: true,
  }
},{ 
    collection: "historial",
    versionKey: false, 
    timestamps: true 
});  

const Historial = mongoose.model('Historial', historialSchema);

export default Historial;
