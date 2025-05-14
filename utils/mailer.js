const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendOtpEmail = async (email, otp, token) => {
  const verificationLink = `${process.env.CLIENT_URL}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Organify Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: 'Verifikasi Akun Anda - Organify',
    html: `
      <div style="font-family: 'Poppins', sans-serif; padding: 20px; background-color: #f0fdf4;">
        <div style="max-width: 600px; margin: auto; background-color: #ffffff; border-radius: 12px; padding: 30px; box-shadow: 0 0 20px rgba(0,0,0,0.05);">
          <h2 style="color: #43a047; text-align: center;">Verifikasi Email Anda</h2>
          <p style="font-size: 16px;">Hai,</p>
          <p>Terima kasih telah mendaftar ke <strong>Organify</strong>! Untuk mengaktifkan akun Anda, silakan gunakan kode OTP berikut <strong>(berlaku 10 menit)</strong>:</p>

          <div style="text-align: center; margin: 20px 0;">
            <span style="display: inline-block; background-color: #e6f4ea; color: #2e7d32; padding: 15px 25px; font-size: 24px; letter-spacing: 4px; border-radius: 8px;">
              ${otp}
            </span>
          </div>

          <p style="text-align: center; font-size: 14px;">Atau klik tombol di bawah untuk langsung verifikasi:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #81c784; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verifikasi Sekarang
            </a>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 13px; color: #888;">Jika Anda tidak merasa mendaftar, abaikan email ini. Jangan bagikan kode atau link ini kepada siapa pun.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendOtpEmail };