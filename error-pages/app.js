var express = require('express');
var path = require('path');
var app = express();
var logger = require('morgan');
var silent = process.env.NODE_ENV === 'test';

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.enable('verbose errors');

if (app.settings.env === 'production') {
  app.disable('verbose errors');
}

silent || app.use(logger('dev'));

app.get('/', function(req, res) {
  res.render('index.ejs');
});

app.get('/404', function(req, res, next) {
  next(); // 没有传递 error
});

app.get('/403', function(req, res, next) {
  var err = new Error('now allowed!');
  err.status = 403;
  next(err);
});

app.get('/500', function(req, res, next) {
  next(new Error('keyboard cat!'));
});

app.use(function(req, res, next) { // 普通中间件，状态设置为 404
  res.status(404);
  res.format({
    html: function() {
      res.render('404', { url: req.url });
    },
    json: function() {
      res.json({ error: 'Not found' });
    },
    default: function() {
      res.type('txt').send('Not found');
    }
  })
});

app.use(function(err, req, res, next) { // 错误中间件，只有抛出了错误或是 next(error) 才执行
  res.status(err.status || 500);
  res.render('500', { error: err });
});

app.listen(3000, () => {
  console.log('Express started on port 3000');
});
