
from aggregate_idx_for_year import *
from financial_links_from_xml import *
from grab_simplified_financials import *
from db import *
from datetime import datetime
from pprint import pprint

def update(event, context):
  print('starting update function')
  # grab current year and month
  currentMonth = datetime.now().month
  currentYear = datetime.now().year

  update_key = str(currentYear) + "-" + str(currentMonth)

  num_misses = 0

  # grab info from idx
  cik_to_data_string_dict = retrieve_idx_data_from_web(currentYear)

  # grab info from idx collection in firestore
  idx_dict_from_firestore = get_idx_from_firestore(currentYear)

  # compare to find updates
  ciks_to_update = {}
  firestore_idx_keys = idx_dict_from_firestore.keys()

  print('num idx from firestore: ' + str(len(idx_dict_from_firestore)))
  print('num ciks for year: ' + str(len(cik_to_data_string_dict)))

  for key in cik_to_data_string_dict.keys():
    if key not in firestore_idx_keys:
      ciks_to_update[key] = cik_to_data_string_dict[key]

  if len(ciks_to_update) == 0:
    print('nothing to check for updates.')
  else:
    print('number to check for updates: ' + str(len(ciks_to_update)))

  # grab updated data and financial links
  for key, value in ciks_to_update.items():

    miss = False

    try:

      trading_symbol, statements_url, company_name = financial_links_for_one_line(value)
      print('got financial links for: ' + company_name)

      # set financial links and tickers
      set_financial_links_to_firestore(currentYear, key, statements_url)
      company_key = company_name.lower().replace('/','')
      print('adding year: ' + str(currentYear) + " for company " + company_name) 
      set_or_update_trading_symbol(company_key, trading_symbol, key)  

    except Exception as e:
      miss = True
      set_miss(update_key, key, "financial links " + str(e))

    try:

      simplified, analyzed = return_simplified_and_analyzed_data(key)
      print('got simplified and analyzed for: ' + company_name)

      # needs to be done before analyzed is set to firestore
      old_analyzed = get_analyzed_data_from_firestore(key)

      # set simplified and analyzed
      set_simplified_data_to_firestore(simplified, key)
      set_analyzed_data_to_firestore(analyzed, key)
      print('adding analyzed and simplified data for : ' + company_name)
    
    except Exception as e:
      miss = True
      set_miss(update_key, key, "analyzed/simplified values: " + str(e))

    updated = False

    try:
      print('checking for updates')
      if old_analyzed == {}:
        updated = True
      
      if not updated:
        for analyzed_keys in analyzed.keys():
          if analyzed_keys == 'neutral' or analyzed_keys == 'green' or analyzed_keys == 'red' or analyzed_keys == 'N/A':
            continue
          if analyzed[analyzed_keys]["color"] != old_analyzed[analyzed_keys]["color"]:
            updated = True
            break
      
      if updated:
        print('update needed for: ' + company_name)
        set_updates_in_firestore(analyzed, old_analyzed, key, update_key)

    except Exception as e:
      miss = True
      set_miss(update_key, key, "updating data failure " + str(e))

    try:
      print('setting company to idx: ' + company_name)
      idx = {}
      idx[key] = value
      print(idx)
      set_idx_line_to_firestore(currentYear, idx)

    except Exception as e:
      miss = True
      set_miss(update_key, key, "idx insertion failure " + str(e))

    if miss:
      num_misses += 1
  
  print('total unique misses: ' + str(num_misses))