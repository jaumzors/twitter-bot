const mongoose = require('mongoose');
const config = require('../configs/dbconfigs');

/* Creates basic mongoose Schema */
const tweetsSchema = new mongoose.Schema({
  tweets: Object,
  lastUpdatedDate: Number
});
let Tweets = mongoose.model('Tweets', tweetsSchema);

function connect(done) {
  mongoose.connect("mongodb://" + config.db_username + ":" + config.db_password +
    "@" + config.hostname, { useNewUrlParser: true });

  const db = mongoose.connection;

  /* Boilerplate connection methods */
  db.on('error', () => {
    console.error.bind(console, 'connection error:')
    done("unable to connect:" + console.error);
  });

  db.once('open', () => {
    done(null);
  });
}

function saveTweets(tweets, lastUpdatedDate, done) {
  let tweetsData = new Tweets({
    tweets: tweets,
    lastUpdatedDate: lastUpdatedDate
  });

  tweetsData.save((err, data) => {
    if (!err) {
      done(null, data);
    } else {
      done(err, null);
    }
  });
}

module.exports = {
  save: saveTweets,
  connect: connect
};