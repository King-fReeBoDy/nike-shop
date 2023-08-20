const { isTokenValid } = require("../utils/jwt");

const isAuth = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer")) {
      return res
        .status(401)
        .json({ success: false, message: "Authentication invalid" });
    }
    const token = authHeader.split(" ")[1];

    const payload = isTokenValid(token);

    req.user = payload;

    next();
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Authentication invalid" });
  }
};

const checkPermissions = (req, res, next) => {
  try {
    if (req.user.role !== "admin") {
      return res
        .status(400)
        .json({ success: false, message: "No authorization" });
    }
    next();
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

module.exports = { isAuth, checkPermissions };
