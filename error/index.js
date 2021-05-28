var express = require('express');
var logger = require('morgan');
var app = express();
var test = app.get('env') === 'test';

if (!test) app.use(logger('dev'));

function error(err, req, res, next) {
  if (!test) console.log(err.stack);
  res.status(500);
  res.send('Interval Server Error');
}

app.get('/', function(req, res) {
  // Caught and passed down to the errorHandler middleware
  throw new Error('something broke!');
});

app.get('/next', function(req, res, next) {
  // process.nextTick() represent an async operation in real life
  process.nextTick(function() {
    next(new Error('oh no!'));
  });
});

app.use(error); // 错误中间件，捕获无论异步还是同步抛错

app.listen(3000, () => {
  console.log('Express started on port 3000');
});
