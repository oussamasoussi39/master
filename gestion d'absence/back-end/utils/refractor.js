const createTokenUser = (user) => {
  return {
    id: user._id,
    fullName: user.firstName + " " + user.lastName,
    role: user.role,
  };
};
module.exports=createTokenUser