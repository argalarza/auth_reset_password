const pool = require('../db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const transporter = require('../mailer');

exports.requestReset = async (req, res) => {
  const { email } = req.body;
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  if (rows.length === 0) return res.status(404).json({ message: 'Usuario no encontrado' });

  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '15m' });

  // CORREGIDO: enviar al frontends
const link = `http://54.175.97.19/reset-password?token=${token}`;


  await transporter.sendMail({
    from: `"Soporte" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Restablece tu contraseña',
    html: `<p>Haz clic en el siguiente enlace para restablecer tu contraseña:</p><a href="${link}">${link}</a>`,
  });

  res.json({ message: 'Correo de restablecimiento enviado' });
};

exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query('UPDATE users SET password_hash = ? WHERE email = ?', [hash, decoded.email]);
    res.json({ message: 'Contraseña actualizada correctamente' });
  } catch (err) {
    res.status(400).json({ message: 'Token inválido o expirado' });
  }
};
