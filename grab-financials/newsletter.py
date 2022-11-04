from db import *
from pprint import pprint
from datetime import datetime

def determine_stock_confidence(ret_dict):

  try:

    denom = ret_dict["red"] + ret_dict["neutral"] + ret_dict["N/A"] + ret_dict["green"]
    numer = (ret_dict["neutral"] * .5) + ret_dict["green"]
    percentage = numer/denom
    return percentage
  
  except:
    pprint(ret_dict)
    quit()

names_and_ciks = {}

def get_names_from_cik(cik):
  tickers = names_and_ciks.get(cik)
  if tickers != None:
    return tickers
  tickers = get_tickers_from_firestore(cik)
  if tickers == None:
    names_and_ciks[cik] = cik
    return cik
  else:
    names_and_ciks[cik] = tickers
    return tickers

# grab current year and month
currentMonth = datetime.now().month - 1
currentYear = datetime.now().year

update_key = str(currentYear) + "-" + str(currentMonth)

print(update_key)

all_updates = get_updates_for_month_and_year(update_key)

down_stocks = {}
up_stocks = {}
new_stocks = {}

print('number of updates:')
print(len(all_updates))

for cik, data_dict in all_updates.items():
  new_data = data_dict['new']
  old_data = data_dict['old']

  if old_data == {}:
    old_confidence = 0
  else:
    try:
      old_confidence = old_data['confidence']
    except:
      old_confidence = determine_stock_confidence(old_data)

  try:
    new_confidence = new_data['confidence']
  except:
    new_confidence = determine_stock_confidence(new_data)

  names = get_names_from_cik(cik)

  if len(names) == 1:
    print(names[0].split(':')[0] + " (" + str(cik) + "): " + str(int(100*old_confidence)) + "% -> " + str(int(100*new_confidence)) + "%")
  else:
    print("(" + str(cik) + "): " + str(int(100*old_confidence)) + "% -> " + str(int(100*new_confidence)) + "%")

  # changes = {}

  # changes["names"] = get_names_from_cik(cik)

  # if old_data == {} and new_data != {}:
  #   new_stocks[cik] = changes
  #   continue

  # for key, value in new_data.items():
  #   if key == "N/A" or key == "neutral" or key == "red" or key == "green" or key == "confidence":
  #     continue
  #   if value["color"] != old_data[key]["color"]:
  #     changes[key] = {"old": old_data[key]["color"], "ynew": value["color"]}

  # if new_data["red"] > old_data["red"]:
  #   down_stocks[cik] = changes
  # elif new_data["N/A"] > old_data["N/A"]:
  #   down_stocks[cik] = changes
  # elif new_data["green"] > old_data["green"]:
  #   up_stocks[cik] = changes

# print('NEW STOCKS:')
# pprint(new_stocks)
# print('UP STOCKS:')
# pprint(up_stocks)
# print('DOWN STOCKS:')
# pprint(down_stocks)
  
    
