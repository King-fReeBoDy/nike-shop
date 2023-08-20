const { Router } = require("express");
const router = Router();

const {
  userFavorite,
  getAllFavorites,
  getFavorite,
  createFavorite,
  deleteFavorite,
} = require("../controllers/favoritesController");
const { isAuth, checkPermissions } = require("../middleware/isAuth");

router
  .route("/")
  .get(isAuth, checkPermissions, getAllFavorites)
  .post(isAuth, createFavorite);
router.route("/:id").get(isAuth, getFavorite).delete(isAuth, deleteFavorite);
router.route("/:id/user").get(isAuth, userFavorite);

module.exports = router;
