const Movimientos = require('../models/Movimientos');
const Categorias = require('../models/Categorias');

const getCategoryStats = async (req, res) => {
  try {
    const movimientos = await Movimientos.findAll({
      where: { user_id: req.user.id },
      include: [
        {
          model: Categorias,
          as: 'categoria',
          attributes: ['name'],
        },
      ],
    });

    const stats = {};

    movimientos.forEach((mov) => {
      const categoria = mov.categoria?.name || 'Sin categoría';

      if (!stats[categoria]) {
        stats[categoria] = 0;
      }

      stats[categoria] += Number(mov.amount);
    });

    return res.status(200).json(stats);
  } catch (error) {
    return res.status(500).json({
      message: 'Error obteniendo estadísticas',
      error: error.message,
    });
  }
};

module.exports = {
  getCategoryStats,
};