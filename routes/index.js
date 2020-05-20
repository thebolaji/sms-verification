var express = require("express");
var router = express.Router();
const dotenv = require("dotenv").config();
var messagebird = require("messagebird")(process.env.MESSAGEBIRD_API_KEY);

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});
router.post("/", (req, res) => {
  const number = req.body.number;
  messagebird.verify.create(
    number,
    {
      template: "Your verification code is %token.",
    },
    function (err, response) {
      if (err) {
        console.log("err", err);

        res.render("index", {
          error: err.errors[0].description,
        });
      } else {
        console.log("response", response);
        res.render("verifys", { id: response.id, number });
      }
    }
  );
});

router.post("/verifys", (req, res) => {
  id = req.body.id;
  token = req.body.token;
  console.log("id & code", id, token);
  messagebird.verify.verify(id, token, function (err, result) {
    if (err) {
      console.log(err);
      res.render("index", {
        error: err.errors[0].description,
        id: id,
      });
    } else {
      console.log(result);
      res.render("sucess");
    }
  });
});
module.exports = router;
