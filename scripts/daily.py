from db import *
import random

def determine_stock_confidence(ret_dict):

  denom = ret_dict["red"] + ret_dict["neutral"] + ret_dict["N/A"] + ret_dict["green"]
  numer = (ret_dict["neutral"] * .5) + ret_dict["green"]
  percentage = numer/denom
  return percentage

def generate_twelve_daily_stocks():
  print('getting stocks')
  stocks = get_stocks_from_firestore()
  print('getting random sample')
  random_stocks = random.sample(stocks,12)

  # important this takes place after retrieving stocks in case there is a failure there
  print('deleting current collection')
  delete_collection('dailies', 12)
  # deleting from front page info
  db.collection(u'front_page_info').document('dailies').delete()

  print('setting to firestore')
  for item in random_stocks:
    cik = item[0]
    name_and_ticker = get_tickers_from_firestore(cik)

    stock_info = {}
    stock_info["name"] = name_and_ticker[0]
    stock_info["analyzed"] = item[1]["analyzed"]
    stock_info["confidence"] = determine_stock_confidence(item[1]["analyzed"])

    set_dailies_to_firestore(stock_info, cik)

generate_twelve_daily_stocks()