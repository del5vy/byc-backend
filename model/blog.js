const Joi = require("joi");
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  image: {
    type: [
      {
        type: String,
        trim: true,
      },
    ],
    validate: {
      validator: function (v) {
        return v && v.length > 0;
      },
      message: "A blog should have at least one image!",
    },
  },
  title: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  header: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50,
  },
  content: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 5000,
  },
  views: {
    type: Number,
    required: true,
    minlength: 0,
  },
  likes: {
    type: Number,
    required: true,
    minlength: 0,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Blog = mongoose.model("Blog", blogSchema);
function validateBlog(blog) {
  const schema = {
    image: Joi.array().required(),
    title: Joi.string().min(5).max(50).required(),
    header: Joi.string().min(5).max(50).required(),
    content: Joi.string().required(),
    views: Joi.number().required(),
    likes: Joi.number().required(),
  };
  return Joi.validate(blog, schema);
}
exports.Blog = Blog;
exports.validate = validateBlog;

// {
//     _id : ...,
//     ReferenceId : ... // Reference to blogs or comments
//     LikeTime : ... ,
//      Author : {
//          UserId : ...,
//          ProfilePic : ...,
//          Name : ....
//    }
