import User from '../models/userModel.js'; 
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'; 

export const getAllUsers = async (req, res) => {
  try {
    const user = await User.find();
    res.status(200).json({message: "Lista de usuarios obtenidos", data: user}); 
  } catch (error) {
    let err = JSON.parse(error.message);
    return res.status(err.status).json(err);
  }
};

export const createUser = async (req, res) => {
  const { nombre, apellido, email, username, password, rol } = req.body;

  try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const nuevaUsuario = new User({
          nombre,
          apellido,
          email,
          username,
          password: hashedPassword,
          rol
      });

      const usuarioGuardado = await nuevaUsuario.save();
      const SECRET_KEY = process.env.JWT_SECRET; 
      
      // Generar el token aquí
      const token = jwt.sign({ userId: usuarioGuardado._id, rol: usuarioGuardado.rol }, SECRET_KEY, { expiresIn: 18000000 });
      console.log('Token generado:', token); // Para depuración

      req.session.auth = { id: usuarioGuardado._id, token }; 
      res.status(201).json({ 
          message: "Usuario creado", 
          data: { 
              _id: usuarioGuardado._id, 
              nombre: usuarioGuardado.nombre,
          },
          token 
      });
  } catch (error) {
      res.status(500).json({ message: "Error al crear el usuario", error: error.message });
  }
};


