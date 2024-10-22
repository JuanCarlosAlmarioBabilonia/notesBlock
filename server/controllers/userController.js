import User from '../models/userModel.js'; 

export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({message: "Lista de usuarios obtenidos", data: user}); 
  } catch (error) {
    let err = JSON.parse(error.message);
    return res.status(err.status).json(err);
  }
};
