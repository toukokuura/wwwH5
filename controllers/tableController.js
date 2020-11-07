var Table = require("../controllers/table");

//validate
const { body, validationResult } = require("express-validator/check");
const { sanitizeBody } = require("express-validator/filter");

//for rendering table
exports.index = function (req, res, next) {
  Table.findOne().exec((err, table) => {
    if (err) {
      return next(err);
    }
    // render latest table
    if (table) {
      res.render("index", {
        markup: table.markup
      });
    } else {
      res.render("index");
    }
  });
};

//handle saving new table after each click
exports.create = function (req, res, next) {
  sanitizeBody("*").trim().escape();

  // Create new table w data from body
  var table = new Table({
    tableID: req.body.tableID,
    markup: req.body.markup,
    player: req.body.player,
    win: req.body.win
  });

  // table.save(function (err) {
  //   if (err) {
  //     return next(err);
  //   }
  //   // Successful - redirect to main view
  //   res.redirect("/");
  // });

  // use findOneAndUpdate() instead of save()
  // returned ddoc isnt needed when saving new table state
  Table.findOneAndUpdate(
    { tableID: "0" },
    {
      tableID: req.body.tableID,
      markup: req.body.markup,
      player: req.body.player,
      win: req.body.win
    },
    { upsert: true }, // create new if nothing matches filter
    (err, doc) => {
      if (err) {
        return next(err);
      }
      // Successful - redirect to main view
      res.redirect("/");
    }
  );
};
