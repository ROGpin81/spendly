const Usuarios = require('../models/Usuarios');
const { hashPassword, comparePassword } = require('../utils/hashPassword');
const generateToken = require('../utils/generateToken');

const register = async (req, res) => {
  try {
    const { username, password, full_name } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username y password son obligatorios',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: 'La contraseña debe tener al menos 6 caracteres',
      });
    }

    const existingUser = await Usuarios.findOne({
      where: { username },
    });

    if (existingUser) {
      return res.status(409).json({
        message: 'El username ya existe',
      });
    }

    const hashedPassword = await hashPassword(password);

    const newUser = await Usuarios.create({
      username,
      password: hashedPassword,
      full_name,
      role: 'USER',
    });

    return res.status(201).json({
      message: 'Usuario registrado correctamente',
      user: {
        id: newUser.id,
        username: newUser.username,
        full_name: newUser.full_name,
        role: newUser.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al registrar usuario',
      error: error.message,
    });
  }
};

const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: 'Username y password son obligatorios',
      });
    }

    const user = await Usuarios.findOne({
      where: { username },
    });

    if (!user) {
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    const isMatch = await comparePassword(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: 'Credenciales inválidas',
      });
    }

    const token = generateToken(user);

    return res.status(200).json({
      message: 'Login correcto',
      token,
      user: {
        id: user.id,
        username: user.username,
        full_name: user.full_name,
        role: user.role,
      },
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error al iniciar sesión',
      error: error.message,
    });
  }
};

const me = async (req, res) => {
  try {
    const user = await Usuarios.findByPk(req.user.id, {
      attributes: ['id', 'username', 'full_name', 'role'],
    });

    if (!user) {
      return res.status(404).json({
        message: 'Usuario no encontrado',
      });
    }

    return res.status(200).json(user);
  } catch (error) {
    return res.status(500).json({
      message: 'Error al obtener usuario autenticado',
      error: error.message,
    });
  }
};

module.exports = {
  register,
  login,
  me,
};