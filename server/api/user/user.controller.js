'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.status(422).json(err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function (err, users) {
    if(err) return res.status(500).send(err);
    res.status(200).json(users);
  });
};

/**
 * Creates a new user
 */
exports.create = function (req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';

  if(req.body.role){newUser.role = 'admin';} else {newUser.role = 'user'}

  newUser.save(function(err, user) {

  	if(user.role == 'user'){
  		var nodemailer = require('nodemailer');

		// create reusable transporter object using the default SMTP transport
		var transporter = nodemailer.createTransport('smtps://smkorera%40gmail.com:1994Kingsss@smtp.gmail.com');
		// html to text plugin 
		var htmlToText = require('nodemailer-html-to-text').htmlToText;
		//attach to transporter
		transporter.use('compile', htmlToText());
		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: '"MediaBox " <simba@mediabox.co.zw>', // sender address
		    to: user.email, // list of receivers
		    subject: 'Welcome to MediaBox ', // Subject line
		    text: 'Hello world 🐴', // plaintext body
		    html: '<p><b>Thank you for registering for MediaBox.</b> You will find that it’s a great way to discover media options, build advertising campaigns and send orders and Creative directly to  publishers with no back and forth .It also helps media owners list media for free.<br> Increase your sales and boost your profits without any significant legwork by discovering cost effective advertising media options through MediaBox.<p>Here are a few resources from our getting started section that might help you out.<br/><ul><li>Step-by-Step Guide to Your First Mediabox Campaign https://www.youtube.com/watch?v=OifS1gdXafAFAQS</li><li> What publishers can I find on MediaBox? How do I benefit ? http://www.mediabox.co.zw/index.html#faq </li></ul></p><p>Again I want to welcome you to our community. I cant wait to hear about your experience with MediaBox<br/>Enjoy redefined Convenience <br>Simbarashe</p><p>P.S. I’m your customer support hero in charge of keeping you happy. If you have ANY questions... problems... or concerns... please feel free to reach out to ask me before getting frustrated (Skype: simbarashe.mukorera1, Email: smukorera@mediabox.com.zw)</p>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		});
  	}

  	if(user.role == 'admin'){
  		var nodemailer = require('nodemailer');

		// create reusable transporter object using the default SMTP transport
		var transporter = nodemailer.createTransport('smtps://smkorera%40gmail.com:1994Kingsss@smtp.gmail.com');
		// html to text plugin 
		var htmlToText = require('nodemailer-html-to-text').htmlToText;
		//attach to transporter
		transporter.use('compile', htmlToText());
		// setup e-mail data with unicode symbols
		var mailOptions = {
		    from: '"MediaBox " <simba@mediabox.co.zw>', // sender address
		    to: user.email, // list of receivers
		    subject: 'Welcome to MediaBox ', // Subject line
		    text: 'Hello world 🐴', // plaintext body
		    html: '<p><b>Thank you for registering for MediaBox.</b> You will find that it’s a great way to list your media options for free , connect with advertisers from around the globe   and  receive orders and creative directly  from  advertisers.<br> Increase your sales and boost your profits by <b>ACCESSING GLOBAL DEMAND!</b> through MediaBox.<p>Again I want to welcome you to our community. I cant wait to hear about your experience with MediaBox<br/>Enjoy redefined Convenience <br>Simbarashe</p><p>P.S. I’m your customer support hero in charge of keeping you happy. If you have ANY questions... problems... or concerns... please feel free to reach out to ask me before getting frustrated (Skype: simbarashe.mukorera1, Email: smukorera@mediabox.com.zw)</p>' // html body
		};

		// send mail with defined transport object
		transporter.sendMail(mailOptions, function(error, info){
		    if(error){
		        return console.log(error);
		    }
		    console.log('Message sent: ' + info.response);
		});
  	}

  	console.log(user);
    if (err) return validationError(res, err);
    var token = jwt.sign({_id: user._id }, config.secrets.session, { expiresInMinutes: 60*5 });
    res.json({ token: token });
  });
};

/**
 * Get a single user
 */

 // Updates an existing campaign in the DB.
exports.update = function(req, res) {
  console.log(req.body);

  // req.body.uid = req.user.email; // id change on every login hence email is used
  req.body.updated = Date.now();
  User.findById(req.params.id, function (err, user) {
    if (err) { return handleError(res, err); }
    if(!user) { return res.status(404).send('Not Found'); }
    
     user.name = req.body.name;
     user.email = req.body.email;
     user.company = req.body.company;
     user.website = req.body.website;
     user.phone = req.body.phone;
     user.address = req.body.address;
     user.photo = req.body.photo;
     user.lastname = req.body.lastname;
     user.bankname = req.body.bankname;
     user.branch = req.body.branch;
     user.accountNumber = req.body.accountNumber;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });

  });
};

exports.show = function (req, res, next) {
  var userId = req.params.id;

  User.findById(userId, function (err, user) {
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if(err) return res.status(500).send(err);
    return res.status(204).send('No Content');
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function (err, user) {
    if(user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.status(200).send('OK');
      });
    } else {
      res.status(403).send('Forbidden');
    }
  });
};

/**
 * Get my info
 */
exports.me = function(req, res, next) {
  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.status(401).send('Unauthorized');
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
