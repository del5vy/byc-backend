const mongoose = require("mongoose");
const express = require("express");
const app = express();
const Joi = require("joi");
const config = require("config");

Joi.objectId = require("joi-objectid")(Joi);

const productRouter = require("./routes/products");
const userRouter = require("./routes/users");
const cartRouter = require("./routes/carts");
const authRouter = require("./routes/auth");
const orderRouter = require("./routes/orders");
const blogRouter = require("./routes/blogs");
const contactRouter = require("./routes/contacts");

mongoose
  .connect("mongodb://localhost/byc")
  .then(() => console.log("connected to mongoDB..."))
  .catch((err) => console.log("could not connect to mongoDB...", err));

if (!config.get("jwtPrivateKey")) {
  console.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

app.use(express.json());
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/orders", orderRouter);
app.use("/api/blogs", blogRouter);
app.use("/api/contacts", contactRouter);

const port = process.env.PORT || 5000;

app.listen(port, () => {
  console.log(`listening on port ${port}....`);
});
