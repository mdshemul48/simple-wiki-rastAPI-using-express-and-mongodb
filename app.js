const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");

app = express();
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/wikiDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const articleScheme = mongoose.Schema({
  title: String,
  content: String,
});
const Article = mongoose.model("Article", articleScheme);
app
  .route("/articles")
  .get(function (req, res) {
    // this will show all the articles from db
    Article.find({}, (err, articles) => {
      if (!err) {
        res.send(articles);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
    // this will add a article in db
    const articleTitle = req.body.title;
    const articleContent = req.body.content;
    const article = Article({
      title: articleTitle,
      content: articleContent,
    });
    article.save(function (err) {
      if (!err) {
        res.send({ status: "ok" });
      } else {
        res.send({ status: err });
      }
    });
  })
  .delete(function (req, res) {
    // this will remove all articles from db
    Article.deleteMany(function (err) {
      if (!err) {
        res.send({ status: "ok" });
      } else {
        res.send(err);
      }
    });
  });

app
  .route("/articles/:articleTitle")
  .get(function (req, res) {
    // this will send a article from db
    const title = req.params.articleTitle;
    Article.findOne({ title: title }, function (err, article) {
      if (!err && article) {
        res.send(article);
      } else {
        res.send([]);
      }
    });
  })
  .put(function (req, res) {
    // this will replace a entire article in db
    const title = req.params.articleTitle;
    const newTitle = req.body.title;
    const newContent = req.body.content;
    Article.update(
      { title: title },
      { title: newTitle, content: newContent },
      { overwrite: true },
      function (err) {
        if (!err) {
          res.send("updated");
        } else {
          res.send(err);
        }
      }
    );
  })
  .patch(function (req, res) {
    // this will update spasific field or article from db
    const title = req.params.articleTitle;
    Article.update({ title: title }, { $set: req.body }, function (err) {
      if (!err) {
        res.send("updated");
      } else {
        res.send(err);
      }
    });
  })
  .delete(function (req, res) {
    // this will delete spasific article from db
    const title = req.body.title;
    Article.deleteOne({ title: title }, function (err) {
      if (!err) {
        res.send("deleted");
      } else {
        res.send(err);
      }
    });
  });
app.listen(3000, () => {
  console.log("listen on http://localhost:3000");
});
