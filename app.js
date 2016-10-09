var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var cors = require('cors');
var qs = require('querystring');
var Twit = require('twit')

var config;
try {
  config = require('./config');
}
catch(e) {
  console.log('config not found');
  config = process.env;
}
var request = require('request');

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(cors());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

mongoose.connect('mongodb://admin:admin@ds053176.mlab.com:53176/hackny2016');
var User = require("./models/user");

app.post('/post/phonenum', function(req, res) {
  var data = req.body;
  User.findOneAndUpdate({access_token: data.token}, {phone_number: data.phone_number}, {new: true}, function(err, doc) {
    if (err)
      return res.send(err);
    if (!doc)
      return res.status(404).send({message: "Not found"});
    return res.send(doc);
  })
  console.log(data);

});

app.post('/auth/twitter', function(req, res) {
  var requestTokenUrl = 'https://api.twitter.com/oauth/request_token';
  var accessTokenUrl = 'https://api.twitter.com/oauth/access_token';
  var profileUrl = 'https://api.twitter.com/1.1/account/verify_credentials.json';

  // Part 1 of 2: Initial request from Satellizer.
  if (!req.body.oauth_token || !req.body.oauth_verifier) {
    var requestTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      callback: req.body.redirectUri
    };

    // Step 1. Obtain request token for the authorization popup.
    request.post({ url: requestTokenUrl, oauth: requestTokenOauth }, function(err, response, body) {
      var oauthToken = qs.parse(body);
      // Step 2. Send OAuth token back to open the authorization screen.
      return res.send(oauthToken);
    });
  } else {
    // Part 2 of 2: Second request after Authorize app is clicked.
    var accessTokenOauth = {
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      token: req.body.oauth_token,
      verifier: req.body.oauth_verifier
    };

    // Step 3. Exchange oauth token and oauth verifier for access token.
    request.post({ url: accessTokenUrl, oauth: accessTokenOauth }, function(err, response, accessToken) {

      accessToken = qs.parse(accessToken);
      console.log("ACCESSTOKEN ", accessToken);
/*
      consumer_key: config.TWITTER_KEY,
      consumer_secret: config.TWITTER_SECRET,
      access_token: accessToken.oauth_token,
      access_token_secret: accessToken.oauth_token_secret,
*/
      var user = new User({
        twitter: accessToken.screen_name,
        access_token: accessToken.oauth_token,
        access_token_secret: accessToken.oauth_token_secret,
      })

      user.save(function(err) {
        if(err) {
          console.log(err);
          return res.status(400).send(err);
        }
        console.log('asdas');
        return res.send({token: user.access_token});
      });
    });
  }
});

var TWILIO_ACCOUNT_SID = config.TWILIO_SID;
var TWILIO_AUTH_TOKEN = config.TWILIO_AUTH_TOKEN;
var twilio = require('twilio');
var client = new twilio.RestClient(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

app.post('/post/incoming', function(req,res) {
  console.log(res);

  var resp = new twilio.TwimlResponse();
   resp.message('We have recieved your image!');

   request('https://api.clarifai.com/v1/tag?url=' + req.body.MediaUrl0 + '&access_token=' + config.CLARIFAI_TOKEN, function(error, response, body) {
     if (!error && response.statusCode == 200) {
       var data = JSON.parse(body).results[0].result.tag.classes;

       var T = new Twit({
         consumer_key: config.TWITTER_KEY,
         consumer_secret: config.TWITTER_SECRET,
         access_token: accessToken.oauth_token,
         access_token_secret: accessToken.oauth_token_secret,
       });
     }
     //return res.send(response.body);
   })
   //Render the TwiML document using "toString"
   res.writeHead(200, {
       'Content-Type':'text/xml'
   });

   res.end(resp.toString());

});


   /*

   var T = new Twit({
     consumer_key: config.TWITTER_KEY,
     consumer_secret: config.TWITTER_SECRET,
     access_token: accessToken.oauth_token,
     access_token_secret: accessToken.oauth_token_secret,
   });
*/
/*
   // first we must post the media to Twitter
T.post('media/upload', { media_data: b64content }, function (err, data, response) {
// now we can assign alt text to the media, for use by screen readers and
// other text-based presentations and interpreters
var mediaIdStr = data.media_id_string;
var altText = "Small flowers in a planter on a sunny balcony, blossoming."
var meta_params = { media_id: mediaIdStr, alt_text: { text: altText } }

T.post('media/metadata/create', meta_params, function (err, data, response) {
 if (!err) {
   // now we can reference the media and post a tweet (media will attach to the tweet)
   var params = { status: 'loving life #nofilter', media_ids: [mediaIdStr] }

   T.post('statuses/update', params, function (err, data, response) {
     console.log(data)
   })
 }*/


//var client = require('twilio')(config.ACCOUNT_SID, config.TWILIO_AUTH_TOKEN);
/*
app.post('/post/twitter', function(req, res) {

})

*/
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
