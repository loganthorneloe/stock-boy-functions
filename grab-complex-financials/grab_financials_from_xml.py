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
starting_year = 2020
headers = {
    'User-Agent': 'Stock Boy',
    'From': 'meetstockboy@gmail.com'
}

#testing variables
company = 'Facebook Inc'
company2 = 'NICHOLAS FINANCIAL INC'
company3 = 'BLONDER TONGUE LABORATORIES INC'

#report variables
statement_failures = []
ticker_failures = []
statement_successes = 0
ticker_successes = 0

def retrieve_idx_for_given_url(url):
  download = requests.get(url, headers=headers).content
  return download.decode("utf-8", errors="ignore").split('\n')

def request_for_ticker(url):
  stock_cover_url = url + 'R1.htm'
  cover_content = requests.get(stock_cover_url, headers=headers).content

  # grab full df
  cover_df_list = pd.read_html(cover_content)[0]

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

  # this is to get the 10k link
  to_get_html_site = 'https://www.sec.gov/Archives/' + url
  # print(to_get_html_site)
  data = requests.get(to_get_html_site, headers=headers).content
  data = data.decode("utf-8") 
  data = data.split('<FILENAME>')
  data = data[1].split('\n')[0]

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
    cash_item1 = 'consolidated statements of cash flows'
    cash_item2 = 'consolidated statements of cash flow'
    cash_item3 = 'consolidated statement of cash flows'
    cash_item4 = 'consolidated statements of cashflows'
    cash_item5 = 'consolidated cash flows'

    cash_flow_options = [cash_item1, cash_item2, cash_item3, cash_item4, cash_item5]

    # balance sheet possibilities
    balance_item1 = 'consolidated balance sheet'
    balance_item2 = 'consolidated balance sheets'
    balance_item3 = 'consolidated statements of financial condition'

    balance_sheet_options = [balance_item1, balance_item2, balance_item3]

    #income statement possibilities
    income_item1 = 'consolidated statements of operations'
    income_item2 = 'consolidated statements of earnings'
    income_item3 = 'consolidated statements of operations and comprehensive loss'
    income_item4 = 'consolidated statements of income'
    income_item5 = 'consolidated statements of income (loss)'
    income_item6 = 'consolidated statements of operation and comprehensive income (loss)'
    income_item7 = 'consolidated statements of operations and comprehensive income (loss)'
    income_item8 = 'consolidated statements of operations and comprehensive (loss) income'
    income_item9 = 'consolidated statements of operations and comprehensive income'
    income_item10 = 'consolidated statements of income (loss) and comprehensive income (loss)'
    income_item11 = 'consolidated statement of income (loss)'
    income_item12 = 'consolidated statements of operations and comprehensive earnings and loss'
    income_item13 = 'consolidated results of operations'

    income_statement_options = [
      income_item1, 
      income_item2, 
      income_item3, 
      income_item4, 
      income_item5, 
      income_item6, 
      income_item7, 
      income_item8, 
      income_item9, 
      income_item10, 
      income_item11, 
      income_item12, 
      income_item13]

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

def retrieve_statement_data_from_statement_urls(statements_url):
  statements_data = {}

  # this gets all three statements as a df
  for statement, url in statements_url.items():

    sections = []
      
    content = requests.get(url, headers=headers).content
    report_soup = bs.BeautifulSoup(content, 'html')

    # we need to loop here to preserve table formatting
    for index, row in enumerate(report_soup.table.find_all('tr')):

      cols = row.find_all('td')
      
      # section header
      if len(row.find_all('th')) == 0 and len(row.find_all('strong')) != 0:
        sec_row = cols[0].text.strip()
        sections.append(sec_row)

    # grab full df
    df_list = pd.read_html(content)[0]

    # clean the dataframe of rows we don't need
    clean_df = df_list.iloc[:, 0:2]

    # we need to create a clean dict here
    clean_dict = OrderedDict()
    clean_arr = []
    clean_arr_column_one = []
    clean_arr_column_two = []

    # grab header titles
    if statement == "balance_sheet":
      clean_dict[clean_df.columns.values[0]] = clean_df.columns.values[1]
      clean_arr.append((clean_df.columns.values[0], clean_df.columns.values[1]))
      clean_arr_column_one.append(clean_df.columns.values[0])
      clean_arr_column_two.append(clean_df.columns.values[1])
    else:
      clean_dict[clean_df.columns.values[0][0]] = clean_df.columns.values[1][1]
      clean_arr.append((clean_df.columns.values[0][0], clean_df.columns.values[1][1]))
      clean_arr_column_one.append(clean_df.columns.values[0][0])
      clean_arr_column_two.append(clean_df.columns.values[1][1])

    # create dictionary from df
    for (index, row) in clean_df.iterrows():
      if row[0] in sections:
        row[0] = '<b>' + row[0]
      if not isinstance(row[1], float):
        # convert rows to floats
        row[1] = row[1].replace('$ ','')
        row[1] = row[1].replace('(','-')
        row[1] = row[1].replace(')','')
        row[1] = row[1].replace(',','')
        # row[1] = float(row[1])
      if isinstance(row[1], float):
        row[1] = str(row[1])

      clean_dict[row[0]] = row[1]
      clean_arr.append((row[0], row[1]))
      clean_arr_column_one.append(row[0])
      clean_arr_column_two.append(row[1])
    
    columns = {
      "one": clean_arr_column_one,
      "two": clean_arr_column_two
      }

    #make the dataframe floats and rearrange for to_dict
    statements_data[statement] = columns

  return statements_data

# MAIN FUNCTION: go through all years
for i in range(0, num_years):
  # needs to ascend in order to have the most recent data overwrite older data
  current_year = starting_year + i

  # go through all quarters
  for quarter in quarters:
    # print('going through quarter: ' + quarter + ' for year: ' + str(current_year))
    download = retrieve_idx_for_given_url(f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx')
    print('IDX: ' + f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx')

    #build the first part of the url
    for item in download:

      # clean item
      this_company = item
      this_company = this_company.strip()
      splitted_company = this_company.split('|')
      if len(splitted_company) < 5:
        continue

      if splitted_company[2] == filing and company in item: 

        base_url = 'https://www.sec.gov'
        
        company_name = splitted_company[1] # grabs company name
        url = splitted_company[-1]
        url2 = url.split('-')
        url2 = url2[0] + url2[1] + url2[2]
        url2 = url2.split('.txt')[0]

        # ten_k_url = base_url + '/Archives/'+ url2 + '/' + data

        ten_k_url = request_for_10k_url(base_url, url, url2)

        # this gives us the index for all the tables
        index_url = base_url + '/Archives/'+ url2 + '/' + 'index.json'
        # print(index_url)

        content = requests.get(index_url, headers=headers).json()

        # find xml overview
        for file in content['directory']['item']:
            if file['name'] == 'FilingSummary.xml':

                # this is a summary of what can be seen in the 10-k - we need to parse this to find individual tables
                xml_summary = base_url + content['directory']['name'] + '/' + file['name']

                break

        # grab a soup for the xml
        new_base_url = xml_summary.replace('FilingSummary.xml','')

        trading_symbol = request_for_ticker(new_base_url)

        statements_url = get_url_for_statements(xml_summary, new_base_url)

        # we give up on these because the company can't file properly
        if len(statements_url) == 0:
          continue
        elif len(statements_url) != 3:
          statement_failures.append((company_name, current_year, statements_url, xml_summary))
          continue
        else:
          print('SUCCESS: ' + company_name)

        statements_data = retrieve_statement_data_from_statement_urls(statements_url)

        # by this point we have clean dicts for each complex statement
        print('adding year: ' + str(current_year) + " for company " + company_name)
                  
        # adds to firestore in proper place
        print('setting complex dict')
        col_ref = db.collection(u'stock_data').document(company_name.lower()).collection(u'financial_data').document(str(current_year)).update({
          "complex": statements_data
        })

        doc_ref = db.collection(u'stock_data').document(company_name.lower()).collection(u'financial_data').document(str(current_year)).update({
          "source": ten_k_url
        })

        trading_symbol = ''

        # update trading symbol
        if trading_symbol != '': 
          ticker_dict = {}
          ticker_dict['trading_symbol'] = trading_symbol
          doc_ref = db.collection(u'stock_data').document(company_name.lower())
          doc_ref.set(ticker_dict)
          ticker_successes += 1
        else: # we'll put null in there if it isn't in there or leave a proper symbol if it already is in there
          doc_ref = db.collection(u'stock_data').document(company_name.lower())
          doc = doc_ref.get()
          doc_dict = doc.to_dict()
          if 'trading_symbol' not in doc_dict.keys():
            null_ticker_dict = {}
            null_ticker_dict['trading_symbol'] = "null"
            doc_ref = db.collection(u'stock_data').document(company_name.lower())
            doc_ref.set(null_ticker_dict)
            ticker_failures.append((company_name, current_year, new_base_url))

        statement_successes += 1


  time.sleep(1) # pause in between each year as to not overload edgar

# print summary and report failures

# for failure in statement_failures:

#   failure_path = f"{failure[0].lower().replace(' ','_')}/{failure[1]}"
#   if not os.path.exists(failure_path):
#       os.makedirs(failure_path)
#   textfile = open(failure_path + "/statement_failure.txt", "w")
#   textfile.write('FAILED: Cannot get all financials for: ' + failure[0] + " got " + str(len(failure[2])) + " reports.")
#   for statement_url in failure[2]:
#     textfile.write(statement_url)
#   textfile.write('XML tree to check results: ' + failure[3])
#   textfile.close()

# for failure in ticker_failures:

#   failure_path = f"{failure[0].lower().replace(' ','_')}/{failure[1]}"
#   textfile = open(failure_path + "/ticker_failure.txt", "w")
#   textfile.write('FAILED: To get ticker for: ' + failure[0])
#   textfile.write('Chart url to check the issue: ' + failure[2])
#   textfile.close()

print("num statement failures: " + str(len(statement_failures)))
print("num ticker failures: " + str(len(ticker_failures)))
print("num statement successes: " + str(statement_successes))
print("num ticker successes: " + str(ticker_successes))