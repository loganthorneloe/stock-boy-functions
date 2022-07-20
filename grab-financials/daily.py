

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

import random

# Setting up firestore connection
cred = credentials.Certificate('/Users/loganthorneloe/src/stock-boy-firebase.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'stock-boy-3d183',
})

db = firestore.client()

def delete_collection(batch_size):
    coll_ref = db.collection(u'dailies')
    docs = coll_ref.limit(batch_size).stream()
    deleted = 0

    for doc in docs:
        # print(f'Deleting doc {doc.id} => {doc.to_dict()}')
        doc.reference.delete()
        deleted = deleted + 1

    if deleted >= batch_size:
        return delete_collection(batch_size)

def set_dailies_to_firestore(data, cik):
  doc_ref = db.collection(u'dailies').document(str(cik)).set(data)

def get_stocks_from_firestore():

  PAGINATION_LIMIT = 2000
  stocks = []
  coll = db.collection(u'data_v2')

  query = coll.limit(PAGINATION_LIMIT)
  docs = query.stream()

  docs_list = list(docs)

  # last doc
  last_doc = docs_list[-1]

  for doc in docs_list:
    dictionary = doc.to_dict()
    if dictionary["analyzed"]["N/A"] < 8:
      stocks.append((doc.id, doc.to_dict()))

  while len(docs_list)>0:
    # next query
    query = (
      coll
      .start_after(last_doc)
      .limit(PAGINATION_LIMIT)
    )
    docs = query.stream()
    docs_list = list(docs)
    # last doc
    if len(docs_list) > 0:
      last_doc = docs_list[-1]

    for doc in docs_list:
      dictionary = doc.to_dict()
      if dictionary["analyzed"]["N/A"] < 8:
        stocks.append((doc.id, doc.to_dict()))

  return stocks

def get_ticker_from_firestore(ticker):

  ticker_name = {}
  doc = db.collection(u'tickers').document(ticker).get()
  if doc.exists:
      ticker_name = doc.to_dict()
  else:
      print(u'No such name!') # this should never happen

  for key, value in ticker_name.items():
    if str(value) != "null":
      return str(key) + ":" + str(value)
    else:
      return str(key)

def generate_twelve_daily_stocks():
  print('getting stocks')
  stocks = get_stocks_from_firestore()
  random_stocks = random.sample(stocks,12)

  # important this takes place after retrieving stocks in case there is a failure there
  print('deleting current collection')
  delete_collection(12)

  print('setting to firestore')
  for item in random_stocks:
    cik = item[0]
    name_and_ticker = get_ticker_from_firestore(cik)

    stock_info = {}
    stock_info["name"] = name_and_ticker
    stock_info["data"] = item[1]["analyzed"]
    set_dailies_to_firestore(stock_info, cik)

generate_twelve_daily_stocks()