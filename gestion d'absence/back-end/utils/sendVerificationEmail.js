const  sendEmail  = require("./sendEmail");
const sendVerificationEmail = ({ name, email, verificationToken, origin }) => {
  let verifyEmail = `${origin}/user/verify-email?token=${verificationToken}&email=${email}`;
  const message = `<p>Please confirm your email by clicking on the following link <a href="${verifyEmail}" >verify email</a></p>`;
  console.log(sendEmail);
  sendEmail({
    to: email,
    subject: "Email verification",
    html: `<h4>hello ${name}</h4>${message}`,
  });
};
module.exports = sendVerificationEmail;
