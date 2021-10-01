import bs4 as bs
import requests
import pandas as pd
import re
import time


# MUST DECLARE USER_AGENT!!
# DO NOT MAKE MORE THAN 10 REQUESTS PER SECOND!!

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

all_10ks_w_years_and_company = {}
failures = []


# go through all years
for i in range(0, num_years):
  current_year = year - i

  # go through all quarters
  for quarter in quarters:
    print('going through quarter: ' + quarter + ' for year: ' + str(current_year))
    print('IDX: ' + f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx')
    download = requests.get(f'https://www.sec.gov/Archives/edgar/full-index/{current_year}/{quarter}/master.idx', headers=headers).content
    download = download.decode("utf-8", errors="ignore").split('\n')

    #build the first part of the url
    for item in download:
      this_company = item
      this_company = this_company.strip()
      splitted_company = this_company.split('|')
      if len(splitted_company) < 5:
        continue

      if splitted_company[2] == filing and company in item: 
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

        for report in reports.find_all('report')[:-1]:
          report_dict = {}
          report_dict['name_short'] = report.shortname.text.lower()
          report_dict['name_long'] = report.longname.text
          report_dict['position'] = report.position.text
          report_dict['category'] = report.menucategory.text
          report_dict['url'] = base_url + report.htmlfilename.text

          master_report_list.append(report_dict)

        statements_url = []

        for report in master_report_list:

          # need to figure this out a bit better

          # cash flow possibilities
          item3 = 'consolidated statements of cash flows'
          item13 = 'consolidated statements of cash flow'
          item20 = 'consolidated statement of cash flows'
          item21 = 'consolidated statements of cashflows'
          item24 = 'consolidated cash flows'

          # item4 = "consolidated statements of stockholder's (deficit) equity"
          # item7 = "consolidated statements of stockholders' equity"
          # item9 = "consolidated statements of shareholders' equity"

          # balance sheet possibilities
          item10 = 'consolidated balance sheet'
          item1 = 'consolidated balance sheets'
          item16 = 'consolidated statements of financial condition'

          #income statement possibilities
          item11 = 'consolidated statements of operations'
          item12 = 'consolidated statements of earnings'
          item8 = 'consolidated statements of operations and comprehensive loss'
          item5 = 'consolidated statements of income'
          item6 = 'consolidated statements of income (loss)'
          item2 = 'consolidated statements of operation and comprehensive income (loss)'
          item14 = 'consolidated statements of operations and comprehensive income (loss)'
          item15 = 'consolidated statements of operations and comprehensive (loss) income'
          item17 = 'consolidated statements of operations and comprehensive income'
          item18 = 'consolidated statements of income (loss) and comprehensive income (loss)'
          item19 = 'consolidated statement of income (loss)'
          item22 = 'consolidated statements of operations and comprehensive earnings and loss'
          item23 = 'consolidated results of operations'

          cash_flow_options = [item3, item13, item20, item21]
          balance_sheet_options = [item10, item1, item16]
          income_statement_options = [item11, item12, item8, item5, item6, item2, item14, item15, item17, item18, item19, item22, item23]

          if report['name_short'] in cash_flow_options:
              statements_url.append(('cash_flow', report['url']))
              print(report['url'])

          if report['name_short'] in balance_sheet_options:
              statements_url.append(('balance_sheet', report['url']))

          if report['name_short'] in income_statement_options:
              statements_url.append(('income_statement', report['url']))

        # we give up on these because the company can't file properly
        if len(statements_url) == 0:
          continue
        elif len(statements_url) != 3:
          failures.append((company_name, statements_url, xml_summary))
          continue
        else:
          print('SUCCESS: ' + company_name)

        statements_data = {}

        # this gets all three statements as a df
        for statement in statements_url:

          sections = []
            
          content = requests.get(statement[1], headers=headers).content
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

          # grab section signifier
          for (index, row) in df_list.iterrows():
            if row[0] in sections:
              row[0] = '<b>' + row[0]

          # clean the dataframe of rows we don't need
          clean_df = df_list.iloc[:, 0:2]
          statements_data[statement[0]] = clean_df

        print('adding year: ' + str(current_year))

        if company_name.lower() in all_10ks_w_years_and_company.keys():
          dict_to_edit = all_10ks_w_years_and_company[company_name.lower()]
          dict_to_edit[current_year] = statements_data
          # do I have to put it back in?
        else:
          new_dict_to_add = {}
          new_dict_to_add[current_year] = statements_data        
          all_10ks_w_years_and_company[company_name.lower()] = new_dict_to_add

  time.sleep(1) # pause in between each year as to not overload edgar

# print(all_10ks_w_years_and_company)
for failure in failures:
  print('FAILED: Cannot get all financials for: ' + failure[0] + " got " + str(len(failure[1])) + " reports.")
  print('XML tree to check results: ' + failure[2])
  for statement_url in failure[1]:
    print(statement_url[0])
print("number of companies " + str(len(all_10ks_w_years_and_company)))
print("num failures: " + str(len(failures)))
print(all_10ks_w_years_and_company)

def get_financial_data_with_url(url):
    pass

'''
Here's the object we need to store and receive from firebase
Dict {key, value}

key -> company name
value -> dict {key, value}: year, annual object

Annual object
  Cash flow: (df)
  Balance Sheet: (df)
  Income statement: (df)
  Ticker pulled from 10-k
  Url: link to each specific 10-k
  # these will be in the next update
  Risks: pulled from 10-k
  Competitors: pulled from 10-k
  Business section: pulled from 10-k
'''