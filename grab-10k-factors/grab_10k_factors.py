from collections import OrderedDict
import bs4 as bs
import requests
import pandas as pd
import re
import time
from pprint import pprint
import nltk

nltk.download('punkt')

def language_processing(soup, word):
  list = []
  for tag in soup.div.find_all_next('span'):
    #print(type(tag))
    tag = tag.getText()
    #print(tag)
    if word in tag:
      sentences = nltk.sent_tokenize(tag)
      result = [sentence for sentence in sentences]
      list.append(result)
      # print(result)
  # print(len(list))
  return list

def risks(soup):
  risks = language_processing(soup, "risk")
  for risk in risks:
    print(risk)

def competitors(soup):
  comps = language_processing(soup, "competition")
  for comp in comps:
    print(comp)

def business_section(soup):
  for tag in soup.div.find_all_next('span'):
    #print(type(tag))
    tag = tag.getText()
    if "Item 1." == tag:
        print(tag)

def ticker(soup):
  ticker = ''
  table = None
  keywords = ["Trading symbol(s)" , "Trading Symbol(s)"]
  for keyword in keywords:
    try:
      print(keyword)
      table = soup.find(text=keyword).find_parent("table")
      break
    except:
      continue

  index = -1
  for tr in table:
    incrementer = 0
    for td in tr:
      if index < 0:
        font = td.find("font")
        if font is None:
          font = td.find("span")
          
        if font is None:
          font = ''
        else:
          font = font.text
        
        print(font)
        if font == keyword:
          index = incrementer
          break
        else:
          incrementer += 1
      else:
        print(incrementer)
        print(index)
        if incrementer == index:
          font = td.find("font")
          if font is None:
            font = td.find("span")
            
          if font is None:
            font = ''
          else:
            font = font.text
          ticker = font
          break
        else:
          incrementer += 1
  print('TICKER:')
  print(ticker)


# MUST DECLARE USER_AGENT!!
# DO NOT MAKE MORE THAN 10 REQUESTS PER SECOND!!

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Use the application default credentials
cred = credentials.Certificate('/Users/loganthorneloe/src/stock-boy-3d183-firebase-adminsdk-zyxu6-76a70bc31c.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'stock-boy-3d183',
})

db = firestore.client()

quarters = ['QTR1', 'QTR2', 'QTR3', 'QTR4']
# quarters = ['QTR3']
num_years = 1
company = 'Facebook Inc'
company2 = 'NICHOLAS FINANCIAL INC'
company3 = 'BLONDER TONGUE LABORATORIES INC'
filing = '10-K' # '10-Q'
not_filing = '10-K/A'
year = 2020
# quarter = 'QTR3'
headers = {
    'User-Agent': 'Stock Boy',
    'From': 'meetstockboy@gmail.com'
}

stock_data = {}
failures = []


# go through all years
for i in range(0, num_years):
  current_year = year - i
  # print('going through year: ' + str(current_year))

  # go through all quarters
  for quarter in quarters:
    print('going through quarter: ' + quarter + ' for year: ' + str(current_year))
    download = requests.get(f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx', headers=headers).content
    download = download.decode("utf-8", errors="ignore").split('\n')

    #build the first part of the url
    for item in download:
      #company name and report type - what to do with 10-ka's here?
      if (filing in item) and (not_filing not in item) and (company in item): 
        #print(item)
        this_company = item
        this_company = this_company.strip()
        splitted_company = this_company.split('|')
        company_name = splitted_company[1] # grabs company name
        url = splitted_company[-1]
        url2 = url.split('-') 
        url2 = url2[0] + url2[1] + url2[2]
        url2 = url2.split('.txt')[0]
        # print(url2) #edgar/data/1326801/000132680120000076

        to_get_html_site = 'https://www.sec.gov/Archives/' + url
        # print(to_get_html_site)
        data = requests.get(to_get_html_site, headers=headers).content
        data = data.decode("utf-8") 
        data = data.split('<FILENAME>')
        #data[1]
        data = data[1].split('\n')[0]

        url_to_use = 'https://www.sec.gov/Archives/'+ url2 + '/' + data
        print(url_to_use)

        resp = requests.get(url_to_use, headers=headers)
        this_soup = bs.BeautifulSoup(resp.text, 'lxml')

        # risks(this_soup) # can grab from risks section
        # competitors(this_soup) # can grab from competitors sections
        # business_section(this_soup) # can grab from business section
        ticker(this_soup)

    time.sleep(1) # pause in between each year as to not overload edgar

# for failure in failures:
#   print('FAILED: Cannot get all financials for: ' + failure[0] + " got " + str(len(failure[2])) + " reports.")
#   print('XML tree to check results: ' + failure[3])
#   for statement_url in failure[2]:
#     print(statement_url)

# # write failures to file
# textfile = open("failures_logs.txt", "w")
# for element in failures:
#   textfile.write(element + "\n")
# textfile.close()

# print("number of companies " + str(len(stock_data)))
# print("num failures: " + str(len(failures)))
# pprint(stock_data, sort_dicts=False)