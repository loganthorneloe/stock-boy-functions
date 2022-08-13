import requests
import time

current_year = 2021
quarters = ['QTR1', 'QTR2', 'QTR3', 'QTR4']
filing = '10-K'
headers = {
    'User-Agent': 'Stock Boy',
    'From': 'meetstockboy@gmail.com'
}

def retrieve_idx_for_given_url(url):
  time.sleep(1)
  download = requests.get(url, headers=headers).content
  return download.decode("utf-8", errors="ignore").split('\n')

def retrieve_idx_data_from_web(year):

  cik_to_data_string_dict = {}

  for quarter in quarters:
      # print('going through quarter: ' + quarter + ' for year: ' + str(current_year))
      download = retrieve_idx_for_given_url(f'https://www.sec.gov/Archives/edgar/full-index/{year}/{quarter}/master.idx')
      print('IDX: ' + f'https://www.sec.gov/Archives/edgar/full-index/{year}/{quarter}/master.idx')

      print('len of idx download: ' + str(len(download)))
      print(download)

      for item in download:
          # clean item
          this_company = item
          this_company = this_company.strip()
          splitted_company = this_company.split('|')
          
          if len(splitted_company) < 5:
            continue

          if splitted_company[2] == filing:
            cik_to_data_string_dict[splitted_company[0].zfill(10)] = this_company # maps cik to full string info

  return cik_to_data_string_dict
