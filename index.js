const express = require("express");
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const { v4: uuid } = require("uuid");
const mongoose = require("mongoose");

mongoose
  .connect("mongodb://localhost:27017/movieApp", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

let blogs = [
  {
    id: uuid(),
    author: "Ika",
    blog: "Today was a great day",
  },
  {
    id: uuid(),
    author: "Sally",
    blog: "I am tired",
  },
  {
    id: uuid(),
    author: "Nutsa",
    blog: "Today was a bad day",
  },
  {
    id: uuid(),
    author: "Lado",
    blog: "woof woof woof",
  },
];

app.get("/blogs", (req, res) => {
  res.render("blogs/index", { blogs });
});

app.get("/blogs/new", (req, res) => {
  res.render("blogs/new");
});

app.post("/blogs", (req, res) => {
  const { author, blog } = req.body;
  blogs.push({ author, blog, id: uuid() });
  res.redirect("/blogs");
});

app.get("/blogs/:id", (req, res) => {
  const { id } = req.params;
  const blog = blogs.find((b) => b.id === id);
  res.render("blogs/show", { blog });
});

app.get("/blogs/:id/edit", (req, res) => {
  const { id } = req.params;
  const blog = blogs.find((b) => b.id === id);
  res.render("blogs/edit", { blog });
});

app.patch("/blogs/:id", (req, res) => {
  const { id } = req.params;
  const newBlogText = req.body.blog;
  const foundBlog = blogs.find((b) => b.id === id);
  foundBlog.blog = newBlogText;
  res.redirect("/blogs");
});

app.delete("/blogs/:id", (req, res) => {
  const { id } = req.params;
  blogs = blogs.filter((b) => b.id !== id);
  res.redirect("/blogs");
});

app.listen(5500, () => {
  console.log("App is listening on port 5500!");
});
