import Nota from '../models/notaModel.js'; 

export const getAllNotas = async (req, res) => {
  try {
    const notas = await Nota.find(); 
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

export const getNotaByTitulo = async (req, res) => {
  try {
    const { titulo } = req.params; 
    if (!titulo) {
      return res.status(400).json({ message: "Título es requerido para la búsqueda" });
    }

    const normalizedSearchTitle = removeAccents(titulo.toLowerCase());

    const notas = await Nota.find();

    const filteredNotas = notas.filter(nota => 
      removeAccents(nota.titulo.toLowerCase()).includes(normalizedSearchTitle)
    );

    if (filteredNotas.length === 0) {
      return res.status(404).json({ message: "No se encontraron notas con ese título" });
    }
    
    res.status(200).json({ message: "Notas encontradas", data: filteredNotas });
  } catch (error) {
    res.status(500).json({ message: "Error al buscar la nota", error: error.message });
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




