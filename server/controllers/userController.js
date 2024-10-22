import User from '../models/userModel.js'; 

export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({message: "Lista de usuarios obtenidos", data: user}); 
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error al obtener usuarios' });
  }
};
