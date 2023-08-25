const pool = require("../database/db");

const getAllProducts = async (req, res) => {
  const allProducts = await pool.query("select * from products");
  res.status(200).json({ success: true, products: allProducts.rows });
};

const createProduct = async (req, res) => {
  const { name, description, price, quantity } = req.body;

  let img;
  if (req.files && req.files.length > 0) {
    img = req.files[0].originalname;
  }

  if (!name || !description || !price) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all credentials" });
  }

  try {
    await pool.query(
      "insert into products (name, description,price,image,quantity,createdAt,updatedAt) values($1,$2,$3,$4,$5,$6,$7)",
      [name, description, price, img, quantity, new Date(), new Date()]
    );

    res.status(200).json({ success: true, message: "Product created" });
  } catch (error) {
    console.log(error);
  }
};

const getProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await pool.query(
      "select * from products where product_id = $1",
      [id]
    );
    res.status(200).json({ success: true, product: product.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occured" });
  }
};

const updateProduct = async (req, res) => {
  const { id, name, description, price, quantity } = req.body;

  try {
    if (!id || !name || !description || !price || !quantity) {
      return res
        .status(400)
        .json({ success: false, message: "Provide all credentials" });
    }

    const product = await pool.query(
      "select * from products where product_id = $1",
      [id]
    );

    if (product.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    await pool.query(
      "update products set name = $1, description = $2, price =$3, quantity = $4 where product_id = $5",
      [name, description, price, quantity, id]
    );
    res.status(200).json({ success: true, message: "Product updated" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, messsage: "An error occurred" });
  }
};

const productImage = async (req, res) => {
  const { id } = req.params;
  const img = req.files[0];

  if (!id || !img) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all credentials" });
  }

  const product = await pool.query(
    "select * from products where product_id = $1",
    [id]
  );

  if (product.rows.length === 0) {
    return res
      .status(404)
      .json({ success: false, message: "Product not found" });
  }

  await pool.query("update products set image = $1 where product_id = $2", [
    img,
    id,
  ]);

  res.status(200).json({ success: true, message: "Image updated" });
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await pool.query(
      "delete from products where product_id = $1",
      [id]
    );
    res.status(200).json({
      success: true,
      messsage: "Delete a product",
      product: product.rows,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllProducts,
  createProduct,
  getProduct,
  updateProduct,
  productImage,
  deleteProduct,
};
