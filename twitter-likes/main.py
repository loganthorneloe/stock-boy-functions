# import base64
import tweepy
# from pprint import pprint
# from datetime import datetime, timedelta
# import time
import smtplib, ssl

# num tweets to like in each topic
num = 5

# topics for tweets to like
topics = [ 
        'start investing', 
        'dividend investing',
        'dividend stocks',
        'financial security', 
        'financial independence', 
        'roth IRA',
        'personal finance', 
        'exchange traded fund', 
        'retirement planning', 
        'trim budget', 
        'starting a side hustle', 
        'passive income',
        'ETF',
        'REIT']

def send_text_email(input_string):

    print("sending email...")

    port = 465  # For SSL

    # TODO: look at google oauth to make this more secure: https://realpython.com/python-send-email/

    with open("google_auth.txt") as temp_file:
            auth = [line.rstrip('\n') for line in temp_file]

    password = auth[1]

    # Create a secure SSL context
    context = ssl.create_default_context()

    subject ="Liking Confirmation"

    text = input_string

    message = 'Subject: {}\n\n{}'.format(subject, text)

    recipients = ['loganthorneloe@gmail.com']

    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(auth[0], password)
        # TODO: Adjust email here
        server.sendmail(auth[0], recipients, message)
        print('text email sent...')

def like_by_topic(api, topic, num):
    print('liking topic: ' + topic)
    results = api.search(topic, count=num)
    for tweet in results:
        id = tweet.id
        try:
            api.create_favorite(id)
        except:
            pass
        # time.sleep(3)

def tweet(api, content):
    print('tweeting...')
    api.update_status(content)

def get_creds():
    with open("twitter_auth.txt") as temp_file:
        auth = [line.rstrip('\n') for line in temp_file]
    return auth[0].split(' ')[2], auth[1].split(' ')[2], auth[2].split(' ')[2], auth[3].split(' ')[2]

def like_some_twits(event, context):

    send_string = "Liked these topics: "

    # set everything up
    consumer_key, consumer_secret, access_key, access_secret = get_creds()
    auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_key, access_secret)
    api = tweepy.API(auth)

    # start liking some twits

    # send_text_email("Starting to like " + str(num) + " topics.")

    for topic in topics:
        send_string += "\n" + topic
        like_by_topic(api, topic, num)  

    # send_text_email(send_string)