
from aggregate_idx_for_year import *
from financial_links_from_xml import *
from grab_simplified_financials import *
from db import *
from datetime import datetime
from market_overview import *

# grab current year and month
currentMonth = datetime.now().month
currentYear = datetime.now().year

print(currentYear)
print(currentMonth)

unique_misses = 0
successes = 0

update_key = str(currentYear) + "-" + str(currentMonth)

# grab info from idx
cik_to_data_string_dict = retrieve_idx_data_from_web(currentYear)

# grab info from idx collection in firestore
idx_dict_from_firestore = get_idx_from_firestore(currentYear)

# compare to find updates
ciks_to_update = {}
firestore_idx_keys = idx_dict_from_firestore.keys()

print('ciks to update len: ' + str(len(cik_to_data_string_dict)))
print('companies in firestore: ' + str(len(idx_dict_from_firestore)))

for key, value in cik_to_data_string_dict.items():
  if key not in firestore_idx_keys:
    ciks_to_update[key] = cik_to_data_string_dict[key]

# grab updated data and financial links
for key, value in ciks_to_update.items():

  all_misses = 0

  try:

    trading_symbol, statements_url, company_name = financial_links_for_one_line(value)
    print('got financial links for: ' + company_name)

    # set financial links and tickers
    set_financial_links_to_firestore(currentYear, key, statements_url)
    company_key = company_name.lower().replace('/','')
    print('adding year: ' + str(currentYear) + " for company " + company_name) 
    set_or_update_trading_symbol(company_key, trading_symbol, key)  

  except Exception as e:
    set_miss(update_key, key, "financial links " + str(e))
    all_misses += 1

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
    set_miss(update_key, key, "analyzed/simplified values: " + str(e))
    all_misses += 1

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
    set_miss(update_key, key, "updating data failure " + str(e))
    all_misses += 1

  try:
    print('setting company to idx: ' + company_name)
    idx = {}
    idx[key] = value
    print(idx)
    set_idx_line_to_firestore(currentYear, idx)

  except Exception as e:
    set_miss(update_key, key, "idx insertion failure " + str(e))
    all_misses += 1

  if all_misses != 0:
    unique_misses += 1
  if all_misses != 4:
    successes += 1

print('total stock data additions: ' + str(successes))
print('total stocks with at least one miss: ' + str(unique_misses))

# now we need to append to fundamentals total - multiply by 24 because 24 fundamentals are checked each time
append_total_fundamental(successes*24)
print('appended to total fundamentals - added ' + str(successes*24) + " fundamentals.")

print('getting market overview updates')
market_overview_update()
