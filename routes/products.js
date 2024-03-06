const express = require("express");
const router = express.Router();
const { Product, validate } = require("../model/product");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const product = await Product.find().sort("name");
  res.send(product);
});

router.get("/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).send("the product with the id not found");
  res.send(product);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(404).send(error.details[0].message);

  try {
    let product = new Product({
      image: req.body.image,
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      isAvailable: req.body.isAvailable,
      price: req.body.price,
      category: req.body.category,
      tag: req.body.tag,
      numberInStock: req.body.numberInStock,
    });
    await product.save();
    res.send(product);
  } catch (error) {
    res.status(500).json({ error: "Error creating product" });
  }
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(404).send(error.details[0].message);

  let product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      image: req.body.image,
      name: req.body.name,
      code: req.body.code,
      description: req.body.description,
      isAvailable: req.body.isAvailable,
      price: req.body.price,
      category: req.body.category,
      tag: req.body.tag,
      numberInStock: req.body.numberInStock,
    },
    { new: true } // Return the updated document rather than the original one.
  );
  if (!product) res.status(404).send("The product with the ID not found");
  res.send(product);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  let product = await Product.findIdAndDelete(req.params.id);
  if (!product) return res.status(404).send("product with ID not found");
  res.send(product);
});

module.exports = router;
