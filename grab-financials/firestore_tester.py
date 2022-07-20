import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from pprint import pprint
from datetime import datetime

# Setting up firestore connection
cred = credentials.Certificate('/Users/loganthorneloe/src/stock-boy-firebase.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'stock-boy-3d183',
})

db = firestore.client()

# company_name = 'MICROSOFT CORP'.lower().replace('/','')

doc_ref = db.collection(u'tickers')
docs = db.collection(u'tickers').stream()
count = 0
for doc in docs:
  # print(doc.to_dict())
  for key, value in doc.to_dict().items():
    count += 1
    print('"' + key + ':' + str(value) + '?' + str(doc.id) + '",')

# print(count)

# cik = '0001318605'

# doc_ref = db.collection(u'data').document(cik)

# doc = doc_ref.get()
# old_analyzed = doc.to_dict()["analyzed"]

# new_analyzed = old_analyzed

# currentMonth = datetime.now().month
# currentYear = datetime.now().year
# date = str(currentYear) + "-" + str(currentMonth)

# new_dict= {
#   "old": old_analyzed,
#   "new": new_analyzed # data dict includes multiple years to no need to include in key
# }

# doc_ref = db.collection(u'updates').document(date).set({
#     cik : new_dict
#   }, merge=True)

# if doc.exists:
#     pprint(f'Document data: {doc.to_dict()["analyzed"]}')
# else:
#     pprint(u'No such document!')