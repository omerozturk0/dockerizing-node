// Create app
const express = require('express'),
  { createLogger, format, transports } = require('winston'),
  { combine, timestamp, label, printf } = format,
  { Client } = require('@elastic/elasticsearch'),
  client = new Client({node: 'http://elasticsearch:9200'}),
  app = express(),
  router = express.Router(),
  path = __dirname + '/html/';

const myFormat = printf(({ level, message, label, timestamp }) => {
  return `${timestamp} [${label}] ${level}: ${message}`;
});

const logger = createLogger({
  level: 'info',
  format: combine(
    label({ label: 'right meow!' }),
    timestamp(),
    myFormat
  ),
  defaultMeta: { service: 'user-service' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log`
    // - Write all logs error (and below) to `error.log`.
    //
    new transports.File({ filename: 'error.log', level: 'error' }),
    new transports.File({ filename: 'combined.log' })
  ]
});

// Homepage message
app.get('/', (req, res) => {
  // callback API
  client.search({
    index: 'my_custom_index',
    body: {
      query: {
        match_all: {}
      }
    }
  }, (err, { body }) => {
    if (err) logger.error(err);
  });

  res.sendFile(path + 'index.html');
});

// Homepage message
app.get('/sharks', (req, res) => {
  res.sendFile(path + 'sharks.html');
});

app.get('/log/:file', (req, res) => {
  res.sendFile(`${__dirname}/${req.params.file}.log`);
});

app.use(express.static(path));
app.use('/', router);

app.listen(9000, () => {
  console.log('Server is running at 9000 port');
});