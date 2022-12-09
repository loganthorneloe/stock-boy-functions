
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

print('retrieving stocks')
# id -> data
stocks_dict = get_all_stocks_from_firestore()

conf_counter = {}

stocks = {}
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
  # try:
  #   red = value['analyzed'][RED]
  #   n_a = value['analyzed'][NA]
  #   if n_a == 0:
  #     fully_analyzed.append(key)
  #   if n_a < 5:
  #     well_analyzed.append(key)
  # except:
  #   pass

  # now we have key, value, and confidence
  confidence = math.trunc(confidence*100)
  if str(confidence) not in conf_counter:
    conf_counter[str(confidence)] = 0
  conf_counter[str(confidence)] += 1

  stocks[key] = confidence

sorted_stocks = dict(sorted(stocks.items(), key=lambda item: item[1], reverse=True))
x = list(islice(sorted_stocks.items(), 0, 40))

top_40 = {}
# fully_analyzed_names = []
# well_analyzed_names = []

for data in x:
  names = get_tickers_from_firestore(data[0])
  top_40[data[0]] = {
    'name': names[0],
    'confidence' : data[1]
  }
# for data in fully_analyzed:
#   names = get_tickers_from_firestore(data)
#   fully_analyzed_names.append(names)
# for data in well_analyzed:
#   names = get_tickers_from_firestore(data)
#   well_analyzed_names.append(names)

print('top 40: ')
print(top_40)
# print('fully analyzed: ')
# print(fully_analyzed_names)
# print('well analyzed: ')
# print(well_analyzed_names)

conf_counter = dict(sorted(conf_counter.items()))

print('confidence counter:')
print(conf_counter)

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

