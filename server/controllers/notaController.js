import Nota from '../models/notaModel.js'; // Asegúrate de usar la ruta correcta al modelo Nota

export const getAllNotas = async (req, res) => {
  try {
    const notas = await Nota.find(); 
    res.status(200).json({ message: "Lista de notas obtenidas", data: notas });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener notas' });
  }
};

