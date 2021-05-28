var escapeHtml = require('escape-html');
var express = require('express');
var fs = require('fs');
var marked = require('marked');
var path = require('path');
var app = express();

app.engine('md', function(path, options, fn) { // md 类型处理，path 为 render 指向的文件路径，options 含 tittle 属性
  fs.readFile(path, 'utf8', function(err, str) { 
    if (err) return fn(err);
    var html = marked.parse(str).replace(/\{([^}]+)\}/g, function(_, name) { // 替换 md 文件中 {title} 变量内容
      return escapeHtml(options[name] || '');
    });
    fn(null, html);
  });
});

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'md');
app.get('/', function(req, res) {
  res.render('index', { title: 'Markdown Example' });
});
app.get('/fail', function(req, res) {
  res.render('missing', { title: 'Markdown Example' });
});

app.listen(3000, () => {
  console.log('Express started on port 3000');
});
