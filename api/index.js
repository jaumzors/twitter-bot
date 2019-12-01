const express = require('express');
const app = express();
const port = 3000;
const repo = require('./services/repository.js');
const _ = require('lodash');

app.get('/health', (req, res) => {
  res.json({
    statusCode: 200,
    status: 'up'
  });
});

app.get('/tweets-info', (req, res) => {
  repo.get((err, data) => {
    if (!err) {

      let sortedData = _.orderBy(data, ['followersCount'], ['desc']);
      res.json(sortedData.slice(0,5));

    } else {
      res.send('error');
    }
  })
});

repo.connect((err, data) => {

  if (!err) {
    app.listen(port, () => console.log(`api started`))
  } else {
    console.log("Unable to connect to database.");
  }

});