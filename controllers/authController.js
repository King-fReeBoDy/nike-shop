const pool = require("../database/db");
const bcrypt = require("bcrypt");

const {
  createAccessToken,
  createTokenUser,
  createRefreshToken,
  sendAccessToken,
  sendRefreshToken,
} = require("../utils/jwt");

const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all credentials" });
  }

  const user = await pool.query("select * from users where email = $1", [
    email,
  ]);

  const hashPassword = await bcrypt.compare(password, user.rows[0]?.password);

  if (!hashPassword) {
    return res
      .status(400)
      .json({ success: false, message: "Incorrect password" });
  }

  const tokenUser = createTokenUser(user);

  const accessToken = createAccessToken(tokenUser);
  const refreshToken = createRefreshToken(tokenUser);

  tokenUser.accessToken = accessToken;

  sendRefreshToken(res, refreshToken);
  sendAccessToken(res, tokenUser);
};

const register = async (req, res) => {
  const { username, email, password, role } = req.body;
  let img;
  if (req.files && req.files.length > 0) {
    img = req.files[0].originalname;
  }

  try {
    if (!username || !email || !password || !role) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all credentials" });
    }

    const findUser = await pool.query("select * from users where email = $1", [
      email,
    ]);

    if (findUser.rows.length > 0) {
      return res
        .status(401)
        .json({ success: false, message: "User already exist" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    await pool.query(
      "insert into users (user_name,email,role,password,image, created_at, updated_at) values($1,$2,$3,$4,$5,$6,$7)",
      [username, email, role, hashPassword, img, new Date(), new Date()]
    );
    res.status(200).json({ success: true, message: "Register successful" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const logout = (req, res) => {
  res.clearCookie("refreshtoken", { path: "/refreshtoken" });
  res.status(200).json({ success: true, message: "User logged out" });
};

module.exports = {
  login,
  register,
  logout,
};
