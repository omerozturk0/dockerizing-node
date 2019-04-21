// Create app
const express = require('express'),
  { Client } = require('@elastic/elasticsearch'),
  client = new Client({node: 'http://localhost:9200'}),
  app = express(),
  router = express.Router(),
  { writeLog } = require('./utils/log'),
  path = __dirname + '/html/';

// Application log
app.use((req, res, next) => {
  let now = new Date().toString();
  let log = `${now}: ${req.method} ${req.url}`;

  writeLog(log);

  next();
});

// Homepage message
app.get('/', (req, res) => {
  client.create({
    id: '1',
    index: 'my_custom_index',
    type: 'users',
    body: {
      mappings: {
        my_custom_type: {
          properties: {
            object: {
              type: 'nested',
              properties: {
                name: {
                  type: 'text', search_analyzer: 'simple'
                }
              }
            }
          }
        }
      }
    }
  });

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