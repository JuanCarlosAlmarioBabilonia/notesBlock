import Nota from '../models/notaModel.js'; 
import mongoose from 'mongoose';
const ObjectId = mongoose.Types.ObjectId;

export const getAllNotas = async (req, res) => {
  try {
    const { id_usuario } = req.params; // Obtener el ID del usuario desde los parámetros de la solicitud

    if (!id_usuario) {
      return res.status(400).json({ message: "El ID del usuario es requerido" });
    }

    const notas = await Nota.aggregate([
      {
        $match: {
          estado: "Visible",
          id_usuario: new ObjectId(id_usuario) // Usar el ID de usuario
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
          id_usuario:0,
          estado:0,
          contenido:0, 
        }
      },
      {
        $addFields: {
          date: {
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
          date: 0 
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
    const nota = await Nota.findById(req.params.id); 
    if (!nota) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }
    res.status(200).json({ message: "Nota obtenida", data: nota });
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la nota", error: error.message });
  }
};

export const getNotaByTituloOrDescripcion = async (req, res) => {
  try {
    const { busqueda } = req.params;
    if (!busqueda) {
      return res.status(400).json({ message: "El término de búsqueda es requerido" });
    }

    const normalizedSearchTerm = removeAccents(busqueda.toLowerCase().trim());
    console.log(`Término de búsqueda normalizado: ${normalizedSearchTerm}`);

    const notas = await Nota.find();
    console.log(`Notas en la base de datos: ${JSON.stringify(notas)}`); // Imprimir todas las notas

    const filteredNotas = notas.filter(nota => {
      const titulo = nota.titulo ? removeAccents(nota.titulo.toLowerCase().trim()) : '';
      const descripcion = nota.descripcion ? removeAccents(nota.descripcion.toLowerCase().trim()) : '';
      
      // Buscar en los cambios
      const cambiosContienenTermino = nota.cambios && nota.cambios.some(cambio => {
        const cambioTitulo = cambio.titulo ? removeAccents(cambio.titulo.toLowerCase().trim()) : '';
        const cambioDescripcion = cambio.descripcion ? removeAccents(cambio.descripcion.toLowerCase().trim()) : '';
        return cambioTitulo.includes(normalizedSearchTerm) || cambioDescripcion.includes(normalizedSearchTerm);
      });

      console.log(`Buscando en - Título: ${titulo}, Descripción: ${descripcion}, Cambios contienen término: ${cambiosContienenTermino}`);

      return titulo.includes(normalizedSearchTerm) || descripcion.includes(normalizedSearchTerm) || cambiosContienenTermino;
    });

    if (filteredNotas.length === 0) {
      return res.status(404).json({ message: "No se encontraron notas con ese término" });
    }

    res.status(200).json({ message: "Notas encontradas", data: filteredNotas });
  } catch (error) {
    res.status(500).json({ message: "Error al buscar las notas", error: error.message });
  }
};

function removeAccents(str) {
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}






export const createNota = async (req, res) => {
  const { id_usuario, titulo, contenido, cambios, estado } = req.body;
  
  const nuevaNota = new Nota({
    id_usuario,
    titulo,
    contenido,
    cambios,
    estado
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
    const notaActualizada = await Nota.findByIdAndUpdate(
      req.params.id,
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
  const { titulo, contenido, cambios, estado } = req.body;

  const updates = {};
  const updatedFields = {}; 

  if (titulo) updates.titulo = titulo;
  if (contenido) updates.contenido = contenido;
  if (cambios) updates.cambios = cambios;
  if (estado) updates.estado = estado;

  try {
    const notaExistente = await Nota.findById(req.params.id);

    if (!notaExistente) {
      return res.status(404).json({ message: "Nota no encontrada" });
    }

    if (titulo && notaExistente.titulo !== titulo) updatedFields.titulo = titulo;
    if (contenido && notaExistente.contenido !== contenido) updatedFields.contenido = contenido;
    if (cambios && JSON.stringify(notaExistente.cambios) !== JSON.stringify(cambios)) updatedFields.cambios = cambios;
    if (estado && notaExistente.estado !== estado) updatedFields.estado = estado;

    if (Object.keys(updatedFields).length === 0) {
      return res.status(400).json({ message: "No se encontraron cambios para actualizar" });
    }
    await Nota.findByIdAndUpdate(req.params.id, updates, { new: true });

    res.status(200).json({ message: "Nota actualizada", data: updatedFields });
  } catch (error) {
    res.status(400).json({ message: "Error al actualizar la nota", error: error.message });
  }
};




