var express = require("express");
var app     = express();
//var path    = require("path");

app.use(express.static(__dirname + '/public')); //Serves resources from public folder

app.use(express.static(__dirname + '/views')); //Store all HTML files in view folder.

app.use(express.static(__dirname + '/scripts')); //Store all JS and CSS in Scripts folder.

app.get('/',function(req,res){
  res.sendfile('index.html');
  //It will find and locate index.html from View or Scripts
});

app.listen(3000);

console.log("Running at Port 3000");