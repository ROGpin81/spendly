const Movimientos = require('../models/Movimientos');
const Categorias = require('../models/Categorias');

const getMovements = async (req, res) => {
  try {
    const movimientos = await Movimientos.findAll({
      where: {
        user_id: req.user.id,
      },
      order: [['id', 'DESC']],
    });

    return res.status(200).json(movimientos);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener movimientos',
      error: error.message,
    });
  }
};

const getMovementById = async (req, res) => {
  try {
    const { id } = req.params;

    const movimiento = await Movimientos.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!movimiento) {
      return res.status(404).json({
        message: 'Movimiento no encontrado o no pertenece al usuario',
      });
    }

    return res.status(200).json(movimiento);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener movimiento',
      error: error.message,
    });
  }
};

const createMovement = async (req, res) => {
  try {
    const {
      category_id,
      type,
      amount,
      movement_date,
      note,
      location_lat,
      location_lng,
    } = req.body;

    if (
      category_id === undefined ||
      category_id === null ||
      type === undefined ||
      type === null ||
      amount === undefined ||
      amount === null ||
      movement_date === undefined ||
      movement_date === null ||
      movement_date === ''
    ) {
      return res.status(400).json({
        message: 'category_id, type, amount y movement_date son obligatorios',
      });
    }

    if (type !== 'INGRESO' && type !== 'GASTO') {
      return res.status(400).json({
        message: 'El tipo debe ser INGRESO o GASTO',
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: 'El monto debe ser mayor que cero',
      });
    }

    const categoria = await Categorias.findOne({
      where: {
        id: category_id,
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: 'La categoría no existe',
      });
    }

    const nuevoMovimiento = await Movimientos.create({
      user_id: req.user.id,
      category_id,
      type,
      amount,
      movement_date,
      note: note || null,
      location_lat: location_lat || null,
      location_lng: location_lng || null,
    });

    return res.status(201).json({
      message: 'Movimiento creado correctamente',
      movement: nuevoMovimiento,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al crear movimiento',
      error: error.message,
    });
  }
};

const updateMovement = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      category_id,
      type,
      amount,
      movement_date,
      note,
      location_lat,
      location_lng,
    } = req.body;

    const movimiento = await Movimientos.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!movimiento) {
      return res.status(404).json({
        message: 'Movimiento no encontrado o no pertenece al usuario',
      });
    }

    if (
      category_id === undefined ||
      category_id === null ||
      type === undefined ||
      type === null ||
      amount === undefined ||
      amount === null ||
      movement_date === undefined ||
      movement_date === null ||
      movement_date === ''
    ) {
      return res.status(400).json({
        message: 'category_id, type, amount y movement_date son obligatorios',
      });
    }

    if (type !== 'INGRESO' && type !== 'GASTO') {
      return res.status(400).json({
        message: 'El tipo debe ser INGRESO o GASTO',
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        message: 'El monto debe ser mayor que cero',
      });
    }

    const categoria = await Categorias.findOne({
      where: {
        id: category_id,
      },
    });

    if (!categoria) {
      return res.status(404).json({
        message: 'La categoría no existe',
      });
    }

    await Movimientos.update(
      {
        category_id,
        type,
        amount,
        movement_date,
        note: note || null,
        location_lat: location_lat || null,
        location_lng: location_lng || null,
      },
      {
        where: {
          id,
          user_id: req.user.id,
        },
      }
    );

    return res.status(200).json({
      message: 'Movimiento actualizado correctamente',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al actualizar movimiento',
      error: error.message,
    });
  }
};

const deleteMovement = async (req, res) => {
  try {
    const { id } = req.params;

    const movimiento = await Movimientos.findOne({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    if (!movimiento) {
      return res.status(404).json({
        message: 'Movimiento no encontrado o no pertenece al usuario',
      });
    }

    await Movimientos.destroy({
      where: {
        id,
        user_id: req.user.id,
      },
    });

    return res.status(200).json({
      message: 'Movimiento eliminado correctamente',
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al eliminar movimiento',
      error: error.message,
    });
  }
};

module.exports = {
  getMovements,
  getMovementById,
  createMovement,
  updateMovement,
  deleteMovement,
};