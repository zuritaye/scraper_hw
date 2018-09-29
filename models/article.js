var mongoose = require("mongoose");

// Save reference to the Schema 
var Schema = mongoose.Schema;

// Create a new UserSchema object
var ArticleSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  link: {
    type: String,
    required: true
  },
  // to store Note id
  // link the ObjectId to the Note model
  // to populate the Article with an associated Note
  note: {
    type: Schema.Types.ObjectId,
    ref: "Note"
  }
});

// create model from above schema
var Article = mongoose.model("Article", ArticleSchema);

// Export the Article model
module.exports = Article;
