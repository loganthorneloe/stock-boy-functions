
from db import *
from itertools import islice
import math
# need to collect entire dictionary 
# split into > 75%, >50%, >25%, and terrible buckets -> put this info into firebase
# sort by confidence -> only add top 40 to firebase w/confidence to sort again
# create list of stocks with no black or red entries -> add to firebase

# need to add these to the database according to data so we have historical data here

RED = "red"
GREEN = "green"
NEUTRAL = "neutral"
NA = "N/A"

# grab current year and month
currentMonth = datetime.now().month
currentYear = datetime.now().year
update_key = str(currentYear) + "-" + str(currentMonth)

def determine_stock_confidence(analyzed_dict):

  denom = analyzed_dict[RED] + analyzed_dict[NEUTRAL] + analyzed_dict[NA] + analyzed_dict[GREEN]
  numer = (analyzed_dict[NEUTRAL] * .5) + analyzed_dict[GREEN]

  percentage = numer/denom

  return percentage

def market_overview_update():

  print('retrieving stocks')
  # id -> data
  stocks_dict = get_all_stocks_from_firestore()

  conf_counter = {}
  top_40 = {}
  stocks = {}
  over_60_conf = {}
  # fully_analyzed = []
  # well_analyzed = []

  for item in stocks_dict:
    key= item[0] # cik
    value = item[1] # analyzed/simplified dict
    try:
      confidence = value['analyzed']['confidence']
    except:
      try:
        confidence = determine_stock_confidence(value['analyzed'])
      except:
        continue # skip this stock

    # now we have key, value, and confidence
    confidence = math.trunc(confidence*100)
    if str(confidence) not in conf_counter:
      conf_counter[str(confidence)] = 0
    conf_counter[str(confidence)] += 1

    stocks[key] = confidence

  sorted_stocks = dict(sorted(stocks.items(), key=lambda item: item[1], reverse=True))

  # getting top 40 list and filling in first part of over 60% to lessen requests
  x = list(islice(sorted_stocks.items(), 0, 40))

  for data in x:
    names = get_tickers_from_firestore(data[0])
    top_40[data[0]] = {
      'name': names[0],
      'confidence' : data[1]
    }
    over_60_conf[data[0]] = {
      'name': names[0],
      'confidence' : data[1]
    }

  print('top 40: ')
  print(top_40)

  # creating a counter of all confidences -> used for market overview
  conf_counter = dict(sorted(conf_counter.items()))

  print('confidence counter:')
  print(conf_counter)

  # grabbing all companies with over 60% confidence
  for cik, confidence in sorted_stocks.items():
    if confidence < 60:
      break
    if cik in over_60_conf:
      continue
    names = get_tickers_from_firestore(cik)
    over_60_conf[cik] = {
      'name': names[0],
      'confidence' : confidence
    }

  print('stocks over 60 confidence: ')
  print(over_60_conf)

  # top 40 -> no red or black aligns with this
  # updates > year_month > top_40 > name: confidence
  # front_page_info > top_40 > name: confidence
  set_top_40(update_key, top_40)
  print('set top 40')

  # buckets
  # updates > year_month > current_total_market > percent: num_stocks
  # front_page_info > market_overview > percent: num_stocks # only if this is the most recent
  set_market_overview(update_key, conf_counter)
  print('set market overview')

  # over 60 conf
  # updates > year_month > over_60_conf > name: confidence
  # front_page_info > over_60_conf > name: confidence
  set_over_60_conf(update_key, over_60_conf)
  print('set over 60 conf')

market_overview_update()