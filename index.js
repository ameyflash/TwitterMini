var express = require('express');
var app = express();
var router = express.Router();
var bodyParser = require('body-parser');
var User = require('./models/user-model');
var Tweet = require('./models/tweet-model');
var Detail = require('./models/user-details');

var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var config = { 'secret' : 'ameykey'};

const { check, validationResult } = require('express-validator/check');
const pageLimit = 2;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
//app.use(expressValidator());

var mongoose = require('mongoose');
const { db } = require('./models/user-model');
mongoose.connect("mongodb://localhost:27017/TwitterMini");

var port = process.env.PORT || 3000;

router.get('/', function(req, res) {
    res.send('Select Register or Login');   
});

router.route('/register')
    .post([
        check('uname','Username is required').notEmpty(),
        check('uname','Username must contain at least 4 characters').isLength({min:4, max:10}),
        check('eaddr','Email is required').notEmpty(),
        check('eaddr','Invalid email').isEmail(),
        check('pswd','Password is required').notEmpty(),
        check('pswd','Password must contain at least 4 characters').isLength({min:4}),
        check('cpswd','ConfirmPassword is required').notEmpty(),
        check('cpswd','ConfirmPassword must contain at least 4 characters').isLength({min:4})
        ], function(req, res) {

            var errors = validationResult(req);
            if(!errors.isEmpty()) {
                res.send(errors);
            }
            else {
                if (req.body.pswd == req.body.cpswd) {
                    var hashedPassword = bcrypt.hashSync(req.body.pswd, 8);
                    var user = new User();
                    user.uname = req.body.uname;
                    user.eaddr = req.body.eaddr;
                    user.pswd = hashedPassword;
                    
                    User.findOne({ uname : user.uname}, function(err, usr){
                        if (err)
                            res.send(err);

                        if (usr) {
                            res.send("User Exists");   
                        }
                        else {
                            user.save(function(err) {
                                if (err)
                                    res.send(err);
        
                                var token = jwt.sign({ id: user._id }, config.secret, { expiresIn: 86400 });
                                //res.send('User Created.Go to Login');
                                res.send({auth: true, token: token});
                            });
                        }
                    });
                }
                else {
                    res.send("Password Doesn't Match");
                }
            }
        })

    .get(function(req, res) {
        User.find({}, { __v : 0 }, function(err, users) {
            if (err)
                res.send(err);
            res.json(users);
        });
    });

router.route('/login')
    .get(function(req, res) {
        var token = req.headers['x-access-token'];
        if (!token)
            res.send({ auth: false, message: 'No token provided.' });
        
        jwt.verify(token, config.secret, function(err, decoded) {
        if (err)
            res.send({ auth: false, message: 'Failed to authenticate token.' });
        
        User.findById(decoded.id, function (err, user) {
            if (err)
                res.send("There was a problem finding the user.");
            if (!user)
                res.send("No user found.");
            
            res.status(200).send(user);
            });
        });
    })

    .post(function(req, res) {
        User.findOne({ uname: req.body.uname }, function (err, user) {
            if (err)
                res.send(err);

            if(user) {
                var passwordIsValid = bcrypt.compareSync(req.body.pswd, user.pswd);
                if (!passwordIsValid)
                    res.send("Wrong Password");
                if (passwordIsValid)
                    res.send("Login Successful. Go to Main-Page");
            }
            else {
                res.send("No user Found");
            }
        });
    });

router.route('/login/details')
    .get(function(req, res){
        Detail.find({}, { __v : 0}, function(err, det){
            if(err)
                res.send(err);
            res.send(det);
        })
    })
    .post(function(req, res){
        var det = new Detail();
        det.num = req.body.num;
        det.age = req.body.age;
        det.dob = req.body.dob;
        det.gender = req.body.gender;

        det.save(function(err){
            if(err)
                res.send(err);
            res.send("Details Saved");
        });
    });

router.route('/create-tweet')
    .post(function(req, res) {
        var twt = new Tweet();
        twt.uname = req.body.uname;
        twt.tweet = req.body.tweet;

        twt.save(function(err) {
            if (err)
                res.send(err);

            res.send('Tweet Created. Go to Main-page');
        });
    });
router.route('/main-page/:page')
    .get(function(req, res) {
        var page = req.params.page;
        var skip = (page - 1) * pageLimit;
        Tweet.find({}, { __v : 0 }, function(err, twt) {
            if (err)
                res.send(err);
            res.send(twt);
        }).skip(skip).limit(pageLimit);
    });

router.route('/main-page/:user_uname')
    .get(function(req, res) {
        Tweet.find({ uname: req.params.user_uname }, { __v : 0 }, function (err, twt) {
            if (err)
                res.send(err);
            res.send(twt);
        });
    });

router.route('/main-page/:tweet_id')
    .put(function(req, res) {
        Tweet.findById(req.params.tweet_id, function(err, twt) {
            if (err)
                res.send(err);

            twt.uname = req.body.uname;
            twt.tweet = req.body.tweet;

            twt.save(function(err) {
                if (err)
                    res.send(err);
                res.send('Tweet updated!');
            });
        });
    })

    .delete(function(req, res) {
        Tweet.remove({ _id: req.params.tweet_id }, function(err, twt) {
            if (err)
                res.send(err);

            res.send('Tweet deleted');
        });
    });

app.use('/', router);
app.listen(port, () => {
    console.log('Listening at ' + port);
});
