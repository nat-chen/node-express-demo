var express = require('express');
var path = require('path');
var app = express();

app.get('/', function(res, res) {
  res.send('<ul>'
    + '<li>Download <a href="/files/amazing.txt">amazing.txt</a>.</li>'
    + '<li>Download <a href="/files/missing.txt">missing.txt</a>.</li>'
    + '<li>Download <a href="/files/CCTV大赛上海分赛区.txt">CCTV大赛上海分赛区.txt</a>.</li>'
    + '</ul>');
});

app.get('/files/:file(*)', function(req, res, next){
  var filePath = path.join(__dirname, 'files', req.params.file);

  res.download(filePath, function (err) {
    console.log(err);
    if (!err) return;
    if (err.status !== 404) return next(err);
    res.statusCode = 404;
    res.send('Cant find that file, sorry!');
  });
});

app.listen(3000, () => {
  console.log('Express started on port 3000');
})