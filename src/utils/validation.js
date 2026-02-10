const validator = require("validator");

const validateSignUpData = (req) => {
  const { FirstName, LastName, Age, Password, Gender, EmailId } = req.body;
  if (!FirstName || !EmailId || !Password) {
    throw new Error("Required Fields are Missing !");
  }

  if (!validator.isEmail(EmailId)) {
    throw new Error("Invalid Email");
  }

  if (!validator.isStrongPassword(Password)) {
    throw new Error("Please Enter a Strong Password");
  }
};

module.exports = {validateSignUpData,};
