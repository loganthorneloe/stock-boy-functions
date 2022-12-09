from db import *
import random

def generate_daily_stocks():
  print('getting stocks')
  stocks = get_qualified_stocks_from_firestore()
  print('getting random sample')
  random_stocks = random.sample(stocks.items(),10)

  dailies = {}

  # recreate dict
  for item in random_stocks:
    cik = item[0]
    confidence = item[1]["confidence"]
    name = item[1]["name"]

    dailies[cik] = {
      "name": name,
      "confidence": confidence
    }

  # important this takes place after retrieving stocks in case there is a failure there
  print('deleting current collection')
  # deleting from front page info
  db.collection(u'front_page_info').document('dailies').delete()

  print('setting to firestore')    
  set_dailies_to_firestore(dailies)

generate_daily_stocks()