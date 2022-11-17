from financial_links_from_xml import *
from db import *

db = firestore.client()

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
      write_out = str(name) + '?' + str(cik)
    else:
      write_out = str(name) + ':' + str(ticker) + '?' + str(cik)
    write_out = write_out.replace('/','')
    write_out = write_out.replace('\\',' ')
    write_out = write_out.replace('null','')
    write_out = write_out.replace('"','')
    write_out = '  "' + write_out + '",\n'
    f.write(write_out)

f.write(']')
f.close()