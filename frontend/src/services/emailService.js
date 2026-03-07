const nodemailer = require("nodemailer");

const sendResetEmail = async (email, resetLink) => {

const transporter = nodemailer.createTransport({

service: "gmail",

auth: {
user: process.env.EMAIL_USER,
pass: process.env.EMAIL_PASS
}

});

await transporter.sendMail({

from: process.env.EMAIL_USER,
to: email,
subject: "Password Reset",
html: `
<h3>Password Reset Request</h3>
<p>Click the link below to reset your password</p>
<a href="${resetLink}">${resetLink}</a>
`

});

};

module.exports = sendResetEmail;