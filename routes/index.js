var express = require("express");
var router = express.Router();

// Require controllers
var tablecontroller = require("../controllers/tableController");
var Table = require("../controllers/table");

/* GET and render home page. 
this is handled in tablecontroller*/
router.get("/", tablecontroller.index);

// POST request for creating a new table
router.post("/create", tablecontroller.create);

router.get("/table/", function (req, res, next) {
  Table.findOne().exec((err, table) => {
    if (err) next(err);
    // haku onnistui
    // lähetetään mitä tietokannasta on löytynyt
    res.json(table);
  });
});

module.exports = router;
