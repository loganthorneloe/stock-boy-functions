# grabs simplified financials from api - does ZERO analysis

from re import A
from tracemalloc import start
from numpy import short
import requests
from pprint import pprint
import json
from xbrl_var import *
from analyze_simple_financials import *

headers = {
    'User-Agent': 'Stock Boy',
    'From': 'meetstockboy@gmail.com'
}

def grab_year_from_frame(frame):
  # "fy" tells us what year the filing is from - this doesn't work because each filing lists the past two years. Instead, to get the year we need to focus on end date of frame
  # this is because it doesn't matter what filing its from as long as its a 10-K, we just need the data assigned to the proper year
  # what's more difficult is assigning the year especially if a fiscal year ends in Jan
  # this is because it's technically from 2011, when the filing would be from the fiscal year ending in 2012. But that's up the companies to decide.
  try:
    date_string = frame["end"]
    return date_string.split('-')[0] # return a year string
  except:
    return "0" # return 0 string

# some of the 10-K will also have quarterly reports reported from 10-K instead of quarterly reports. This is to check if it is an annual for quarterly value on 10-K
def not_quarterly_on_10k(frame):
  try:
    if "Q" in frame["frame"]:
      return False
  except: # this is only if there is no "frame" to check
    pass
  try:
    if "Q" in frame["fp"]:
      return False
  except: # this is only if there is no "fp" to check
    pass
  try:
    start_year = frame["start"].split('-')[0]
    end_year = frame["end"].split('-')[0]
    if end_year == start_year:
      if frame["start"].split('-')[1] == "01" and frame["end"].split('-')[1] == "12": # this is to check for older filings like Ford where start is 01/01 and end is 12/31 of the same year
        return True
      return False
  except:
      pass 
  return True # we assume the data is accurate here, but it's hard to tell due to uniniform filings, might need to fix this later

# returns a dict of year, value for a given list of labels in order of precedence
def value_from_label_list(label_list, data):

  # labels are in order or precedence, that means we use the first label only if it exists and ignore the others. If we can't find the data we try other labels
  # we first need to determine which label to use
  used_label = ""
  frames = {}
  for label in label_list:
    try:
      data_item = data[label]
      try:
        frames = data_item["units"]["USD"]
      except:
        try:
          frames = data_item["units"]["USD/shares"]
        except:
          continue
      used_label = label
      break
    except:
      continue

  # here we want to return if we weren't able to get a proper used_label
  if used_label == "":
    return {}

  ret_dict = {}
  for frame in frames:
    try:
      # checks for 10-Ks and proper addendums
      # since the ordering in the api is by end date and then filing, 10-K/As should overwrite if they exist
      if (frame["form"] == "10-K" or frame["form"] == "10-K/A") and not_quarterly_on_10k(frame):
        ret_dict[grab_year_from_frame(frame)] = frame["val"]
    except:
      continue

  # if the ret dict has no entries, another label will be attempted
  # this is important in cases where a higher precedence label isn't used on 10-K's and only 10-Q's
  if ret_dict == {}:
    label_list.remove(used_label)
    return value_from_label_list(label_list, data)

  return ret_dict

def create_simplified_values(data):

  dict= {}

  # this dict has everything we need to grab to analyze, but we need to make sure we can get it 

  # making revenue and net sales the same thing for our purposes!!
  dict["profit_margin"] = value_from_label_list(profit_margin_labels, data)
  dict["revenue"] = value_from_label_list(revenue_labels, data)
  dict["admin"] = value_from_label_list(admin_labels, data)
  dict["research"] = value_from_label_list(research_labels, data)
  dict["depreciation"] = value_from_label_list(depreciation_labels, data)
  dict["interest_expense"] = value_from_label_list(interest_expense_labels, data)
  dict["income_tax"] = value_from_label_list(income_tax_labels, data)
  dict["pre_tax_income"] = value_from_label_list(pre_tax_income_labels, data)
  dict["net_income"] = value_from_label_list(net_income_labels, data)
  dict["earnings_per_share"] = value_from_label_list(earnings_per_share_labels, data)
  dict["cash_and_equivalents"] = value_from_label_list(cash_and_equivalents_labels, data)
  dict["inventory"] = value_from_label_list(inventory_labels, data)
  dict["accounts_receivables"] = value_from_label_list(accounts_receivables_labels, data)
  dict["property_value"] = value_from_label_list(property_value_labels, data)
  dict["goodwill"] = value_from_label_list(goodwill_labels, data)
  dict["intangible_assets"] = value_from_label_list(intangible_assets_labels, data)
  dict["long_term_investments"] = value_from_label_list(long_term_investments_labels, data)
  dict["total_assets"] = value_from_label_list(total_assets_labels, data)
  dict["short_term_debt"] = value_from_label_list(short_term_debt_labels, data)
  dict["long_term_debt"] = value_from_label_list(long_term_debt_labels, data)
  dict["liabilities"] = value_from_label_list(liabilities_labels, data)
  dict["stockholders_equity"] = value_from_label_list(stockholders_equity_labels, data)
  dict["preferred_stock"] = value_from_label_list(preferred_stock_labels, data)
  dict["retained_earnings"] = value_from_label_list(retained_earnings_labels, data)
  dict["treasury_shares"] = value_from_label_list(treasury_shares_labels, data)
  dict["payments_in_investing_activities"] = value_from_label_list(payments_in_investing_labels, data)
  dict["repurchase_common_stock"] = value_from_label_list(repurchase_common_stock_labels, data)
  dict["dividends"] = value_from_label_list(dividends_labels, data)

  return dict

def get_simplified_data(cik):
  
  response = requests.get("https://data.sec.gov/api/xbrl/companyfacts/CIK{no}.json".format(no=cik), headers=headers)

  content = json.loads(response.content)

  # print(content)

  cik = content['cik'] # add zeroes to left until 10 digits
  company = content['entityName']
  print(company)
  data = content['facts']['us-gaap']

  data_dict = create_simplified_values(data)

  analyze_simple_financials(data_dict)
  # pprint(data_dict)

# Ford 0000037996
# Microsoft 
get_simplified_data('0001397187')