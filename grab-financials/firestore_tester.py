from financial_links_from_xml import *
from db import *

from pprint import pprint
from datetime import datetime

# set key to cik, value, to the line value from the idx, and current year as the year to update
key = '1053369'.zfill(10)
value = '1053369|ELITE PHARMACEUTICALS INC /NV/|10-K|2022-06-29|edgar/data/1053369/0001493152-22-018108.txt'
currentYear = 2022

db = firestore.client()

trading_symbol, statements_url, company_name = financial_links_for_one_line(value)
print('got financial links for: ' + company_name)

# set financial links and tickers
set_financial_links_to_firestore(currentYear, key, statements_url)
print('set financial links for ' + str(currentYear))

# pprint(get_financial_links_from_firestore(key))