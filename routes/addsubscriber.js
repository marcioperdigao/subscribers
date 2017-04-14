var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
const authProvider = new cassandra.auth.PlainTextAuthProvider('iccassandra', '30002e0e7cdedcb68b36a54334d5d313');
//Set the auth provider in the clientOptions when creating the Client instance
const client = new cassandra.Client({ authProvider: authProvider,contactPoints:['52.88.166.159'] });
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
router.get('/', function (req, res, next) {
    res.render('adduser');

});
var upsertSubscriber = 'INSERT INTO people.subscribers(id,email,first_name, last_name,likes) VALUES(?,?,?,?,?)';
var upsertLiked = 'INSERT INTO people.likeds(user_id,first_name,likes) VALUES(?,?,?)';

router.post('/', function (req, res, next) {
    var id = cassandra.types.uuid();
    console.log(req.body);
    client.execute(upsertSubscriber, [id, req.body.email, req.body.first_name, req.body.last_name,0], { prepare : true }, function (err, result) {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: err });
        }
        else {
            client.execute(upsertLiked, [id, req.body.first_name,0],{ prepare : true }, function (err, response) {
                if (err) {
                    console.log(err);
                    res.status(404).send({ msg: err });

                }
                else {
                    console.log('Subscriber Add');
                    res.redirect('/');
                }
            })

        }
    });

});


module.exports = router;
