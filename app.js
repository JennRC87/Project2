var express = require('express');
var app = express();
var mustacheExpress = require('mustache-express');
var pgp = const pgp = require('pg-promise')();
var db = pgp(process.env.DATABASE_URL ||'postgres://babegrrl69@localhost:5432/project2');

var apath = '/somepath';

const PORT = process.env.PORT || 3000;


app.listen(3000,function(){
  console.log('server is alive on 3000.')
})

app.get('/', function (req, res){
  res.send("Hello, it's me")
})

app.post('/', function (req, res){
  res.send("Hello")
})

app.engine('html', mustacheExpress())
app.set('view engine', 'html')
app.set('views', __dirname+apath)
app.use(express.static(__dirname+'/public'))
