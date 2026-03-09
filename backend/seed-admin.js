require('dotenv').config();

const sequelize = require('./db/connection');
const Usuarios = require('./models/Usuarios');
const { hashPassword } = require('./utils/hashPassword');

async function seedAdmin() {
  try {
    console.log('Iniciando creación del administrador...');

    // Verificar conexión a la base de datos
    await sequelize.authenticate();
    console.log('Conexión a la base de datos correcta');

    // Verificar si ya existe un admin con ese username
    const existingAdmin = await Usuarios.findOne({
      where: { username: 'admin' }
    });

    if (existingAdmin) {
      console.log('El usuario administrador ya existe. No se creó uno nuevo.');
      process.exit(0);
    }

    // Hashear contraseña
    const hashedPassword = await hashPassword('Admin12345');

    // Crear admin inicial
    const admin = await Usuarios.create({
      username: 'admin',
      password: hashedPassword,
      full_name: 'Administrador General',
      role: 'ADMIN'
    });

    if (admin) {
      console.log('Administrador creado correctamente');
      console.log({
        id: admin.id,
        username: admin.username,
        full_name: admin.full_name,
        role: admin.role
      });
    } else {
      console.log('No se pudo crear el administrador');
    }

    process.exit(0);
  } catch (error) {
    console.error('Error al crear el administrador:', error.message);
    process.exit(1);
  }
}

seedAdmin();