const Movimientos = require('./Movimientos');
const Categorias = require('./Categorias');

Movimientos.belongsTo(Categorias, {
  foreignKey: 'category_id',
  as: 'categoria',
});

Categorias.hasMany(Movimientos, {
  foreignKey: 'category_id',
  as: 'movimientos',
});