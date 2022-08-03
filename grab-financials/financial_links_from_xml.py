import bs4 as bs
import requests
import pandas as pd

import warnings
warnings.filterwarnings("ignore")

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

def financial_links_for_one_line(item): # this is one line of an idx here
  # clean item
  this_company = item
  this_company = this_company.strip()
  splitted_company = this_company.split('|')
  if len(splitted_company) < 5:
    return

  base_url = 'https://www.sec.gov'

  company_name = splitted_company[1] # grabs company name
  url = splitted_company[-1]
  url2 = url.split('-')
  url2 = url2[0] + url2[1] + url2[2]
  url2 = url2.split('.txt')[0]

    # exception handled inside the function
  ten_k_url = request_for_10k_url(base_url, url, url2)

  # this gives us the index for all the tables
  index_url = base_url + '/Archives/'+ url2 + '/' + 'index.json'

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
    return

  # grab a soup for the xml
  new_base_url = xml_summary.replace('FilingSummary.xml','')

  trading_symbol = request_for_ticker(new_base_url)

  try:

    statements_url = get_url_for_statements(xml_summary, new_base_url)

  except Exception as ex:

    print('Reports is null failure for: ' + company_name)
    print(ex)

    return

  # add in the 10k here if it exists
  if ten_k_url is not None:
    statements_url['ten_k'] = ten_k_url

  return trading_symbol, statements_url, company_name