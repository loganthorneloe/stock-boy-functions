from db import *
import random

def generate_twelve_daily_stocks():
  print('getting stocks')
  stocks = get_stocks_from_firestore()
  print('getting random sample')
  random_stocks = random.sample(stocks,12)

  # important this takes place after retrieving stocks in case there is a failure there
  print('deleting current collection')
  delete_collection('dailies', 12)

  print('setting to firestore')
  for item in random_stocks:
    cik = item[0]
    name_and_ticker = get_ticker_from_firestore(cik)

    stock_info = {}
    stock_info["name"] = name_and_ticker
    stock_info["analyzed"] = item[1]["analyzed"]
    set_dailies_to_firestore(stock_info, cik)

generate_twelve_daily_stocks()