import Nota from '../models/notaModel.js'; 
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export const getAllNotas = async (req, res) => {
  try {
    // Extrae el ID del usuario desde la sesión o el token
    console.log('Session data:', req.session); // Verifica los datos de sesión
    
    const id_usuario = req.userId; 
    console.log('ID del usuario:', id_usuario); // Log del ID del usuario

    if (!id_usuario) {
      return res.status(401).json({ message: "El usuario no está autenticado" });
    }

    // Realiza la agregación en la colección de notas
    const notas = await Nota.aggregate([
      {
        $match: {
          estado: "Visible",
          id_usuario: new ObjectId(id_usuario) // Filtra por el ID del usuario
        }
      },
      {
        $addFields: {
          fecha: {
            $cond: {
              if: { $not: ["$fecha"] },
              then: {
                $dateToString: {
                  format: "%d/%m/%Y",
                  date: { $toDate: "$_id" }
                }
              },
              else: "$fecha"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          result: {
            $cond: {
              if: { $gte: [{ $size: "$cambios" }, 1] },
              then: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$cambios", -1] }] },
              else: "$$ROOT"
            }
          }
        }
      },
      {
        $replaceRoot: { newRoot: "$result" }
      },
      {
        $project: {
          cambios: 0,
          id_usuario: 0,
          estado: 0,
          contenido: 0
        }
      }
    ]);

    res.status(200).json({ message: "Lista de notas obtenidas", data: notas });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener notas", error: error.message });
  }
};


export const getNotaById = async (req, res) => {
  try {
    console.log('Session data:', req.session); // Verifica los datos de sesión
    
    const id_usuario = req.userId; 
    console.log('ID del usuario:', id_usuario); // Log del ID del usuario

    if (!id_usuario) {
      return res.status(401).json({ message: "El usuario no está autenticado" });
    }

    const { id } = req.params; // Extrae el ID de la nota desde los parámetros

    if (!id) {
      return res.status(400).json({ message: "El ID de la nota es requerido" });
    }

    // Busca la nota por ID y filtra por el ID del usuario
    const notas = await Nota.aggregate([
      {
        $match: {
          _id: new ObjectId(id), // Filtra por el ID de la nota
          estado: "Visible",
          id_usuario: new ObjectId(id_usuario) // Filtra por el ID del usuario
        }
      },
      {
        $addFields: {
          fecha: {
            $cond: {
              if: { $not: ["$fecha"] },
              then: {
                $dateToString: {
                  format: "%d/%m/%Y",
                  date: { $toDate: "$_id" }
                }
              },
              else: "$fecha"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          result: {
            $cond: {
              if: { $gte: [{ $size: "$cambios" }, 1] },
              then: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$cambios", -1] }] },
              else: "$$ROOT"
            }
          }
        }
      },
      {
        $replaceRoot: { newRoot: "$result" }
      },
      {
        $project: {
          cambios: 0,
          id_usuario: 0,
          estado: 0,
          contenido: 0
        }
      }
    ]);

    // Verifica si se encontró la nota
    if (notas.length === 0) {
      return res.status(404).json({ message: "Nota no encontrada o no tienes acceso" });
    }

    res.status(200).json({ message: "Nota obtenida", data: notas[0] }); // Retorna solo la primera nota encontrada
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la nota", error: error.message });
  }
};

export const getNotaByTituloOrDescripcion = async (req, res) => {
  try {
    const id_usuario = req.userId; // Obtener el ID del usuario desde el token o sesión

    if (!id_usuario) {
      return res.status(401).json({ message: "El usuario no está autenticado" });
    }

    const { busqueda } = req.params;
    if (!busqueda) {
      return res.status(400).json({ message: "El término de búsqueda es requerido" });
    }

    const normalizedSearchTerm = removeAccents(busqueda.toLowerCase().trim());
    console.log(`Término de búsqueda normalizado: ${normalizedSearchTerm}`);

    const notas = await Nota.aggregate([
      {
        $match: {
          estado: "Visible",
          id_usuario: new ObjectId(id_usuario), // Filtra por el ID del usuario
          $or: [
            { titulo: { $regex: normalizedSearchTerm, $options: "i" } }, // Busca en el título
            { descripcion: { $regex: normalizedSearchTerm, $options: "i" } } // Busca en la descripción
          ]
        }
      },
      {
        $addFields: {
          fecha: {
            $cond: {
              if: { $not: ["$fecha"] },
              then: {
                $dateToString: {
                  format: "%d/%m/%Y",
                  date: { $toDate: "$_id" }
                }
              },
              else: "$fecha"
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          result: {
            $cond: {
              if: { $gte: [{ $size: "$cambios" }, 1] },
              then: { $mergeObjects: ["$$ROOT", { $arrayElemAt: ["$cambios", -1] }] },
              else: "$$ROOT"
            }
          }
        }
      },
      {
        $replaceRoot: { newRoot: "$result" }
      },
      {
        $project: {
          cambios: 0,
          id_usuario: 0,
          estado: 0,
          contenido: 0
        }
      }
    ]);

    if (notas.length === 0) {
      return res.status(404).json({ message: "No se encontraron notas con ese término" });
    }

    res.status(200).json({ message: "Notas encontradas", data: notas });
  } catch (error) {
    res.status(500).json({ message: "Error al buscar las notas", error: error.message });
  }
};

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}


export const createNota = async (req, res) => {
  const id_usuario = req.userId; 

  if (!id_usuario) {
    return res.status(401).json({ message: "El usuario no está autenticado" });
  }

  const { titulo, descripcion } = req.body;

  const nuevaNota = new Nota({
    id_usuario,
    titulo,
    descripcion,
    cambios: [],
    estado: "Visible" 
  });

  try {
    const notaGuardada = await nuevaNota.save();
    res.status(201).json({ message: "Nota creada", data: notaGuardada });
  } catch (error) {
    res.status(400).json({ message: "Error al crear la nota", error: error.message });
  }
};



export const deleteNota = async (req, res) => {
  try {
    const id_usuario = req.userId; // Obtener el ID del usuario desde el token o sesión

    if (!id_usuario) {
      return res.status(401).json({ message: "El usuario no está autenticado" });
    }

    const { id } = req.params; // Obtener el ID de la nota desde los parámetros

    // Verificar si la nota pertenece al usuario
    const nota = await Nota.findOne({ _id: id, id_usuario: id_usuario });

    if (!nota) {
      return res.status(403).json({ message: "Acceso denegado: No tienes permiso para eliminar esta nota" });
    }

    // Cambiar el estado de la nota a "No visible"
    const notaActualizada = await Nota.findByIdAndUpdate(
      id,
      { estado: "No visible" }, 
      { new: true } 
    );

    if (!notaActualizada) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    res.status(200).json({ message: "Estado de la nota cambiado a 'No visible'", data: notaActualizada });
  } catch (error) {
    res.status(500).json({ message: "Error al cambiar el estado de la nota", error: error.message });
  }
};

export const updateNota = async (req, res) => {
  const { titulo, descripcion } = req.body;

  try {
    const notaExistente = await Nota.findById(req.params.id);

    if (!notaExistente) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    // Usa el último cambio del array de cambios como referencia
    const ultimoCambio = notaExistente.cambios[notaExistente.cambios.length - 1] || {
      titulo: notaExistente.titulo,
      descripcion: notaExistente.descripcion,
    };

    // Verifica si hay un cambio en título o descripción
    if ((titulo && ultimoCambio.titulo !== titulo) || (descripcion && ultimoCambio.descripcion !== descripcion)) {
      // Crea un solo cambio con los nuevos valores o los valores actuales si no se modificaron
      const nuevoCambio = {
        titulo: titulo || ultimoCambio.titulo,
        descripcion: descripcion || ultimoCambio.descripcion,
        fecha: formatDate(new Date()), // Guarda la fecha en formato dd/mm/aaaa
      };

      // Agrega el nuevo cambio al array "cambios" de la nota existente
      notaExistente.cambios.push(nuevoCambio);
    } else {
      return res.status(400).json({ message: "No se encontraron cambios para registrar" });
    }

    // Guarda la nota sin modificar el título y descripción principales
    await notaExistente.save();

    res.status(200).json({ message: "Nota actualizada con cambios registrados", data: notaExistente });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar la nota", error: error.message });
  }
};

// Función para formatear la fecha a dd/mm/aaaa
const formatDate = (date) => {
    const day = String(date.getDate()).padStart(2, '0'); // Obtener el día con dos dígitos
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Obtener el mes (recuerda que los meses empiezan en 0)
    const year = date.getFullYear(); // Obtener el año
    return `${day}/${month}/${year}`; // Retornar la fecha en formato dd/mm/aaaa
};







