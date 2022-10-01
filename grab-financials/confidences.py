
from aggregate_idx_for_year import *
from financial_links_from_xml import *
from grab_simplified_financials import *
from db import *
from datetime import datetime
from pprint import pprint

# grab current year
currentYear = datetime.now().year

print(currentYear)

# grab info from idx collection in firestore
idx_dict_from_firestore = get_idx_from_firestore(currentYear)

count = 0

# grab updated data and financial links
for cik, value in idx_dict_from_firestore.items():

  try:
    print('getting analyzed for: ' + str(cik))
    analyzed = get_analyzed_data_from_firestore(cik)

    # pprint(analyzed)

    print('determining stock confidence')
    determine_stock_confidence(analyzed)

    print('setting analyzed back to firestore...')
    set_analyzed_data_to_firestore(analyzed, cik)
  except:
    continue

  count += 1

print(str(count))