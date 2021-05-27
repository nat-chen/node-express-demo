var express = require('express');
var app = express();
var users = require('./db');

app.get('/', function(req, res) {
  res.format({ // 响应请求的头部字段 Accept 的类型
    html: function() {
      res.send('<ul>' + users.map(function(user) {
        return '<li>' + user.name + '</li>';
      }).join('') + '</ul>');
    },
    text: function() {
      res.send(users.map(function(user) {
        return ' - ' + user.name + '\n';
      }).join(''));
    },
    json: function() {
      res.json(users);
    }
  })
});

function format(path) {
  var obj = require(path);
  return function(req, res) {
    res.format(obj);
  };
}

app.get('/users', format('./users'));

app.listen('3000', () => {
  console.log('Express started on port 3000');
})