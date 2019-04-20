// Create app
const express = require('express'),
  fs = require('fs'),
  app = express(),
  router = express.Router(),
  path = __dirname + '/html/';

// Application log
app.use((req, res, next) => {
  var now = new Date().toString();
  var log = `${now}: ${req.method} ${req.url}`;
  console.log(log);
  fs.appendFileSync('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });

  next();
});

// Homepage message
app.get('/', (req, res) => {
  res.sendFile(path + 'index.html');
});

// Homepage message
app.get('/sharks', (req, res) => {
  res.sendFile(path + 'sharks.html');
});

app.use(express.static(path));
app.use('/', router);

app.listen(9000, () => {
  console.log('Server is running at 9000 port');
});