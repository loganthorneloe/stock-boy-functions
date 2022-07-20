from pprint import pprint

headers = {
    'User-Agent': 'Stock Boy',
    'From': 'meetstockboy@gmail.com'
}

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Setting up firestore connection
cred = credentials.Certificate('/Users/loganthorneloe/src/stock-boy-firebase.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'stock-boy-3d183',
})

db = firestore.client()

doc_ref = db.collection(u'single_data').document(u'trading_symbols').get()
# doc_ref = db.collection(u'stock_data').get()
pprint(doc_ref.to_dict())