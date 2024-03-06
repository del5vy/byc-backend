const Joi = require("joi");
const mongoose = require("mongoose");
const cartSchema = new mongoose.Schema({
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products:
    // {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: "Product",
    //   required: true,
    // },

    [
      {
        type: new mongoose.Schema({
          image: {
            type: String,
          },
          name: {
            type: String,
            minlength: 4,
            maxlength: 25,
          },
          code: {
            type: String,
          },
          summary: {
            type: String,
            minlength: 10,
            maxlength: 100,
          },
          price: {
            type: Number,
          },
          color: [
            {
              type: String,
            },
          ],
          size: [
            {
              type: String,
              enum: ["s", "m", "l", "xl"],
            },
          ],
          quantity: {
            type: Number,
            default: 1,
            max: 10,
          },
          dateAdded: {
            type: Date,
            default: Date.now,
          },
        }),
        required: true,
      },
    ],

  billing: {
    type: Number,
    min: 0,
    required: true,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

function validateCart(cart) {
  const schema = {
    customer: Joi.objectId().required(),
    products: Joi.array().required(),
  };
  return Joi.validate(cart, schema);
}

exports.Cart = Cart;
exports.validate = validateCart;
