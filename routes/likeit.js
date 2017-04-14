var express = require('express');
var router = express.Router();
var cassandra = require('cassandra-driver');
const authProvider = new cassandra.auth.PlainTextAuthProvider('iccassandra', '30002e0e7cdedcb68b36a54334d5d313');
//Set the auth provider in the clientOptions when creating the Client instance
const client = new cassandra.Client({ authProvider: authProvider, contactPoints: ['52.88.166.159'] });

client.connect(function (err, result) {
    if (err) {
        console.log(err);
    }
    else {
        console.log(result);
    }

});
var selectLikes = 'SELECT likes FROM people.likeds WHERE user_id = ?';
var moreLikeSubscribers = 'UPDATE people.subscribers SET likes = ? WHERE id = ?';
var moreLike = 'UPDATE people.likeds SET likes = ? WHERE user_id = ?';

router.get('/:id', function (req, res, next) {
    console.log("LIKE IT");
    console.log(req.params);
    var likes = 0;
    client.execute(selectLikes, [req.params.id], function (err, result) {
        if (err) {
            console.log(err);
            res.status(404).send({ msg: err });
        }
        else {
            console.log(result.rows[0].likes);
            likes = result.rows[0].likes;
            likes++;
            client.execute(moreLikeSubscribers, [likes,req.params.id], { prepare: true }, function (err, result) {
                if (err) {
                    console.log(err);
                    res.status(404).send({ msg: err });
                }
                else {
                    client.execute(moreLike, [likes,req.params.id], { prepare: true }, function (err, response) {
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

        }

    })

});


module.exports = router;
