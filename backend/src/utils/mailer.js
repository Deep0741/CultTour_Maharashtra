const nodemailer = require("nodemailer");

const sendEmail = async ({ to, subject, text, html }) => {
  try {
    // Basic nodemailer transporter
    // If SMTP credentials aren't set, this will likely fail unless using a local mock
    // For demo purposes, we will log the email if no credentials are set
    if (!process.env.SMTP_HOST || !process.env.SMTP_USER) {
      console.log("-----------------------------------------");
      console.log("Mock Email Sent (No SMTP Credentials in .env):");
      console.log("To:", to);
      console.log("Subject:", subject);
      console.log("Body:", text);
      console.log("-----------------------------------------");
      return true;
    }

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_FROM || '"CulTour Maharashtra" <noreply@cultour.com>',
      to,
      subject,
      text,
      html,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
};

module.exports = sendEmail;
