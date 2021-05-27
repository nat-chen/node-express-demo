// 引入模块
const express = require('express');
const hash = require('pbkdf2-password')();
const path = require('path');
const session = require('express-session');
const app = express();

// 配置
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// 中间件
app.use(express.urlencoded({
  extended: false,
}));
app.use(session({
  resave: false,
  saveUninitialized: false,
  secret: 'shhhh, very secret'
}));

// 会话持久化中间件
app.use((req, res, next) => {
  const err = req.session.error;
  const msg = req.session.success;
  delete req.session.error;
  delete req.session.success;
  res.locals.message = '';
  if (err) {
    res.locals.message = '<p class="msg error">' + err + '</p>';
  }
  if (msg) {
    res.locals.message = '<p class="msg success">' + msg + '</p>';
  }
  next();
})

// 临时数据库
const users = {
  tj: { name: 'tj' }
};

// 创建用户时生成 salt 和 hash 密码
hash({ password: 'foobar' }, function(err, pass, salt, hash) {
  if (err) throw err;
  users.tj.salt = salt;
  users.tj.hash = hash;
});

// 验证
function authenticate(name, pass, fn) {
  const user = users[name];
  if (!user) return fn(new Error('cannot find user'));
  hash({ // 基于 password 和 salt 生成 hash，同之前保存的 hash 比对
    password: pass,
    salt: user.salt
  }, function(err, pass, salt, hash) {
    if (err) return fn(err);
    if (hash === user.hash) return fn(null, user);
    fn(new Error('invalid password'));
  })
}

function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = 'Access denied';
    res.redirect('/login');
  }
}

app.get('/', function(req, res) {
  res.redirect('/login');
});

app.get('/restricted', restrict, function(req, res) {
  res.send('Wahoo! restricted area, click to <a href="/logout">logout</a>');
});

app.get('/logout', function(req, res) {
  req.session.destroy(function() { // 登出后，销毁 session
    res.redirect('/');
  });
});

app.get('/login', function(req, res) {
  res.render('login');
});

app.post('/login', function(req, res) {
  authenticate(req.body.username, req.body.password, function(err, user) {
    console.log(req.session)
    if (user) {
      // 重新生成 session。一旦生成新的 sessionId 的 session 实例会初始化在 req.session 对象中，同时回调函数将调用。
      req.session.regenerate(function() {
        req.session.user = user;
        req.session.success = 'Authenticated as ' + user.name
          + ' click to <a href="/logout">logout</a>. '
          + ' You may now access <a href="/restricted">/restricted</a>.';
        res.redirect('back'); // 返回上一页，如果没有 referer，默认返回 '/'
      });
    } else {
      req.session.error = 'Authentication failed, please check your '
        + ' username and password.'
        + ' (use "tj" and "foobar")';
      res.redirect('/login');
    }
  });
});

app.listen(3000, () => {
  console.log('Express started on port 3000');
});
