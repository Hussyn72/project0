export const userAuth = async (req, res, next) => {
  const token = "sadlu";
  const isUserAuthorized = token === "sadlu";
  if (isUserAuthorized) {
    next();
  } else {
    res.status(401).send("UnAuthorized Request - No User Found");
  }
};
