const express = require("express");
const { Cart } = require("../model/cart");
const { User } = require("../model/user");
const { Product } = require("../model/product");
const router = express.Router();

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const carts = await Cart.find().sort("name");
  res.send(carts);
});

router.post("/", async (req, res) => {
  const { customer, products } = req.body;

  try {
    const user = await User.findById(customer);
    if (!user) return res.status(404).send("Invalid User");

    let cart = await Cart.findOne({ customer });

    if (!cart) {
      cart = new Cart({ customer });
    }

    for (const product of products) {
      const productDetails = await Product.findById(product.productId);
      if (!productDetails || productDetails.numberInStock === 0) {
        return res.status(404).send("Product not found!");
      }

      const { image, name, code, summary, price } = productDetails;

      cart.products.push({
        _id: product.productId,
        image: image[0],
        name,
        code,
        summary,
        price,
        quantity: product.quantity,
        color: product.color,
        size: product.size,
      });
    }

    let totalPrice = 0;
    for (const product of cart.products) {
      totalPrice += product.price * product.quantity;
    }
    cart.billing = totalPrice;

    const newCart = await cart.save();

    res.status(201).json(newCart);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//delete product from cart
router.delete("/:id/:productId", [auth, admin], async (req, res) => {
  const { id, productId } = req.params;

  try {
    const cart = await Cart.findById(id);
    if (!cart) return res.status(404).send("Cart not found");

    // Find the index of the product to remove
    const productIndex = cart.products.findIndex(
      (product) => product.id === productId
    );

    // If the product is not found in the cart, return 404
    if (productIndex === -1) {
      console.error(`Product not found in cart for ID: ${productId}`);
      return res.status(404).send("Product not found in cart");
    }

    // Get the price and quantity of the product being removed
    const { price, quantity } = cart.products[productIndex];

    // Remove the product from the cart's product array
    cart.products.splice(productIndex, 1);

    // Update the billing by subtracting the removed product's cost
    cart.billing -= price * quantity;

    // Save the updated cart
    const updatedCart = await cart.save();

    res.json(updatedCart);
  } catch (err) {
    console.error("Error deleting product from cart:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
