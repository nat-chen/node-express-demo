var express = require('express');
var online = require('online');
var redis = require('redis');
var db = redis.createClient();

online = online(db);

var app = express();

app.use(function(req, res, next) {
  online.add(req.headers['user-agent']);
  next();
});

function list(ids) {
  return '<ul>' + ids.map(function(id) {
    return '<li>' + id + '</li>'
  }).join('') + '</ul>';
}

app.get('/', function(req, res, next) {
  online.last(5, function(err, ids) {
    if (err) return next(err);
    res.send('<p>Users online: ' + ids.length + '</p>' + list(ids));
  });
});

app.listen(3000, function() {
  console.log('Express started on part 3000');
})

