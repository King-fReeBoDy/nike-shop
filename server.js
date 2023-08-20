const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const port = 8080;

const usersRoute = require("./routes/userRoute");
const authRoute = require("./routes/authRoute");
const productsRoute = require("./routes/productRoute");
const favouriteRoute = require("./routes/favoriteRoute");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/users", usersRoute);
app.use("/api/products", productsRoute);
app.use("/api/favorites", favouriteRoute);

app.listen(port, () => console.log(`Serving on http://localhost:${port}`));
