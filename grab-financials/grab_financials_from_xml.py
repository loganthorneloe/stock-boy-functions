from collections import OrderedDict
import bs4 as bs
import requests
import pandas as pd
import time
from pprint import pprint
import os
import math

import warnings
warnings.filterwarnings("ignore")

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# MUST DECLARE USER_AGENT!!
# DO NOT MAKE MORE THAN 10 REQUESTS PER SECOND!!

# Setting up firestore connection
cred = credentials.Certificate('/Users/loganthorneloe/src/stock-boy-3d183-firebase-adminsdk-zyxu6-76a70bc31c.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'stock-boy-3d183',
})

db = firestore.client()

# variable setting up for scraping
quarters = ['QTR1', 'QTR2', 'QTR3', 'QTR4']
num_years = 1
filing = '10-K' # '10-Q'
not_filing = '10-K/A'
# starting_year = 2020
headers = {
    'User-Agent': 'Stock Boy',
    'From': 'meetstockboy@gmail.com'
}

#testing variables
company = 'MICROSOFT CORP'
company2 = 'NICHOLAS FINANCIAL INC'
company3 = 'BLONDER TONGUE LABORATORIES INC'

#report variables
statement_failures = []
ticker_failures = []
statement_successes = 0
ticker_successes = 0

# def set_statement_data_to_firebase(company_key, current_year, statements_data):
#   doc_ref = db.collection(u'stock_data').document(company_key).update({
#               str(current_year) + "_complex": statements_data
#             })

# def retrieve_idx_for_given_url(url):
#   download = requests.get(url, headers=headers).content
#   return download.decode("utf-8", errors="ignore").split('\n')

def request_for_ticker(url):
  stock_cover_url = url + 'R1.htm'
  cover_content = requests.get(stock_cover_url, headers=headers).content

  # grab full df
  try:
    cover_df_list = pd.read_html(cover_content)[0]
  except:
    return ''

  # clean the dataframe of rows we don't need
  cover_clean_df = cover_df_list.iloc[:, 0:2]
  # pprint(cover_clean_df)

  trading_symbol = ''
  
  for (index, row) in cover_clean_df.iterrows():
      if row[0] == "Trading Symbol":
        trading_symbol = row[1]
        break

  return trading_symbol

def request_for_10k_url(base_url, url, url2):

  try:
    # this is to get the 10k link
    to_get_html_site = 'https://www.sec.gov/Archives/' + url
    # print(to_get_html_site)
    data = requests.get(to_get_html_site, headers=headers).content
    data = data.decode("utf-8") 
    data = data.split('<FILENAME>')
    data = data[1].split('\n')[0]

  except:
    return None

  return base_url + '/Archives/'+ url2 + '/' + data

def get_url_for_statements(xml_summary, new_base_url):

  # request for financial statements
  content = requests.get(xml_summary, headers=headers).content
  soup = bs.BeautifulSoup(content,'lxml')

  #find my reports within xml
  reports = soup.find('myreports')

  # clean reports
  master_report_list = []

  # print(xml_summary)

  for report in reports.find_all('report')[:-1]:
    report_dict = {}
    report_dict['name_short'] = report.shortname.text.lower()
    report_dict['name_long'] = report.longname.text
    report_dict['url'] = new_base_url + report.htmlfilename.text

    # print(report_dict['url'])

    master_report_list.append(report_dict)

  statements_url = {}

  for report in master_report_list:

    # cash flow possibilities
    cash_item1 = 'cash flows'
    cash_item2 = 'cash flow'
    cash_item3 = 'cashflows'
    cash_item4 = 'cashflow'

    cash_flow_options = [cash_item1, cash_item2, cash_item3, cash_item4]

    # balance sheet possibilities
    balance_item1 = 'consolidated balance sheet'
    balance_item2 = 'consolidated balance sheets'
    balance_item3 = 'consolidated statements of financial condition'
    balance_item4 = 'balance sheet'
    balance_item5 = 'consolidated statements of condition'
    balance_item6 = 'of financial position'
    balance_item7 = 'of financial condition'

    balance_sheet_options = [balance_item1, balance_item2, balance_item3, balance_item4, balance_item5, balance_item6, balance_item7]

    #income statement possibilities
    income_item2 = 'statements of earnings'
    income_item13 = 'results of operations'
    income_item14 = 'income statement'
    income_item15 = 'of consolidated operations'
    income_item16 = 'statements of income'
    income_item17 = 'statements of comprehensive income'
    income_item18 = 'statements of operations'
    income_item19 = 'statement of operations'
    income_item20 = 'statements of operation'
    income_item21 = 'statement of operation'
    income_item22 = 'statement of income'
    income_item23 = 'statement of comprehensive income'
    income_item24 = 'statements of loss'
    income_item25 = 'statement of loss'
    income_item26 = 'statement of comprehensive loss'
    income_item27 = 'statements of comprehensive loss'
    income_item28 = 'statments of operations'
    income_item30 = 'statements of consolidated income'
    income_item31 = 'statement of consolidated income'

    income_statement_options = [
      income_item2, 
      income_item13,
      income_item14,
      income_item15,
      income_item16,
      income_item17,
      income_item18,
      income_item19,
      income_item20,
      income_item21,
      income_item22,
      income_item23,
      income_item24,
      income_item25,
      income_item26,
      income_item27,
      income_item28,
      income_item30,
      income_item31]

    for option in cash_flow_options:
      if option in report['name_short'] and not 'cash_flow' in statements_url:
        statements_url['cash_flow'] = report['url']
        break

    for option in balance_sheet_options:
      if option in report['name_short'] and not 'balance_sheet' in statements_url:
        statements_url['balance_sheet'] = report['url']
        break

    for option in income_statement_options:
      if option in report['name_short'] and not 'income_statement' in statements_url:
        statements_url['income_statement'] = report['url']
        break

  return statements_url

def is_nan_col(column):
  num_non_nans = 0
  num_nans = 0
  for val in column:
    try:
      if math.isnan(float(val)):
        num_nans += 1
      else:
        num_non_nans += 1
    except:
      num_non_nans +=1

  if num_nans > num_non_nans:
    return True
  return False

def retrieve_statement_data_from_statement_urls(statements_url):
  # print('STATEMENTS URL')
  # print(statements_url)
  # we need this order: balance sheet, income statement, cash flow
  balance_arr = []
  income_arr = []
  cash_arr = []

  # this gets all three statements as a df
  for statement, url in statements_url.items():

    sections = []
      
    content = requests.get(url, headers=headers).content
    report_soup = bs.BeautifulSoup(content, 'html')

    # no table for the document - wtf??
    if report_soup.table is None:
      return None

    # we need to loop here to preserve table formatting
    for index, row in enumerate(report_soup.table.find_all('tr')):

      cols = row.find_all('td')
      
      # section header
      if len(row.find_all('th')) == 0 and len(row.find_all('strong')) != 0:
        sec_row = cols[0].text.strip()
        sections.append(sec_row)

    # grab full df
    df_list = pd.read_html(content)[0]

    clean_arr_column_one = []
    clean_arr_column_two = []

    # need to be able to separate by statement type
    clean_arr_column_one.append(statement)
    clean_arr_column_two.append("None")

    first_col = df_list.iloc[:, 0]
    second_col = df_list.iloc[:, 1]

    # this checks for a single gap row and switches it
    if is_nan_col(second_col):
      try:
        second_col = df_list.iloc[:, 2]
      except:
        return None

    # grab headers
    if statement == "balance_sheet":
      clean_arr_column_one.append(first_col.name)
      clean_arr_column_two.append(second_col.name)
    else:
      clean_arr_column_one.append(first_col.name[0])
      clean_arr_column_two.append(second_col.name[1])

    # first column
    for val in first_col:
      if val in sections:
        val = '<b>' + val
      clean_arr_column_one.append(val)
    
    # second column
    for val in second_col:
      if not isinstance(val, float):
        # convert rows to floats
        val = val.replace('$ ','')
        val = val.replace('(','-')
        val = val.replace(')','')
        val = val.replace(',','')
        # row[1] = float(row[1])
      if isinstance(val, float):
        val = str(val)
      clean_arr_column_two.append(val)
    
    # combines all data into one list to preserve ordering
    columns = clean_arr_column_one + clean_arr_column_two

    # pprint(columns)

    # make the dataframe floats and rearrange for to_dict
    if statement == "balance_sheet":
      balance_arr = columns
    elif statement == "income_statement":
      income_arr = columns
    else: # cash flowcd g
      cash_arr = columns

  # this is one list with both columns for all three statements
  return balance_arr + income_arr + cash_arr

def set_or_update_trading_symbol(company_name, symbol):
  try:
    doc_ref = db.collection(u'single_data').document("trading_symbols")
    doc = doc_ref.get()
    doc_dict = doc.to_dict()
    doc_dict[company_name] = symbol
    doc_ref = db.collection(u'single_data').document("trading_symbols").set(doc_dict)
  except:
    doc_ref = db.collection(u'single_data').document("trading_symbols").set({
      company_name: symbol
    })
  return doc_ref

current_year = 2021
statement_failure_file_name = str(current_year) + "_statement_failures.txt"
statement_failure_full_path = 'statement_retrieval_failures/' + statement_failure_file_name
other_failure_file_name = str(current_year) + "_other_failures.txt"
other_failure_full_path = 'other_retrieval_failures/' + other_failure_file_name

# remove any existing logs to replace for the year
if os.path.exists(statement_failure_full_path):
  os.remove(statement_failure_full_path)
else:
  print("Can't delete " + statement_failure_full_path + " because it doesn't exist.")

if os.path.exists(other_failure_full_path):
  os.remove(other_failure_full_path)
else:
  print("Can't delete " + other_failure_full_path + " because it doesn't exist.")

# MAIN FUNCTION: go through all years
# go through all quarters
# for quarter in quarters:
# print('going through quarter: ' + quarter + ' for year: ' + str(current_year))
# download = retrieve_idx_for_given_url(f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx')
# print('IDX: ' + f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx')

download = []

# grab 10ks from idx from local analysis
with open('master_10k_idx' + '/' + str(current_year) + '_master_10k_idx.txt', 'r') as file:
  for line in file:
      download.append(line.rstrip())

# print(len(download))

count = 0

start_item = "NANOVIRICIDES, INC."
start = True

#build the first part of the url
for item in download:
  
  # for testing specific companies
  # if start_item in item:
  #   start = True

  # if not start:
  #   continue

  # if "MICROSOFT CORP" not in item:
  #   continue

  # clean item
  this_company = item
  this_company = this_company.strip()
  splitted_company = this_company.split('|')
  if len(splitted_company) < 5:
    continue

  base_url = 'https://www.sec.gov'
  
  company_name = splitted_company[1] # grabs company name
  url = splitted_company[-1]
  url2 = url.split('-')
  url2 = url2[0] + url2[1] + url2[2]
  url2 = url2.split('.txt')[0]

  # ten_k_url = base_url + '/Archives/'+ url2 + '/' + data

  ten_k_url = request_for_10k_url(base_url, url, url2)

  if ten_k_url is None:
    statement_failures.append((company_name, current_year, statements_url, xml_summary))

    print('10k link failure for: ' + company_name)

    error_str = company_name + ': ' + ' 10k link failure'
    error_str += "\n"

    with open(statement_failure_full_path, 'a') as the_file:
      the_file.write(error_str)
    continue

  # this gives us the index for all the tables
  index_url = base_url + '/Archives/'+ url2 + '/' + 'index.json'
  # print(index_url)

  content = requests.get(index_url, headers=headers).json()

  xml_summary = ''

  # find xml overview
  for file in content['directory']['item']:
      if file['name'] == 'FilingSummary.xml':

          # this is a summary of what can be seen in the 10-k - we need to parse this to find individual tables
          xml_summary = base_url + content['directory']['name'] + '/' + file['name']

          break

  # this means there is no xml summary
  if xml_summary == '':
    continue

  # grab a soup for the xml
  new_base_url = xml_summary.replace('FilingSummary.xml','')

  trading_symbol = request_for_ticker(new_base_url)

  try:
    # print('XML summary')
    # print(xml_summary)
    statements_url = get_url_for_statements(xml_summary, new_base_url)

  except Exception as ex:

    statement_failures.append((company_name, current_year, statements_url, xml_summary))

    print('Reports is null failure for: ' + company_name)
    print(ex)

    error_str = company_name + ': ' + xml_summary + ' reports are null?? '
    error_str += "\n"

    with open(statement_failure_full_path, 'a') as the_file:
      the_file.write(error_str)

    continue

  # print('got statements_url ' + str(len(statements_url)) + ' and ticker: ' + trading_symbol)

  # gets rid of / which causes errors
  company_key = company_name.lower().replace('/','')

  # we give up on these because the company can't file properly
  if len(statements_url) != 3:
    # these i need to take another look at - will save them as failures
    statement_failures.append((company_name, current_year, statements_url, xml_summary))
    # we need to track what companies didn't have proper statement

    print('Statement failure for: ' + company_name)

    error_str = company_name + ': ' + xml_summary + ' working statements: '
    for key, value in statements_url.items():
      error_str += key + " "
    error_str += "\n"

    with open(statement_failure_full_path, 'a') as the_file:
      the_file.write(error_str)
      # the_file.write(company_name + ': ' + xml_summary + ' working statements: ' + statements_url.keys() + '\n')

    # reason_dict = {
    #   str(current_year) + "_summary": xml_summary,
    #   str(current_year) + "_statements": list(statements_url.keys()),
    #   "details":"couldn't retrieve a table url"
    # }

    # submit_to_failures(company_key, current_year, reason_dict)
    
    # print('Statements issue for: ' + company_key + " ")
    continue
  else:
    # we need to remove this company from failures if it exists
    # remove_from_failures(company_key, current_year)
    pass
  
  statements_data = retrieve_statement_data_from_statement_urls(statements_url)

  # pprint(statements_data)

  # this checks for the issue where a table can't be found in one of the urls
  if statements_data is None:

    statement_failures.append((company_name, current_year, statements_url, xml_summary))

    print("Table error for: " + company_name)

    error_str = company_name + ': ' + xml_summary + ' table was not found at one of the table urls\n'

    with open(other_failure_full_path, 'a') as the_file:
      the_file.write(error_str)
    continue
    
    # print('Tables issue for: ' + company_key + " ")

  # add url link to the array
  statements_data.append("balance_source")
  statements_data.append(statements_url['balance_sheet'])
  statements_data.append("income_source")
  statements_data.append(statements_url['income_statement'])
  statements_data.append("cash_source")
  statements_data.append(statements_url['cash_flow'])
  statements_data.append("source")
  statements_data.append(ten_k_url)

  # pprint(statements_data)

  try:
    # pprint(statements_data)
    # this will overwrite

    # set_statement_data_to_firebase(company_key, current_year, statements_data)
    doc_ref = db.collection(u'stock_data').document(company_key).set({
              str(current_year) + "_complex": statements_data
            }, merge=True)
    # remove_from_failures(company_key, current_year)

    # need to remove from failures here if this works

    print('adding year: ' + str(current_year) + " for company " + company_name)        

  except Exception as e:

    try:

      # print('setting instead of updating...')
      # try setting instead of updating??
      doc_ref = db.collection(u'stock_data').document(company_key).set({
                str(current_year) + "_complex": statements_data
              }, merge=True)
    
    except Exception as ex:
    
      statement_failures.append((company_name, current_year, statements_url, xml_summary))

      print('Array error for: ' + company_name)
      print(ex)
      error_str = company_name + ': ' + xml_summary + ' array error for given company\n'

      with open(other_failure_full_path, 'a') as the_file:
        the_file.write(error_str)
      continue
      # print('Array issue for: ' + company_key + " ")

  # update trading symbol
  if trading_symbol != '': 
    doc_ref = set_or_update_trading_symbol(company_key, trading_symbol)
    ticker_successes += 1
  else: # we'll put null in there if it isn't in there or leave a proper symbol if it already is in there
    doc_ref = db.collection(u'single_data').document("trading_symbols")
    doc = doc_ref.get()
    doc_dict = doc.to_dict()
    if doc_dict is None or 'trading_symbol' not in doc_dict.keys():
      doc_ref = set_or_update_trading_symbol(company_key, "null")
      ticker_failures.append((company_name, current_year, new_base_url))

  statement_successes += 1

  time.sleep(0.5) # pause in between each year as to not overload edgar

print("num statement failures: " + str(len(statement_failures)))
print("num ticker failures: " + str(len(ticker_failures)))
print("num statement successes: " + str(statement_successes))
print("num ticker successes: " + str(ticker_successes))
print("percent statement successes: " + str(statement_successes/(statement_successes + len(statement_failures))*100))