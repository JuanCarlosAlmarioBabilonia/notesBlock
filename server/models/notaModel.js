import mongoose from 'mongoose';

const { Schema } = mongoose;

const CambioSchema = new Schema({
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  fecha: {
    type: String, 
    required: true
  }
}, { _id: false }); 

const NotaSchema = new Schema({
  id_usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true 
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  descripcion: {
    type: String,
    required: true,
    trim: true
  },
  cambios: [CambioSchema], 
  estado: {
    type: String,
    enum: ['Visible', 'No visible'], 
    default: 'Visible' 
  }
}, { 
  collection: "nota",
  versionKey: false, 
  timestamps: false 
}); 

const Nota = mongoose.model('Nota', NotaSchema);

export default Nota;