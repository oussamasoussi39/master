const nodemailer = require("nodemailer");
const sendEmail = async ({ to, subject, html }) => {
  let testAccount = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: "keshaun58@ethereal.email",
      pass: "ZKS1KVpFwpBjsUhgFj",
    },
  });
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to, // list of receivers
    subject, // Subject line
    text: "Hello world?", // plain text body
    html, // html body
  });
};
module.exports = sendEmail;
