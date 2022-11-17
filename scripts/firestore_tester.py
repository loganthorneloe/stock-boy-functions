from financial_links_from_xml import *
from db import *

from pprint import pprint
from datetime import datetime


# set key to cik, value, to the line value from the idx, and current year as the year to update
# key = '1053369'.zfill(10)
# value = '1053369|ELITE PHARMACEUTICALS INC /NV/|10-K|2022-06-29|edgar/data/1053369/0001493152-22-018108.txt'
# currentYear = 2022

db = firestore.client()

# trading_symbol, statements_url, company_name = financial_links_for_one_line(value)
# print('got financial links for: ' + company_name)

# set financial links and tickers
# set_financial_links_to_firestore(currentYear, key, statements_url)
# print('set financial links for ' + str(currentYear))

# pprint(get_financial_links_from_firestore(key))

# Note: Use of CollectionRef stream() is prefered to get()
docs = db.collection(u'tickers').stream()

f = open('Tickers.js', 'w')
f.write('// This is a list of all possible tickers from the firestore\n')
f.write('// It\'s used for searching, but not all of these ciks are actually properly analyzed\n')
f.write('// This is created by pulling from the firestore, creating a list combining name:ticker?cik and\n')
f.write('// This requires removing all "null" tickers and /s because they cause issues\n')
f.write('// This must be recreated about once a month\n')
f.write('export const prelim_tickers = [\n')

for doc in docs:
  cik = doc.id
  names = doc.to_dict()

  for name,ticker in names.items():
    if ticker == "null":
      write_out = '  "' + str(name) + '?' + str(cik) + '",\n'
    else:
      write_out = '  "' + str(name) + ':' + str(ticker) + '?' + str(cik) +'",\n'
    write_out = write_out.replace('/','')
    f.write(write_out)

f.write(']')
f.close()