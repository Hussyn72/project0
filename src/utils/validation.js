const validator = require("validator");

//validating signup data
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

//validating profile update data
const validateProfileUpdateData = (req) => {
  const allowedFieldsToUpdate = [
    "FirstName",
    "LastName",
    "Age",
    "Gender",
    "photoURL",
    "skills",
    "about",
  ];

  //obejct.key will gives the keys of our json object eg: age,gender,firstname,lastname,photoURL,etc.
  //every function will check the fields we have is present or not in the allowedfieldstoUpdate array.
  //it will return the boolean value.
  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedFieldsToUpdate.includes(field),
  );

  return isEditAllowed;
};

module.exports = { validateSignUpData, validateProfileUpdateData };
