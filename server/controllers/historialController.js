import Historial from '../models/historialModel.js'; 

export const getAllHistoriales = async (req, res) => {
  try {
    const historial = await Historial.find(); 
    res.status(200).json({ message: "Lista de historiales obtenidos", data: historial });
  } catch (error) {
    let err = JSON.parse(error.message);
    return res.status(err.status).json(err);
  }
};

