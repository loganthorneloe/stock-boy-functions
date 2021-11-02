from collections import OrderedDict
import bs4 as bs
import requests
import pandas as pd
import time
from pprint import pprint
import os

current_year = 2017
quarters = ['QTR1', 'QTR2', 'QTR3', 'QTR4']
filing = '10-K'
headers = {
    'User-Agent': 'Stock Boy',
    'From': 'meetstockboy@gmail.com'
}

file_name = str(current_year) + '_master_10k_idx.txt'
folder = 'master_10k_idx'

def retrieve_idx_for_given_url(url):
  download = requests.get(url, headers=headers).content
  return download.decode("utf-8", errors="ignore").split('\n')

if os.path.exists(folder + '/' + file_name):
    os.remove(folder + '/' + file_name)
else:
    print("Can not delete " + folder + '/' + file_name + " as it doesn't exists")
# go through all quarters
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

            with open(folder+ '/' + file_name, 'a') as the_file:
                the_file.write(item + '\n')