var express = require('express');
var path = require('path');
var app = express();
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var methodOverride = require('method-override');
var site = require('./site');
var post = require('./post');
var user = require('./user');

module.exports = app;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(logger('dev'));

app.use(methodOverride('_method'));
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// route: /
app.get('/', site.index);

// route: /users 同一个路径可执行多个路由中间件
app.get('/users', user.list);
app.all('/user/:id/:op?', user.load); // /user/:id/:op? 先于 /user/:id、/user/:id/view 等执行
app.get('/user/:id', user.view);
app.get('/user/:id/view', user.view);
app.get('/user/:id/edit', user.edit);
app.put('/user/:id/edit', user.update);

// route: /posts
app.get('/posts', post.list);

app.listen(3000, () => {
  console.log('Express started on port 3000');
})

