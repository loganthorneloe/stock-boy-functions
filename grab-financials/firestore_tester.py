import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

from pprint import pprint

# Setting up firestore connection
cred = credentials.Certificate('/Users/loganthorneloe/src/stock-boy-3d183-firebase-adminsdk-zyxu6-76a70bc31c.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'stock-boy-3d183',
})

db = firestore.client()

company_name = 'MICROSOFT CORP'.lower().replace('/','')

doc_ref = db.collection(u'stock_data').document(company_name)

doc = doc_ref.get()
if doc.exists:
    pprint(f'Document data: {doc.to_dict()}')
else:
    pprint(u'No such document!')