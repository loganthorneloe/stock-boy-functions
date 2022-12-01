import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore
import time
from datetime import datetime

# Setting up firestore connection
cred = credentials.Certificate('/Users/loganthorneloe/src/stock-boy-firebase.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'stock-boy-3d183',
})

db = firestore.client()

def grab_total_factors():
  docs = db.collection(u'data_v2').stream()
  count = 0
  for doc in docs:
    count += 1
  
  return count*24*10

def get_updates_for_month_and_year(month_and_year):
  doc_ref = db.collection(u'updates').document(month_and_year)
  doc = doc_ref.get()
  return doc.to_dict()

def get_idx_from_firestore(year):
  doc_ref = db.collection(u'idx').document(str(year))

  doc = doc_ref.get()
  if not doc.exists:
      print(u'No such document!')

  return doc.to_dict()

def set_miss(year_month, cik, reason):
  print('setting miss for: ' + reason)
  # doc_ref = db.collection(u'stock_data').document(company_key).set({
  #     "simplified": simplified_data # data dict includes multiple years to no need to include in key
  #   }, merge=True)
  doc_ref = db.collection(u'misses').document(str(year_month)).set({
      cik: reason # data dict includes multiple years to no need to include in key
    }, merge=True)

def set_simplified_data_to_firestore(simplified_data, cik):
  # doc_ref = db.collection(u'stock_data').document(company_key).set({
  #     "simplified": simplified_data # data dict includes multiple years to no need to include in key
  #   }, merge=True)
  doc_ref = db.collection(u'data_v2').document(str(cik)).set({
      "simplified": simplified_data # data dict includes multiple years to no need to include in key
    }, merge=True)

def set_analyzed_data_to_firestore(analyzed_data, cik):
  # doc_ref = db.collection(u'stock_data').document(company_key).set({
  #     "analyzed": analyzed_data # data dict includes multiple years to no need to include in key
  #   }, merge=True)
  doc_ref = db.collection(u'data_v2').document(cik).set({
      "analyzed": analyzed_data # data dict includes multiple years to no need to include in key
    }, merge=True)

def get_analyzed_data_from_firestore(cik):
  doc_ref = db.collection(u'data_v2').document(cik)
  doc = doc_ref.get()

  if doc.exists:
    try:
      return doc.to_dict()["analyzed"]
    except:
      return {}
  else:
      return {}

# sets up an update in firestore to store the date of the update and the old and new data
# MUST BE DONE BEFORE UPDATING FIRESTORE WITH NEW ANALYZED DATA
def set_updates_in_firestore(analyzed_data, old_analyzed_data, cik, updated_key):

  new_dict= {
    "old": old_analyzed_data,
    "new": analyzed_data
  }

  doc_ref = db.collection(u'updates').document(updated_key).set({
      cik : new_dict
    }, merge=True)

def set_financial_links_to_firestore(current_year, cik, statements_url):
  # set to financial links
  db.collection(u'financial_links').document(cik).set({
            str(current_year): statements_url
          }, merge=True)

def set_or_update_trading_symbol(company_name, symbol, cik):

  if symbol == '': 
    symbol = "null"

  doc_ref = db.collection(u'tickers').document(cik).set({
              company_name: symbol
            }, merge=True)

def append_total_fundamental(additional_fundamentals):

  doc = db.collection(u'front_page_info').document('info').get()
  if doc.exists:
    old_total_fundamentals = doc.to_dict()

  new_total_fundamentals = old_total_fundamentals['total_fundamentals'] + additional_fundamentals

  db.collection(u'front_page_info').document(u'info').set({
            'total_fundamentals': new_total_fundamentals
          }, merge=True)

# should be 'dailies' for daily collection deletion
def delete_collection(collection_name, batch_size):
  coll_ref = db.collection(collection_name)
  docs = coll_ref.limit(batch_size).stream()
  deleted = 0

  for doc in docs:
      # print(f'Deleting doc {doc.id} => {doc.to_dict()}')
      doc.reference.delete()
      deleted = deleted + 1

  if deleted >= batch_size:
      return delete_collection(batch_size)

def set_dailies_to_firestore(data, cik):
  db.collection(u'dailies').document(str(cik)).set(data)
  db.collection(u'front_page_info').document('dailies').set({str(cik): data}, merge=True)

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

    time.sleep(2)

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

def get_tickers_from_firestore(cik):

  ticker_name = {}
  doc = db.collection(u'tickers').document(cik).get()
  if doc.exists:
    ticker_name = doc.to_dict()
  else:
    print(u'No such name!') # this should never happen
    return None

  names = []

  for key, value in ticker_name.items():
    if str(value) != "null":
      names.append(str(key) + ":" + str(value))
    else:
      names.append(str(key))

  return names

def set_idx_line_to_firestore(year, data_dict):
  doc_ref = db.collection(u'idx').document(str(year)).set(
    data_dict, merge=True)

def get_idx_from_firestore(year):
  doc_ref = db.collection(u'idx').document(str(year))

  doc = doc_ref.get()
  if not doc.exists:
      print(u'No such document!')

  return doc.to_dict()

def get_financial_links_from_firestore(cik):
  doc_ref = db.collection(u'financial_links').document(cik)

  doc = doc_ref.get()
  if not doc.exists:
      print(u'No such document!')

  return doc.to_dict()

