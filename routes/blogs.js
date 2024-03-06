const express = require("express");
const router = express.Router();
const { Blog, validate } = require("../model/blog");

const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

router.get("/", async (req, res) => {
  const blog = await Blog.find().sort({ dateAdded: -1 });
  res.send(blog);
});

router.get("/:id", async (req, res) => {
  const blog = await Blog.findById(req.params.id);
  if (!blog) return res.status(404).send("the blog with the id not found");
  res.send(blog);
});

router.post("/", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(404).send(error.details[0].message);

  try {
    let blog = new Blog({
      image: req.body.image,
      title: req.body.title,
      header: req.body.header,
      content: req.body.content,
      views: req.body.views,
      likes: req.body.likes,
    });
    await blog.save();
    res.send(blog);
  } catch (error) {
    res.status(500).json({ error: "Error creating blog" });
  }
});

router.put("/:id", [auth, admin], async (req, res) => {
  const { error } = validate(req.body);

  if (error) return res.status(404).send(error.details[0].message);
  let blog = await Blog.findByIdAndUpdate(
    req.params.id,
    {
      image: req.body.image,
      title: req.body.title,
      header: req.body.header,
      content: req.body.content,
      views: req.body.views,
      likes: req.body.likes,
    },
    { new: true } // Return the updated document rather than the original one.
  );
  if (!blog) res.status(404).send("The blog with the ID not found");
  res.send(blog);
});

router.delete("/:id", [auth, admin], async (req, res) => {
  let blog = await Blog.findIdAndDelete(req.params.id);
  if (!blog) return res.status(404).send("product with ID not found");
  res.send(blog);
});

module.exports = router;
