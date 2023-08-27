const pool = require("../database/db");
const permissions = require("../utils/permission");

const getAllFavorites = async (req, res) => {
  try {
    const allFavorites = await pool.query("select * from favorites");

    res.status(200).json({ success: true, favorites: allFavorites.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const createFavorite = async (req, res) => {
  const { userId, productId } = req.body;

  if (!userId || !productId) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all credentials" });
  }

  const favoriteAlreadyExist = await pool.query(
    "select * from favorites where product_id = $1 and user_id = $2",
    [productId, userId]
  );

  if (favoriteAlreadyExist.rows.length > 0) {
    return res.status(400).json({ success: false, message: "Already exist" });
  }

  try {
    await pool.query(
      "insert into favorites (user_id,product_id,createdAt,updatedAt) values($1,$2,$3,$4)",
      [userId, productId, new Date(), new Date()]
    );
    res.status(200).json({ success: true, message: "Favorite added" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const userFavorite = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all credentials" });
  }

  const query = `
  select *
  from favorites f
  inner join users u 
  on f.fav_user_id = u.id
  inner join products p
  on f.fav_product_id = p.product_id 
  where u.user_id = $1
  `;

  try {
    const favorite = await pool.query(query, [id]);

    permissions(req, res, favorite.rows[0].fav_user_id);

    res.status(200).json({ success: true, favorite: favorite.rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const getFavorite = async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res
      .status(400)
      .json({ success: false, message: "Provide all credentials" });
  }

  try {
    const favorite = await pool.query(
      "select * from favorites where fav_user_id = $1",
      [id]
    );

    if (favorite.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Favorite not found" });
    }

    permissions(req, res, favorite.rows[0].fav_user_id);

    res.status(200).json({ success: true, favorite: favorite.rows[0] });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "An error occurred" });
  }
};

const deleteFavorite = async (req, res) => {
  const { productId, userId } = req.params;

  if (!productId || !userId) {
    res
      .status(400)
      .json({ success: false, message: "Provide all credentials" });
  }

  try {
    const favorite = await pool.query(
      "select * from favorites where product_id = $1 and user_id = $2",
      [productId, userId]
    );

    if (favorite.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Favorite not found" });
    }

    permissions(req, res, favorite.rows[0].fav_user_id);

    await pool.query("delete from favorites where fav_user_id = $1", [userId]);
    res.status(200).json({ success: true, message: "Delete a favorite" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  userFavorite,
  getAllFavorites,
  createFavorite,
  getFavorite,
  deleteFavorite,
};
