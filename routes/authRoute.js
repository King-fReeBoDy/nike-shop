const { Router } = require("express");
const router = Router();

const { login, register, logout } = require("../controllers/authController");
const upload = require("../utils/multer");

router.route("/login").post(login);
router.route("/register").post(upload.array("files"), register);
router.route("/logout").get(logout);

module.exports = router;
