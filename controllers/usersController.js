const pool = require("../database/db");

const getAllUsers = async (req, res) => {
  const users = await pool.query("select * from users");
  res.status(200).json({ success: true, users: users.rows });
};

const getUser = async (req, res) => {
  const { id } = req.params;
  //check permission
  const user = await pool.query("select * from users where user_id = $1", [id]);
  res.status(200).json({ success: true, user: user.rows[0] });
};

const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { email, username } = req.body;

    if (!id || !email || !username) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all credentials" });
    }

    //check permission
    const alreadyExistingEmail = await pool.query(
      "select * from users where user_id = $1",
      [id]
    );

    if (alreadyExistingEmail.rows.length < 1) {
      return res
        .status(400)
        .json({ success: false, message: "User does not exits" });
    }

    await pool.query(
      "update users set email = $1, user_name =$2 where user_id = $3",
      [email, username, id]
    );

    res
      .status(200)
      .json({ success: true, message: "Update a user credentials" });
  } catch (error) {
    console.log(error);
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  //check permission
  const user = await pool.query("delete from users where user_id = $1", [id]);
  res.status(200).json({ success: true, message: "User deleted" });
};

module.exports = {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
};
