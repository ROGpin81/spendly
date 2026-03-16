const { Op } = require('sequelize');
const Movimientos = require('../models/Movimientos');

const getMonthlySummary = async (req, res) => {
  try {
    const now = new Date();

    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    const startDate = `${year}-${month}-01`;
    const nextMonthDate = new Date(year, now.getMonth() + 1, 1);
    const nextYear = nextMonthDate.getFullYear();
    const nextMonth = String(nextMonthDate.getMonth() + 1).padStart(2, '0');
    const endDate = `${nextYear}-${nextMonth}-01`;

    const movimientos = await Movimientos.findAll({
      where: {
        user_id: req.user.id,
        movement_date: {
          [Op.gte]: startDate,
          [Op.lt]: endDate,
        },
      },
    });

    let totalIncome = 0;
    let totalExpense = 0;

    movimientos.forEach((mov) => {
      const amount = Number(mov.amount);

      if (mov.type === 'INGRESO') {
        totalIncome += amount;
      }

      if (mov.type === 'GASTO') {
        totalExpense += amount;
      }
    });

    const balance = totalIncome - totalExpense;

    return res.status(200).json({
      month: `${year}-${month}`,
      total_income: Number(totalIncome.toFixed(2)),
      total_expense: Number(totalExpense.toFixed(2)),
      balance: Number(balance.toFixed(2)),
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener resumen mensual',
      error: error.message,
    });
  }
};

module.exports = {
  getMonthlySummary,
};