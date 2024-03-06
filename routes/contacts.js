const express = require("express");
const router = express.Router();
const { Contact, validate } = require("../model/contact");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", [auth, admin], async (req, res) => {
  const contact = await Contact.find().sort("name");
  res.send(contact);
});

router.get("/:id", [auth, admin], async (req, res) => {
  const contact = await Contact.findById(req.params.id);
  if (!contact)
    return res.status(404).send("the product with the id not found");
  res.send(contact);
});

router.post("/", async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(404).send(error.details[0].message);

  try {
    let contact = new Contact({
      phone: req.body.phone,
      email: req.body.email,
      notes: req.body.notes,
    });
    await contact.save();
    res.send(contact);
  } catch (error) {
    res.status(500).json({ error: "Error creating contact" });
  }
});


  
  router.delete("/:id", [auth, admin], async (req, res) => {
    let contact = await Contact.findIdAndDelete(req.params.id);
    if (!contact) return res.status(404).send("contact with ID not found");
    res.send(contact);
  });
  
  module.exports = router;