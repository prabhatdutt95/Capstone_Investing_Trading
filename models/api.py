from flask import Flask, request
from flask_cors import CORS
import pandas as pd
import pandas_datareader as web
from sqlalchemy import create_engine

# Twitter related Library
import tweepy

import os
import json
from textblob import TextBlob
from datetime import datetime, timedelta


app = Flask(__name__)
CORS(app)
app.config["DEBUG"] = True
stock_list = []
df = pd.read_csv('Nifty50.csv')
stock_list = json.loads(df.to_json(orient="records"))
stock_list = {'res': stock_list}

def authentication():
    """
    Twitter authentication
    Args: None
    Returns:
    api (object): tweepy.API 
    """
    consumer_key = os.environ.get('Twitter_Consumer_Key')
    consumer_secret = os.environ.get('Twitter_Consumer_Secret')
    access_token = os.environ.get('Twitter_Access_Token')
    access_tokenSecret = os.environ.get('Twitter_Access_TokenSecret')
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_tokenSecret)
    api = tweepy.API(auth)
    return api


@app.errorhandler(404)
def page_not_found(e):
    """
    Page not Found Error Handler
    Args:
    e (error): 404 error obtained
    Returns:
    template (html): HTML content with a paragraph content
    """
    return "<h1>404</h1><p>The resource could not be found.</p>", 404


@app.route('/', methods=['GET'])
@app.route('/all', methods=['GET'])
def get_stock_list():
    """
    List all the stocks in nifty50
    Args: None
    Returns:
    stock_list (Dictionary): Returns all the stocks details as value for 'res' key
    """
    return stock_list

# This is used to predict the stock prices by taking the value from database for respective stock
@app.route('/predict', methods=['GET'])
def get_predictions():
    """
    List all the stocks in nifty50
    Args: None
    Returns:
    stock_list (Dictionary): Returns all the stocks details as value for 'res' key
    """
    if 'id' in request.args:
        sector = request.args['id']

        database_filename = 'DatabaseStock/'+sector+'.db'
        table_name = sector
        engine = create_engine('sqlite:///{}'.format(database_filename))
        df = pd.read_sql(table_name, engine)

        return {'res': [{k: df.values[i][v] for v, k in enumerate(df.columns)} for i in range(len(df))]}


def get_tweets(keyword, noOfTweet):
    """
    List of tweets from twitter for a particular keywork and number of tweets
    Args:
    keyword (string): keyword for searching in Twitter
    noOfTweet (int): Number of tweets
    Returns:
    tweets_list (Dictionary): Returns list of tweets with data
    """
    api = authentication()
    tweets = tweepy.Cursor(api.search, q=keyword, tweet_mode="extended", languages=[
                           "en"]).items(noOfTweet)
    tweets_list = [{'name': tweet.user.name, 'screen_name': tweet.user.screen_name, 'tweet': tweet.full_text,
                    'polarity': TextBlob(tweet.full_text).sentiment.polarity} for tweet in tweets]
    return tweets_list


@app.route('/tweets', methods=['GET'])
def get_polarity():
    """
    To generate twitter Sentiment analysis for a list of tweets
    Polarity for each tweets is analysed and percentage is generated for each polarity i.e.,[Positive, Neutral, Negative]
    Args: None
    Returns:
    tweeter_result (Dictionary): Returns list of tweets with data with polarity data
    """
    tweeter_result = {}
    if 'keyword' in request.args:
        keyword = request.args['keyword']
        noOfTweet = 150 # By default, I have added 150 as number of tweets
        polarity_data = [0]*3  # [Positive, Neutral, Negative]
        tweets_list = get_tweets(keyword, noOfTweet)
        for data in tweets_list:
            if data['polarity'] > 0:
                polarity_data[0] += 1
            elif data['polarity'] < 0:
                polarity_data[2] += 1
            else:
                polarity_data[1] += 1
        for idx, polarity in enumerate(polarity_data):
            polarity_data[idx] = 100 * float(polarity)/float(noOfTweet)
        polarity_index = polarity_data.index(max(polarity_data))
        tweeter_result['polarity_status'] = 'Positive' if polarity_index == 0 else 'Neutral' if polarity_index == 1 else 'Negative'
        tweeter_result['data'] = tweets_list
    return tweeter_result

@app.route('/pastData', methods=['GET'])
def get_previous_days_data():
    """
    To provide past data of a particular stock and 'n' number of days ago
    Args: None
    Returns:
    previous_days_data (Dictionary): Returns past data of a particular stock and 'n' number of days ago
    """
    previous_days_data = {}
    if 'code' in request.args and 'days' in request.args:
        code = request.args['code']
        no_of_days = int(request.args['days'])
        start_date = datetime.today() - timedelta(no_of_days)
        end_date = datetime.today()
        previous_days_data = web.DataReader(code+'.NS', data_source='yahoo', start=datetime.strftime(
            start_date, '%Y-%m-%d'), end=datetime.strftime(end_date, '%Y-%m-%d')).round(2)
        previous_days_data.reset_index(level=0, inplace=True)
        previous_days_data = json.loads(
            previous_days_data.to_json(orient="records"))
        previous_days_data = {'res': previous_days_data}
    return previous_days_data


if __name__ == '__main__':
    app.run(debug=True)
