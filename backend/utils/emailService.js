import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "smtp.gmail.com",
  port: process.env.EMAIL_PORT || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendOtpEmail = async (
  email,
  otp,
  subject = "Your Verification Code - Zocialin",
) => {
  // Check if otp is actually HTML content (for password reset)
  const isHtmlContent = otp && otp.includes("<");

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subject,
    html: isHtmlContent
      ? otp
      : `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #6366f1;">Verify Your Email</h1>
        <p>Use the following code to complete your registration:</p>
        <div style="background-color: #f3f4f6; padding: 20px; border-radius: 10px; text-align: center; margin: 20px 0;">
          <h2 style="color: #1f2937; letter-spacing: 5px; font-size: 32px; margin: 0;">${otp}</h2>
        </div>
        <p>This code will expire in 10 minutes.</p>
        <p style="color: #6b7280; font-size: 12px; margin-top: 30px;">
          If you didn't request this code, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendApprovalEmail = async (email, name) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account Approved - Zocialin",
    html: `
      <h1>Great News, ${name}!</h1>
      <p>Your account has been approved by the admin.</p>
      <p>You can now access Zocialin and start connecting with other verified students.</p>
      <a href="${process.env.FRONTEND_URL}/login" style="background-color: #28a745; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
        Login Now
      </a>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

export const sendRejectionEmail = async (email, reason) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Account Status - Zocialin",
    html: `
      <h1>Account Verification Update</h1>
      <p>Unfortunately, your account could not be approved at this time.</p>
      <p>Reason: ${reason}</p>
      <p>If you believe this is an error, please contact our support team.</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};
