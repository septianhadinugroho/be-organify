const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendVerificationEmail = async (email, token) => {
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
          <p>Terima kasih telah mendaftar ke <strong>Organify</strong>! Untuk mengaktifkan akun Anda, klik tombol di bawah ini:</p>

          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #81c784; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Verifikasi Sekarang
            </a>
          </div>

          <p style="font-size: 14px; text-align: center; color: #666;">
            Link ini akan kedaluwarsa dalam <strong>10 menit</strong>.
          </p>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
          <p style="font-size: 13px; color: #888;">Jika Anda tidak merasa mendaftar, abaikan email ini. Jangan bagikan link ini kepada siapa pun.</p>
        </div>
      </div>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = { sendVerificationEmail };