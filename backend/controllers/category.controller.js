const Categorias = require('../models/Categorias');
const { Op } = require('sequelize');

const getCategories = async (req, res) => {
  try {
    const categorias = await Categorias.findAll({
      where: {
        [Op.or]: [
          { owner_user_id: null },
          { owner_user_id: req.user.id }
        ]
      },
      order: [['id', 'ASC']]
    });

    return res.status(200).json(categorias);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener categorías',
      error: error.message,
    });
  }
};

const createCategory = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        message: 'El nombre de la categoría es obligatorio',
      });
    }

    const nuevaCategoria = await Categorias.create({
      name: name.trim(),
      owner_user_id: req.user.id,
    });

    return res.status(201).json({
      message: 'Categoría creada correctamente',
      category: nuevaCategoria,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear categoría',
      error: error.message,
    });
  }
};

const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim() === '') {
      return res.status(400).json({
        message: 'El nombre de la categoría es obligatorio',
      });
    }

    const categoria = await Categorias.findOne({
      where: {
        id,
        owner_user_id: req.user.id,
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: 'Categoría no encontrada o no pertenece al usuario',
      });
    }

    await Categorias.update(
      { name: name.trim() },
      {
        where: {
          id,
          owner_user_id: req.user.id,
        },
      }
    );

    return res.status(200).json({
      message: 'Categoría actualizada correctamente',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar categoría',
      error: error.message,
    });
  }
};

const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const categoria = await Categorias.findOne({
      where: {
        id,
        owner_user_id: req.user.id,
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: 'Categoría no encontrada o no pertenece al usuario',
      });
    }

    await Categorias.destroy({
      where: {
        id,
        owner_user_id: req.user.id,
      },
    });

    return res.status(200).json({
      message: 'Categoría eliminada correctamente',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar categoría',
      error: error.message,
    });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
};