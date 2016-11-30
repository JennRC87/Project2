const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const curl = require('curlrequest');
const fetch = require("node-fetch")
var apath = '/somepath';
var db = pgp(process.env.DATABASE_URL ||'postgres://babegrrl69@localhost:5432/logindb');
var appkey = process.env.MYKEY
/* BCrypt stuff here */
const bcrypt = require('bcrypt');

app.engine('html', mustacheExpress());
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use("/", express.static(__dirname + '/'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


app.get("/", function(req, res){
  var logged_in;
  var email;

  if(req.session.user){
    logged_in = true;
    email = req.session.user.email;
  }

  var data = {
    "logged_in": logged_in,
    "email": email
  }


  res.render('index', data);
});

// app.get("/", function(req, res){
//   res.render('index')
// });

app.post('/signup', function(req, res){
  var data = req.body;

  bcrypt.hash(data.password, 10, function(err, hash){
    db.none(
      "INSERT INTO users_li (name, email, password_digest) VALUES ($1, $2, $3)",
      [data.name, data.email, hash]
    ).then(function(){
      res.render('myprofile');
    })
  });
})

app.post('/login', function(req, res){
  var data = req.body;

  db.one(
    "SELECT * FROM users_li WHERE email = $1",
    [data.email]
  ).catch(function(){
    res.render('Email/Password not found.')
  }).then(function(user){
    bcrypt.compare(data.password, user.password_digest, function(err, cmp){
      if(cmp){
        req.session.user = user;
        res.render('myprofile');
      } else {
        res.render('login')
      }
    });
  });
});

app.post('/broadway', function(req, res){
    fetch("https://api-sandbox.londontheatredirect.com/rest/v2/Events",
          {
            headers:{
              "Api-Key": process.env.MYKEY,
              "X-Originating-Ip": "208.185.23.206",
              "Content-Type": "application/json"
            },
            type: 'get',
            dataType: 'json',
            contentType: 'application/json',
            processData: false
          }).then(function(data){
            return data.json(data)
          }).then(function(json){
            res.send(json)
          })
})

// app.get("/contact", function(req, res) {
//   db.many("SELECT * FROM buildings").then(function(data) {
//     var stuff = data;
//     res.render('buildings',{title:stuff});
//   });
// });


app.get('/user', function(req, res){
  res.render('login')
});

app.get('/userprofile', function(req, res){
  res.render('myprofile')
});

app.get('/shows', function(req, res){
  res.render('listofshows')
});

app.get('/webinfo', function(req, res){
  res.render('contact')
});

app.listen(3000, function () {
  console.log('listening on port 3000!');
});

