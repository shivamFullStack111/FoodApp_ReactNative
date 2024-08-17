const jwt = require("jsonwebtoken");
require("dotenv").config();

const isauthentication = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization)
      return res.send({ success: false, message: "token is required" });

    const { user } = jwt.verify(
      JSON.parse(authorization),
      process.env.JWT_SECRET
    );

    if (!user)
      return res.send({ success: false, message: "token is required" });

    req.user = user;
    next();
  } catch (error) {
    return res.send({ success: false, message: error.message });
  }
};

module.exports = {
  isauthentication,
};
