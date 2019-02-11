const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const articleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  isLocked: { type: Boolean, default: false, required: true },
  edits: [ { type: Schema.Types.ObjectId, ref: 'Edit' } ],
  creationDate: { type: Date, required:true, default: Date.now }
});

const Article = mongoose.model('Article', articleSchema);
module.exports = Article;