var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
// HTTP request for HTML page
var request = require("request");

// Our scraping tools
// SCRAPE tools / parse HTML to find elements
var cheerio = require("cheerio");
var axios = require("axios");

// Require for models
var db = require("./models");

var PORT = 3000;

// Start express
var app = express();


app.use(logger("dev"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connection to Mongo DB
mongoose.connect("mongodb://localhost/mongoHeadlines", { useNewUrlParser: true });
mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

// ROUTES
app.get("/scrape", function(req, res) {
  
  axios.get("https://www.cnn.com/").then(function(response) {

    var $ = cheerio.load(response.data);

    $("article h3").each(function(i, element) {
      
      var result = {};

      result.title = $(this)
        .children("h3")
        .text();
      result.link = $(this)
        .children("h3")
        .attr("href");

        db.Article.create(result)
        .then(function(dbArticle) {
          
          console.log(dbArticle);
        })
        .catch(function(err) {
          
          return res.json(err);
        });
    });

    res.send("Scrape Complete");
  });
});

app.get("/articles", function(req, res) {
  
  db.Article.find({})
    .then(function(dbArticle) {

      res.json(dbArticle);
    })
    .catch(function(err) {

      res.json(err);
    });
});

app.get("/articles/:id", function(req, res) {

  db.Article.findOne({ _id: req.params.id })

    .populate("note")
    .then(function(dbArticle) {
    
      res.json(dbArticle);
    })
    .catch(function(err) {
      // if error occurred
      res.json(err);
    });
});

app.post("/articles/:id", function(req, res) {

  db.Note.create(req.body)
    .then(function(dbNote) {
     
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { note: dbNote._id }, { new: true });
    })
    .then(function(dbArticle) {
    
      res.json(dbArticle);
    })
    .catch(function(err) {
      // if error occurred
      res.json(err);
    });
});

// Start the server
app.listen(PORT, function() {
  console.log("App running on port " + PORT + "!");
});

