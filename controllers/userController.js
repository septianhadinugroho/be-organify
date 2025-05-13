const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { sendOtpEmail } = require('../utils/mailer');

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

exports.signupHandler = async (request, h) => {
  const { nama, email, password } = request.payload;

  const existing = await User.findOne({ email });
  if (existing) return h.response({ error: 'Email sudah terdaftar.' }).code(400);

  const hashed = await bcrypt.hash(password, 10);
  const otp = generateOtp();
  const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '10m' });

  const user = new User({
    nama,
    email,
    password: hashed,
    otp,
    otpExpires: Date.now() + 10 * 60 * 1000, // 10 minutes
    emailVerified: false
  });

  await user.save();
  await sendOtpEmail(email, otp, token);

  return h.response({ message: 'OTP dan tautan verifikasi telah dikirim ke email Anda.' }).code(201);
};

exports.verifyOtpHandler = async (request, h) => {
  const { email, otp } = request.payload;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    return h.response({ error: 'OTP tidak valid atau telah kadaluarsa.' }).code(400);
  }

  user.emailVerified = true;
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return h.response({ message: 'Verifikasi email berhasil.' });
};

exports.verifyEmailByTokenHandler = async (request, h) => {
  try {
    const { token } = request.query;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ email: decoded.email });

    if (!user) return h.response({ message: 'User tidak ditemukan.' }).code(404);
    if (user.emailVerified) return h.response({ message: 'Email sudah diverifikasi.' }).code(400);

    user.emailVerified = true;
    user.otp = undefined;
    user.otpExpires = undefined;
    await user.save();

    return h.response({ message: 'Email berhasil diverifikasi via tautan.' });
  } catch (err) {
    return h.response({ message: 'Token tidak valid atau kadaluarsa.' }).code(400);
  }
};

exports.loginHandler = async (request, h) => {
  const { email, password } = request.payload;

  const user = await User.findOne({ email });
  if (!user || !await bcrypt.compare(password, user.password)) {
    return h.response({ error: 'Email atau password salah.' }).code(401);
  }

  if (!user.emailVerified) {
    return h.response({ error: 'Email belum diverifikasi.' }).code(401);
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  return h.response({ token, user: { id: user._id, nama: user.nama, email: user.email } });
};

exports.forgotPasswordHandler = async (request, h) => {
  const { email } = request.payload;

  const user = await User.findOne({ email });
  if (!user) return h.response({ error: 'Email tidak ditemukan.' }).code(404);

  const otp = generateOtp();
  user.otp = otp;
  user.otpExpires = Date.now() + 10 * 60 * 1000;
  await user.save();

  await sendOtpEmail(email, otp);
  return h.response({ message: 'OTP reset password dikirim ke email Anda.' });
};

exports.resetPasswordHandler = async (request, h) => {
  const { email, otp, newPassword } = request.payload;

  const user = await User.findOne({ email });
  if (!user || user.otp !== otp || user.otpExpires < Date.now()) {
    return h.response({ error: 'OTP tidak valid atau telah kadaluarsa.' }).code(400);
  }

  user.password = await bcrypt.hash(newPassword, 10);
  user.otp = undefined;
  user.otpExpires = undefined;
  await user.save();

  return h.response({ message: 'Password berhasil direset.' });
};

exports.deleteAccountHandler = async (request, h) => {
  const userId = request.auth.credentials.id;
  await User.findByIdAndDelete(userId);
  return h.response({ message: 'Akun berhasil dihapus.' });
};