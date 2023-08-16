const sendEmail = require("./sendEmail");

const  sendResetPasswordEmail=({name,email,token,origin})=>{
const resetUrl= `${origin}/user/verify-email?token=${token}&email=${email}`;
const message = `<p>Please confirm your email by clicking on the following link <a href="${resetUrl}" >reset Password</a></p>`;
sendEmail({
    to: email,
    subject: "Email verification",
    html: `<h4>hello ${name}</h4>${message}`,
  });
}
module.exports=sendResetPasswordEmail