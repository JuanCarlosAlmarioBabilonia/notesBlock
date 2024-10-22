import mongoose from 'mongoose';

const { Schema } = mongoose;

const NotaSchema = new Schema({
  id_usuario: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
  },
  titulo: {
    type: String,
    required: true,
    trim: true
  },
  contenido: {
    type: String,
    required: true,
    trim: true
  },
  fecha_creacion: {
    type: String, 
    required: true
  }
}, { 
    collection: "nota",
    versionKey: false, 
    timestamps: true 
}); 

const Nota = mongoose.model('Nota', NotaSchema);

export default Nota;