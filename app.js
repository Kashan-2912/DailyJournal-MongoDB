//jshint esversion:6
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const _ = require("lodash");


const homeStartingContent = "Use Daily Journal as your personal platform to write and reflect on your thoughts, experiences, and ideas. This space is yours to express yourself freely and document your journey. Your blog entries are private and for your eyes only. Focus on your writing without the distraction of other users' content. It's your personal journal in the digital world. While you can't see posts from other users, we encourage you to draw inspiration from your own life, surroundings, and experiences. Reflect on your growth and the lessons learned along the way.  Writing regularly helps in self-reflection and personal growth. Use Daily Journal as a tool to explore your thoughts and track your progress over time. Express yourself creatively, whether through storytelling, poetry, essays, or any other form of writing that speaks to you.";
const aboutContent = "Daily Journal is a unique blogging platform designed to provide you with a personal space to write and reflect. Our mission is to foster creativity and self-expression in a private, distraction-free environment. Whether you're documenting your thoughts, sharing your experiences, or exploring new ideas, Daily Journal is here to support your writing journey. Join us and start crafting your personal narrative today.";
const contactContent = [
  "We'd love to hear from you! Whether you have questions, feedback, or suggestions, feel free to get in touch with us.",
  "Email: contact@dailyjournal.com",
  "Follow Us on Social Media:",
  "Twitter: @DailyJournal",
  "Facebook: Daily Journal",
  "Instagram: @DailyJournal",
  "Mailing Address:",
  "Daily Journal",
  "123 Inspiration Lane",
  "Creativity City, Write State, 45678",
  "We look forward to connecting with you!"
];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

const mongoUsername = process.env.MONGO_USERNAME;
const mongoPassword = process.env.MONGO_PASSWORD;
const mongoUri = `mongodb+srv://${mongoUsername}:${mongoPassword}@cluster0.26b0k0v.mongodb.net/DailyBlogDB`;

mongoose.connect(mongoUri);

const postSchema = {
  title: String,
  content: String
};

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res){
  Post.find({})
  .then(findedPost => {
    res.render("home", {startingContent: homeStartingContent, newPost: findedPost});
  });
});


app.get("/about", function(req, res){
  res.render("about", {about: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {contact: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.get("/posts/:postId", function(req, res){ //express routing
  const requestedPostId = req.params.postId;

  Post.findOne(
    {_id: requestedPostId}
  )
  .then(post => {
    res.render("post", {title: post.title, content: post.content});
  });
});

app.post("/compose", function(req, res){
  const post = new Post ({
    title: req.body.enterText,
    content: req.body.postBody
  });

  post.save()
  .then(res.redirect("/"))
  .catch(err => {console.log(err)});
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
