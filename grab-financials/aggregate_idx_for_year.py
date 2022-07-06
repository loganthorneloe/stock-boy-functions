from collections import OrderedDict
import bs4 as bs
import requests
import pandas as pd
import time
from pprint import pprint
import os

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Setting up firestore connection
cred = credentials.Certificate('/Users/loganthorneloe/src/stock-boy-3d183-firebase-adminsdk-zyxu6-76a70bc31c.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'stock-boy-3d183',
})

db = firestore.client()

def set_idx_line_to_firestore(year, data_dict):
  doc_ref = db.collection(u'idx').document(str(year)).set(
    data_dict, merge=True)

def get_idx_from_firestore(year):
  doc_ref = db.collection(u'idx').document(str(year))

  doc = doc_ref.get()
  if not doc.exists:
      print(u'No such document!')

  return doc.to_dict()

current_year = 2021
quarters = ['QTR1', 'QTR2', 'QTR3', 'QTR4']
filing = '10-K'
headers = {
    'User-Agent': 'Stock Boy',
    'From': 'meetstockboy@gmail.com'
}

# file_name = str(current_year) + '_master_10k_idx.txt'
# folder = 'master_10k_idx'

def retrieve_idx_for_given_url(url):
  download = requests.get(url, headers=headers).content
  return download.decode("utf-8", errors="ignore").split('\n')

# if os.path.exists(folder + '/' + file_name):
#     os.remove(folder + '/' + file_name)
# else:
#     print("Can not delete " + folder + '/' + file_name + " as it doesn't exists")
# go through all quarters

cik_to_data_string_dict = {}

for quarter in quarters:
    # print('going through quarter: ' + quarter + ' for year: ' + str(current_year))
    download = retrieve_idx_for_given_url(f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx')
    print('IDX: ' + f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx')

    for item in download:
        # clean item
        this_company = item
        this_company = this_company.strip()
        splitted_company = this_company.split('|')
        
        if len(splitted_company) < 5:
          continue

        if splitted_company[2] == filing:
          cik_to_data_string_dict[splitted_company[0].zfill(10)] = this_company # maps cik to full string info


# print(len(cik_to_data_string_dict))
print(f'Logging {current_year} to firestore.')
set_idx_line_to_firestore(current_year, cik_to_data_string_dict)

# used for checking updates
# print(f'Getting {current_year} data for comparison')
# old_data = get_idx_from_firestore(current_year)
# print(len(old_data))
