const { Router } = require("express");
const router = Router();

const {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productsController");
const upload = require("../utils/multer");
const { isAuth, checkPermissions } = require("../middleware/isAuth");

router
  .route("/")
  .get(getAllProducts)
  .post(isAuth, checkPermissions, upload.array("files"), createProduct);
router
  .route("/:id")
  .get(getProduct)
  .put(isAuth, checkPermissions, updateProduct)
  .delete(isAuth, checkPermissions, deleteProduct);

module.exports = router;
