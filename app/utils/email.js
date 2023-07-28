const { createTransport } = require("nodemailer");

let transporter = createTransport({
  service: "gmail",
  auth: {
    user: process.env.email,
    pass: process.env.emailPassword,
  },
});

async function sendEmail(toEmail, verifycationCode) {
  console.log(
    await transporter.sendMail({
      from: process.env.email, // sender address
      to: toEmail,
      subject: `server`, // Subject line
      html: `<p>Your code for login:${verifycationCode}</p>`, // plain text body
    })
  );
}

module.exports = {
  transporter,
  sendEmail,
};
