from collections import OrderedDict
import bs4 as bs
import requests
import pandas as pd
import re
import time
from pprint import pprint

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
num_years = 10
company = 'Facebook Inc'
company2 = 'NICHOLAS FINANCIAL INC'
company3 = 'BLONDER TONGUE LABORATORIES INC'
filing = '10-K' # '10-Q'
not_filing = '10-K/A'
year = 2021
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

  # go through all quarters
  for quarter in quarters:
    # print('going through quarter: ' + quarter + ' for year: ' + str(current_year))
    download = requests.get(f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx', headers=headers).content
    download = download.decode("utf-8", errors="ignore").split('\n')

    #build the first part of the url
    for item in download:
      this_company = item
      this_company = this_company.strip()
      splitted_company = this_company.split('|')
      if len(splitted_company) < 5:
        continue

      if splitted_company[2] == filing and company3 in item: 
        print('IDX: ' + f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx')
        company_name = splitted_company[1] # grabs company name
        url = splitted_company[-1]
        url2 = url.split('-') 
        url2 = url2[0] + url2[1] + url2[2]
        url2 = url2.split('.txt')[0]
        # print(url2) #edgar/data/1326801/000132680120000076

        # to_get_html_site = 'https://www.sec.gov/Archives/' + url
        # # print(to_get_html_site)
        # data = requests.get(to_get_html_site, headers=headers).content
        # data = data.decode("utf-8") 
        # data = data.split('<FILENAME>')
        # # data[1]
        # data = data[1].split('\n')[0]

        index = 'index.json'

        base_url = 'https://www.sec.gov'

        # this gives us the index for all the tables
        url_to_use = 'https://www.sec.gov/Archives/'+ url2 + '/' + index
        # print(url_to_use)

        content = requests.get(url_to_use, headers=headers).json()

        # find xml overview
        for file in content['directory']['item']:
            if file['name'] == 'FilingSummary.xml':

                # this is a summary of what can be seen in the 10-k - we need to parse this to find individual tables
                xml_summary = base_url + content['directory']['name'] + '/' + file['name']

                break

        # grab a soup for the xml
        base_url = xml_summary.replace('FilingSummary.xml','')
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
          report_dict['url'] = base_url + report.htmlfilename.text

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

        # we give up on these because the company can't file properly
        if len(statements_url) == 0:
          continue
        elif len(statements_url) != 3:
          failures.append((company_name, current_year, statements_url, xml_summary))
          continue
        else:
          print('SUCCESS: ' + company_name)

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

        # by this point we have clean dicts for each complex statement
        print('adding year: ' + str(current_year) + " for company " + company_name)

        complex_dict = {}
        complex_dict['complex'] = statements_data
                  
        # adds to firestore in proper place
        doc_ref = db.collection(u'stock_data').document(company_name.lower()).collection(u'financial_data').document(str(current_year))
        doc_ref.set(complex_dict)

  time.sleep(1) # pause in between each year as to not overload edgar

for failure in failures:
  print('FAILED: Cannot get all financials for: ' + failure[0] + " got " + str(len(failure[2])) + " reports.")
  print('XML tree to check results: ' + failure[3])
  for statement_url in failure[2]:
    print(statement_url)

# write failures to file
textfile = open("failures_logs.txt", "w")
for element in failures:
  textfile.write(element + "\n")
textfile.close()

print("number of companies " + str(len(stock_data)))
print("num failures: " + str(len(failures)))
pprint(stock_data, sort_dicts=False)