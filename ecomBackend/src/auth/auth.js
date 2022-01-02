const jwt = require("jsonwebtoken");
const User = require("../../../userBackend/src/model/userModel");
const auth = async (req, res, next) => {
  try {

    // why can't we just get token from coookie directly using req.cookies.jwt ??

    const token = req.header("Authorization").replace("Bearer ", "");
    const verifiedToken = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({
      _id: verifiedToken._id,
      "tokens.token": token,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (e) {
    res.status(401).send({ error: "You should be logged in to access this route." });
  }
};

module.exports = auth;
