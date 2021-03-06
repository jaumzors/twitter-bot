const Twitter = require('twitter');
const config = require('./configs/config.js');
const _ = require('lodash');
const async = require('async');
const repo = require('./services/repository.js');
const moment = require('moment');
const CronJob = require('cron').CronJob;

let t = new Twitter(config);

let tagList = process.env.TWITTER_TAGS || "";
let tweets = [];

/* Fetches n tweets per tag */
function fetchTweets(params, callback) {

  t.get('search/tweets', params, (err, data) => {
    if (!err) {
      console.log(params.q + " tweets");
      data.statuses.forEach(status => {
        let tweetsFromTag = {
          hashTag: params.q,
          userName: status.user.name,
          screenName: status.user.screen_name,
          followersCount: status.user.followers_count,
          tweet: status.text
        }
        tweets.push(tweetsFromTag);
      });
      callback();
    } else {
      console.log("Unable to fetch tweets for #" + params.q);
      console.log(err);
    }
  });
}

/* Start the collection process */
function collectTweets(done) {
  let tags = tagList.split(',');

  if (tagList.length === 0) {
    console.error("Please inform a least 1 tag.");
  } else {

    /* For each tag fetches the tweets */
    async.forEachOf(tags, function (tag, key, callback) {

      let params = {
        q: "#" + tag,
        count: process.env.NUMBER_OF_TWEETS || 5,
        result_type: 'recent'
      };

      fetchTweets(params, callback);

    }, function (err) {

      if (!err) {
        console.log(tweets);
        /* Try to save the tweets */
        repo.save(tweets, moment.now(), (err, data) => {
          console.log("Tweets saved successfully.");
          done();
        });
      } else {
        console.log("Unable to fetch tweets");
      }
    });
  }
}

/* Waits for a connection before trying to fetch data */
repo.connect((err) => {
  if (!err) {
    /* Creates cron job to collect data every n minutes */
    const interval = process.env.CRON_MINUTES_INTERVAL || 1;
    const job = new CronJob('0 */' + interval + ' * * * *', () => {
      collectTweets(()=>{});
    });
    console.log("Collect tweets job instantiated");
    job.start();
  } else {
    console.log(err);
  }
});