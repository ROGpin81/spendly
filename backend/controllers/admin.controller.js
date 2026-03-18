const { fn, col, literal } = require('sequelize');
const Usuarios = require('../models/Usuarios');
const Movimientos = require('../models/Movimientos');

const getAdminSummary = async (req, res) => {
  try {
    const totalUsers = await Usuarios.count();

    const totalMovements = await Movimientos.count();

    const totalExpenses = await Movimientos.sum('amount', {
      where: {
        type: 'GASTO',
      },
    });

    return res.status(200).json({
      message: 'Resumen administrativo obtenido correctamente',
      summary: {
        total_users: totalUsers,
        total_movements: totalMovements,
        total_expenses: Number(totalExpenses || 0),
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener resumen administrativo',
      error: error.message,
    });
  }
};

const getTopUsers = async (req, res) => {
  try {
    const topUsers = await Movimientos.findAll({
      where: {
        type: 'GASTO',
      },
      attributes: [
        'user_id',
        [fn('SUM', col('amount')), 'total_spent'],
        [fn('COUNT', col('movimientos.id')), 'movements_count'],
      ],
      include: [
        {
          model: Usuarios,
          as: 'usuario',
          attributes: ['id', 'username', 'full_name'],
        },
      ],
      group: ['user_id', 'usuario.id', 'usuario.username', 'usuario.full_name'],
      order: [[literal('total_spent'), 'DESC']],
      limit: 10,
    });

    const formattedTopUsers = topUsers.map((item) => ({
      user_id: item.user_id,
      username: item.usuario?.username || null,
      full_name: item.usuario?.full_name || null,
      total_spent: Number(item.get('total_spent') || 0),
      movements_count: Number(item.get('movements_count') || 0),
    }));

    return res.status(200).json({
      message: 'Top 10 de usuarios obtenido correctamente',
      top_users: formattedTopUsers,
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener top de usuarios',
      error: error.message,
    });
  }
};

module.exports = {
  getAdminSummary,
  getTopUsers,
};