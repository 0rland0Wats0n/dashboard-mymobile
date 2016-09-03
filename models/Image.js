var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ImageSchema = new Schema({
  name: String,
  description: String,
  uploaded_on: Date,
  image: Schema.Types.Mixed
});

module.exports = mongoose.model('Image', ImageSchema);
