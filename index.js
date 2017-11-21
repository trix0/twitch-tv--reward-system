/*
Copyright 2017 Amazon.com, Inc. or its affiliates. All Rights Reserved.
Licensed under the Apache License, Version 2.0 (the "License"). You may not use this file except in compliance with the License. A copy of the License is located at
    http://aws.amazon.com/apache2.0/
or in the "license" file accompanying this file. This file is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
*/

// Define our dependencies
var express        = require('express');
var session        = require('express-session');
var passport       = require('passport');
var OAuth2Strategy = require('passport-oauth').OAuth2Strategy;
var request        = require('request');
var handlebars     = require('handlebars');

// Define our constants, you will change these with your own
const TWITCH_CLIENT_ID = '23yai1ktgs6slqezfq88sqqrixjn77';
const TWITCH_SECRET    = 'qfkjxffzsb62dhy57ccj0id45o3yo6';
const SESSION_SECRET   = 'uqfrxlye8qxbq0r858asrbfe9ebxsg';
const CALLBACK_URL     = 'https://localhost:4560/index.js';  // You can run locally with - http://localhost:3000/auth/twitch/callback

// Initialize Express and middlewares
var app = express();
app.use(session({secret: SESSION_SECRET, resave: false, saveUninitialized: false}));
app.use(express.static('public'));
app.use(passport.initialize());
app.use(passport.session());


app.listen(4560, function () {
  console.log('Twitch auth sample listening on port 3000!')


});



  var misko = {
    url: 'https://api.twitch.tv/kraken/channels/44322889/follow',
    method: 'GET',
    headers: {
      'Client-ID': "23yai1ktgs6slqezfq88sqqrixjn77",
      'Accept': 'application/vnd.twitchtv.v5+json'
    }
  };

  request(misko, function(data){

    console.log(data);
  })