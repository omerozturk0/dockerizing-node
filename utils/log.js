'use strict';

const fs = require('fs');

exports.writeLog = (log) => {
  fs.appendFileSync('server.log', log + '\n', (err) => {
    if (err) {
      console.log('Unable to append to server.log.');
    }
  });
}