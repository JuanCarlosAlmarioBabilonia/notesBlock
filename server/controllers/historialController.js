import Historial from '../models/historialModel.js'; // Asegúrate de usar la ruta correcta al modelo Nota

export const getAllHistoriales = async (req, res) => {
  try {
    const historial = await Historial.find(); 
    res.status(200).json({ message: "Lista de historiales obtenidos", data: historial });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener historiales' });
  }
};

