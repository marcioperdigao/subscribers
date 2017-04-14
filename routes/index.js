var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
const authProvider = new cassandra.auth.PlainTextAuthProvider('iccassandra', '30002e0e7cdedcb68b36a54334d5d313');
//Set the auth provider in the clientOptions when creating the Client instance
const client = new cassandra.Client({ authProvider: authProvider, contactPoints: ['52.88.166.159'] });
//
client.connect(function (err, result) {
  if (err) {
    console.log(err);
  }
  else {
    console.log(result);
  }

});
/* GET home page. */
var getLikeds = "SELECT * FROM people.likeds";

router.get('/', function (req, res, next) {
  var rowsLikes = [];

  client.execute(getLikeds, function (err, resultLikes) {
    if (err) {
      res.status(404).send({ msg: err });
    }
    else {
      console.log("LIKEDS");
      for (var item in resultLikes.rows) {
        rowsLikes[item] = resultLikes.rows[item];
      }
      function mycomparator(a, b) {
        return b.likes - a.likes;
      }

      rowsLikes.sort(mycomparator);
      console.log(rowsLikes);
      res.render('index', { likeds: rowsLikes });
    }
  });


});

module.exports = router;
