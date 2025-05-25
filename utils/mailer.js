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
      <div style="font-family: 'Poppins', Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 10px; padding: 30px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          <h1 style="color: #2e7d32; text-align: center; margin-bottom: 25px; font-size: 24px;">Verifikasi Email Organify</h1>
          
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Hai,</p>
          <p style="font-size: 16px; line-height: 1.6; color: #333;">Terima kasih telah bergabung dengan <strong>Organify</strong>! Verifikasi email Anda dengan klik tombol berikut:</p>

          <!-- Verifikasi Link (Posisi Atas) -->
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationLink}" style="background-color: #2e7d32; color: white; padding: 14px 28px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block; font-size: 16px;">
              Verifikasi Email Sekarang
            </a>
          </div>

          <p style="text-align: center; font-size: 15px; margin: 15px 0; color: #555;">Atau gunakan kode verifikasi manual di bawah ini:</p>

          <!-- Manual OTP (Posisi Bawah) -->
          <div style="background-color: #e8f5e9; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
            <p style="margin: 0 0 10px 0; font-size: 14px; color: #555;">Kode Verifikasi Manual (berlaku 10 menit):</p>
            <span style="display: inline-block; background-color: #2e7d32; color: white; padding: 12px 20px; font-size: 22px; letter-spacing: 3px; border-radius: 6px; font-weight: bold;">
              ${otp}
            </span>
          </div>

          <div style="background-color: #fff3e0; padding: 15px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ffa000;">
            <p style="margin: 0; font-size: 14px; color: #e65100;">
              <strong>💡 Tips:</strong> 
              <ul style="margin: 5px 0; padding-left: 20px;">
                <li>Tombol verifikasi akan langsung mengaktifkan akun Anda</li>
                <li>Jika tombol tidak bekerja, salin kode manual di atas</li>
                <li>Periksa folder spam jika email tidak ditemukan</li>
              </ul>
            </p>
          </div>

          <hr style="border: none; height: 1px; background-color: #e0e0e0; margin: 25px 0;">

          <div style="text-align: center; font-size: 13px; color: #888;">
            <p style="margin: 5px 0;">Email ini dikirim otomatis, mohon tidak membalas.</p>
            <p style="margin: 5px 0;">Jika Anda tidak merasa mendaftar di Organify, abaikan email ini.</p>
            <p style="margin: 5px 0;">© ${new Date().getFullYear()} Organify. All rights reserved.</p>
          </div>
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`[Email] Verification sent to ${email}`);
    return true;
  } catch (error) {
    console.error('[Email] Failed to send:', error);
    throw new Error('Gagal mengirim email verifikasi');
  }
};

module.exports = { sendOtpEmail };