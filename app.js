const express = require('express');
const app = express();
const pgp = require('pg-promise')();
const mustacheExpress = require('mustache-express');
const bodyParser = require("body-parser");
const session = require('express-session');
const curl = require('curlrequest');
const fetch = require("node-fetch");
const mo = require("method-override");

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
app.use(mo('__method'))

// sessions is the cookies
app.use(session({
  secret: 'theTruthIsOutThere51',
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false }
}))


app.get("/", function(req, res){
  var logged_in; //logged in requires this
  var email;
  var id;

  if(req.session.user){ //logged in requires this
    logged_in = true; //logged in
    email = req.session.user.email;
    id = req.session.user.id
  }

  var data = { // object to send to mustache
    "logged_in": logged_in, // letting mustache know if you are logged in or not
    "email": email,
    'id': id
  }


  res.render('index', data);
});


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
        res.redirect('/user/'+user.id);
      } else {
        res.redirect('/login')
      }
    });
  });
});

// thanks Taylor & Nick & John
app.post('/broadway', function(req, res){
  console.log("app.js firing")
  const userSearch = req.body.userSearch;
    fetch("https://api-sandbox.londontheatredirect.com/rest/v2/Events",
          { method: 'GET',
            headers:{
              "Api-Key": process.env.MYKEY,
              // "X-Originating-Ip": "208.185.23.206",
              "Content-Type": "application/json"
            }
          }).then(function(dataResponse){
            console.log('json');
            return dataResponse.json()
          }).then(function(json){
            console.log("usersearch", req.body.userSearch)
            var searchResult = json["Events"].filter(
                show => show["Name"] === userSearch
              )
            console.log("searchResult", searchResult);
            // console.log('json');
            res.render('listofshows', { searchResult: searchResult});
          });
});





app.post('/formInput', function(req, res){
  if(req.session.user){
    var saveShow = req.body.showName;
    var user = req.session.user;
    db.none('INSERT INTO users_info (name, show, user_id) VALUES ($1, $2, $3)', [user.name, saveShow, user.id]).then(function(data){
      res.redirect('/user/' + user.id)
    })
  }else{
    res.redirect('/');
  }
})


app.get('/user', function(req, res){
   var logged_in; //logged in requires this
  var email;
  var id;

  if(req.session.user){ //logged in requires this
    logged_in = true; //logged in
    email = req.session.user.email;
    id = req.session.user.id
  }

  var data = { // object to send to mustache
    "logged_in": logged_in, // letting mustache know if you are logged in or not
    "email": email,
    'id': id
  }
  res.render('login', data )
});


app.get('/user/:id', function(req, res){
 var logged_in; //logged in requires this
  var email;
  var id;

  if(req.session.user){ //logged in requires this
    logged_in = true; //logged in
    email = req.session.user.email;
    id = req.session.user.id
    db.any('SELECT * FROM users_info WHERE user_id=$1', [id])
    .then(function(data){
      console.log(data)
     var showSaves = { // object to send to mustache
      'logged_in': logged_in, // letting mustache know if you are logged in or not
      'email': email,
      'id': id,
      'data': data
  }
  res.render('myprofile', showSaves)
    })
  }
});

app.get('/shows', function(req, res){
  var logged_in; //logged in requires this
  var email;
  var id;

  if(req.session.user){ //logged in requires this
    logged_in = true; //logged in
    email = req.session.user.email;
    id = req.session.user.id
  }

  var data = { // object to send to mustache
    "logged_in": logged_in, // letting mustache know if you are logged in or not
    "email": email,
    'id': id
  }


  console.log("shows firing")
  res.render('listofshows', data)
});

app.get('/webinfo', function(req, res){
    var logged_in; //logged in requires this
  var email;
  var id;

  if(req.session.user){ //logged in requires this
    logged_in = true; //logged in
    email = req.session.user.email;
    id = req.session.user.id
  }

  var data = { // object to send to mustache
    "logged_in": logged_in, // letting mustache know if you are logged in or not
    "email": email,
    'id': id
  }

  res.render('contact', data)
});

app.delete('/deletePost', function (req, res){
  if(req.session.user){
    var logged_in = true;
    var email= req.session.user.email;
    var user_id = req.session.user.id;
    var postDelete = req.body.postDelete
    // user_id = req.session.user.id
    db.none('DELETE FROM users_info WHERE id=$1',[postDelete])
    .then(function(){
        res.redirect('/user/'+ user_id)
    })
  }else{
    res.redirect('');
  }
})



app.listen(3000, function(){
  console.log('listening on port 3000!');
});

