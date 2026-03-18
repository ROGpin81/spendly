const { Op } = require('sequelize');
const Movimientos = require('../models/Movimientos');
const Categorias = require('../models/Categorias');

const getMapExpenses = async (req, res) => {
  try {
    const expenses = await Movimientos.findAll({
      where: {
        user_id: req.user.id,
        type: 'GASTO',
        location_lat: {
          [Op.ne]: null,
        },
        location_lng: {
          [Op.ne]: null,
        },
      },
      include: [
        {
          model: Categorias,
          as: 'categoria',
          attributes: ['id', 'name'],
        },
      ],
      order: [['movement_date', 'DESC'], ['id', 'DESC']],
    });

    const formattedExpenses = expenses.map((item) => ({
      id: item.id,
      amount: Number(item.amount),
      type: item.type,
      movement_date: item.movement_date,
      note: item.note,
      location_lat: Number(item.location_lat),
      location_lng: Number(item.location_lng),
      category: item.categoria
        ? {
            id: item.categoria.id,
            name: item.categoria.name,
          }
        : null,
    }));

    return res.status(200).json({
      message: 'Gastos geolocalizados obtenidos correctamente',
      expenses: formattedExpenses,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener gastos geolocalizados',
      error: error.message,
    });
  }
};

module.exports = {
  getMapExpenses,
};