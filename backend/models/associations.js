const Usuarios = require('./Usuarios');
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

Movimientos.belongsTo(Usuarios, {
  foreignKey: 'user_id',
  as: 'usuario',
});

Usuarios.hasMany(Movimientos, {
  foreignKey: 'user_id',
  as: 'movimientos',
});