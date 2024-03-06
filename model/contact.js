const mongoose = require("mongoose");
const Joi = require("joi");

const contactSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  notes: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 2000,
  },
});
const Contact = mongoose.model("Contact", contactSchema);
function validateContact(contact) {
  const schema = {
    phone: Joi.string().min(5).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    notes: Joi.string().min(5).max(2000).required(),
  };
  return Joi.validate(contact, schema);
}
exports.Contact = Contact;
exports.validate = validateContact;
