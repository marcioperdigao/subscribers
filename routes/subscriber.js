var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
const authProvider = new cassandra.auth.PlainTextAuthProvider('iccassandra', '30002e0e7cdedcb68b36a54334d5d313');
//Set the auth provider in the clientOptions when creating the Client instance
const client = new cassandra.Client({ authProvider: authProvider,contactPoints:['52.88.166.159'] });

client.connect(function(err,result){
  if(err){
    console.log(err);
  }
  else{
    console.log(result);
  }
  
});
/* GET home page. */
var getSubscriberById = "SELECT * FROM people.subscribers WHERE id = ?";
router.get('/:id', function(req, res, next) {
  client.execute(getSubscriberById,[req.params.id],function(err,result){
    if(err){
      res.status(404).send({msg: err});
    }
    else{
        console.log(result.rows);
      res.render('subscriber',{
          email: result.rows[0].email,
          id: result.rows[0].id,
          first_name: result.rows[0].first_name,
          last_name: result.rows[0].last_name,
          likes: result.rows[0].likes
      });
    }
  });

});


module.exports = router;
