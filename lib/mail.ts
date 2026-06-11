import nodemailer from "nodemailer"

export async function sendOtp(email: string, code: string) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  })

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Kode OTP",
    text: `Kode OTP kamu adalah: ${code}`
  })
}