var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var TableSchema = new Schema({
  // a string of x, o and null. left2right up2down
  tableID: { type: String },
  markup: { type: [] },
  player: { type: String },
  win: { type: String }
});

//export model
module.exports = mongoose.model("Table", TableSchema);
