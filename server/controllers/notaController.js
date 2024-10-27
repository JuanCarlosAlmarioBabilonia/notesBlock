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
    const { id } = req.params; 

    if (!id) {
      return res.status(400).json({ message: "El ID de la nota es requerido" });
    }

    const nota = await Nota.findById(id);

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
  const { titulo, descripcion } = req.body;

  try {
      const notaExistente = await Nota.findById(req.params.id);

      if (!notaExistente) {
          return res.status(404).json({ message: "Nota no encontrada" });
      }

      // Inicializa un array para los cambios
      let cambios = [];
      let cambiosRealizados = false; // Para rastrear si se realizaron cambios

      // Verifica si hay un nuevo título y si es diferente al actual
      if (titulo && notaExistente.titulo !== titulo) {
          cambios.push({
              titulo: titulo, // Nuevo título proporcionado
              descripcion: notaExistente.descripcion, // Descripción original
              fecha: formatDate(new Date()), // Guarda la fecha en formato dd/mm/aaaa
          });
          cambiosRealizados = true; // Indica que se realizó un cambio
      }

      // Verifica si hay una nueva descripción y si es diferente a la actual
      if (descripcion && notaExistente.descripcion !== descripcion) {
          cambios.push({
              titulo: notaExistente.titulo, // Título original
              descripcion: descripcion, // Nueva descripción proporcionada
              fecha: formatDate(new Date()), // Guarda la fecha en formato dd/mm/aaaa
          });
          cambiosRealizados = true; // Indica que se realizó un cambio
      }

      // Si no hay cambios, devuelve un error
      if (!cambiosRealizados) {
          return res.status(400).json({ message: "No se encontraron cambios para registrar" });
      }

      // Agrega los cambios al array "cambios" de la nota existente
      notaExistente.cambios.push(...cambios);

      // Actualiza los campos de la nota existente
      notaExistente.titulo = titulo || notaExistente.titulo; // Actualiza solo si hay un nuevo título
      notaExistente.descripcion = descripcion || notaExistente.descripcion; // Actualiza solo si hay una nueva descripción

      // Guarda la nota para que se almacenen los cambios
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







