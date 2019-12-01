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
    "@localhost", { useNewUrlParser: true });

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

function getTweets(done) {
  /* Gets the latest record */
  Tweets.find({}, ['tweets'], { sort: { _id: -1 }, limit: 1 }, (err, data) => {
    console.log(data);
    done(null, data[0].tweets);
  });
}

module.exports = {
  get: getTweets,
  connect: connect
};