const express = require("express");
const router = express.Router();

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} = require("../controllers/usersController");
const { isAuth, checkPermissions } = require("../middleware/isAuth");

router.route("/").get(isAuth, checkPermissions, getAllUsers);
router
  .route("/:id")
  .get(isAuth, getUser)
  .patch(isAuth, updateUser)
  .delete(isAuth, checkPermissions, deleteUser);

module.exports = router;
