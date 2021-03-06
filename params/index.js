var express = require('express');
var app = express();

var users = [
  { name: 'tj' },
  { name: 'tobi' },
  { name: 'loki' },
  { name: 'jane' },
  { name: 'bandit' },
];

function createError(status, message) {
  var err = new Error(message);
  err.status = status;
  return err;
}

app.param(['to', 'from'], function(req, res, next, num, name) {
  req.params[name] = parseInt(num, 10); // num: 1/2, name: to, from
  if (isNaN(req.params[name])) {
    next(createError(400, 'failed to parseInt ' + num));
  } else {
    next();
  }
});

app.param('user', function(req, res, next, id) {
  if (req.user = users[id]) {
    next();
  } else {
    next(createError(404, 'failed to find user'));
  }
});

app.get('/', function(req, res) {
  res.send('Visit /user/0 or /uers/0-2');
});

app.get('/user/:user', function(req, res, next) { // /user/1
  res.send('user ' + req.user.name);
});

app.get('/users/:from-:to', function(req, res, next) { //users/0-1, from is 0, to is 1
  var from = req.params.from;
  var to = req.params.to;
  var names = users.map(function(user) { return user.name });
  res.send('users ' + names.slice(from, to + 1).join(', '));
});

app.listen(3000, () => {
  console.log('Express started on port 3000');
})