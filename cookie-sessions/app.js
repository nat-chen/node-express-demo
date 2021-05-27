var cookiesSession = require('cookie-session');
var express = require('express');
var app = express();

// add req.session cookie support
app.use(
  cookiesSession({
    secret: 'manny is cool'
  })
);

// using custom middleware to do something with the session
app.use(count);

function count(req, res) {
  req.session.count = (req.session.count || 0) + 1;
  res.send('viewed ' + req.session.count + ' times\n');
}

app.listen(3000, () => {
  console.log('Express started on port 3000');
});