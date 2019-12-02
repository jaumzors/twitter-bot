# twitter-bot
Simple twitter bot that collects the top n tweets every n minutes.

# How to use it
Create a .env file with the following variables in the project root:
```
CONSUMER_KEY
CONSUMER_SECRET
ACCESS_TOKEN_KEY
ACCESS_TOKEN_SECRET
TWITTER_TAGS
NUMBER_OF_TWEETS
DB_USERNAME
DB_PASSWORD
DB_SERVICE_NAME
CRON_MINUTES_INTERVAL
```

Use ```docker-compose up -d --build``` to start the bot, api and local mongodb.
