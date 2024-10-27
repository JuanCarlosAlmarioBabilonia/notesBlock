import bcrypt from 'bcrypt';
import User from '../models/userModel.js'; 
import jwt from 'jsonwebtoken'; 

export const logoutUser = (req, res) => {
    if (!req.session.auth) {
      return res.status(401).json({ message: "No estás autenticado" });
    }
  
    req.session.destroy(err => {
      if (err) {
        return res.status(500).json({ message: "Error al cerrar sesión", error: err.message });
      }  
      res.status(200).json({ message: "Sesión cerrada correctamente" });
    });
  };

  export const loginUser = async (req, res) => {
    const { username, password } = req.body;

    // Verifica si el usuario ya está autenticado
    if (req.session.auth) {
        return res.status(400).json({ message: "Ya estás logueado" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ message: "Username no encontrado" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        const SECRET_KEY = process.env.JWT_SECRET;
        const token = jwt.sign({ userId: user._id, rol: user.rol }, SECRET_KEY, { expiresIn: 18000000 });

        // Guarda el ID del usuario en la sesión
        req.session.auth = {
            id: user._id,
            token: token
        };

        res.status(200).json({ 
            message: "Inicio de sesión exitoso", 
            _id: user._id, 
            username: user.username, 
            token 
        });
    } catch (error) {
        res.status(500).json({ message: "Error al iniciar sesión", error: error.message });
    }
};

  