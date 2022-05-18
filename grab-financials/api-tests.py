from re import A
from numpy import short
import requests
from pprint import pprint
import json
from xbrl_var import *

headers = {
    'User-Agent': 'Stock Boy',
    'From': 'meetstockboy@gmail.com'
}

def value_from_label_list(label_list, data, year):

  for label in label_list:
    try:
      data_item = data[label]
      desc = data_item["description"]
      frames = data_item["units"]["USD"]

      for frame in range(len(frames), -1, -1):
        try:
          if frame["form"] == "10-K" or frame["fp"] == "FY": # checks for latest 10-k in the data, trying to use FY as backup but that includes 8-Ks and 10-K/As
            value = frame["val"]
            return (label, value)
        except:
          continue
    except:
      continue

  return ("no data found: " + label_list[0], 0)

def create_simplified_values(data, year):

  dict= {}

  dict["profit_margin"] = value_from_label_list(profit_margin_labels, data, year)
  dict["revenue"] = value_from_label_list(revenue_labels, data, year)
  dict["admin"] = value_from_label_list(admin_labels, data, year)
  dict["research"] = value_from_label_list(research_labels, data, year)
  dict["depreciation"] = value_from_label_list(depreciation_labels, data, year)
  dict["interest_expense"] = value_from_label_list(interest_expense_labels, data, year)
  dict["income_tax"] = value_from_label_list(income_tax_labels, data, year)
  dict["pre_tax_income"] = value_from_label_list(pre_tax_income_labels, data, year)
  dict["net_income"] = value_from_label_list(net_income_labels, data, year)
  dict["net_sales"] = value_from_label_list(net_sales_labels, data, year)
  dict["earnings_per_share"] = value_from_label_list(earnings_per_share_labels, data, year)
  dict["cash_and_equivalents"] = value_from_label_list(cash_and_equivalents_labels, data, year)
  dict["inventory"] = value_from_label_list(inventory_labels, data, year)
  dict["accounts_receivables"] = value_from_label_list(accounts_receivables_labels, data, year)
  dict["property_value"] = value_from_label_list(property_value_labels, data, year)
  dict["goodwill"] = value_from_label_list(goodwill_labels, data, year)
  dict["intangible_assets"] = value_from_label_list(intangible_assets_labels, data, year)
  dict["long_term_investments"] = value_from_label_list(long_term_investments_labels, data, year)
  dict["total_assets"] = value_from_label_list(total_assets_labels, data, year)
  dict["short_term_debt"] = value_from_label_list(short_term_debt_labels, data, year)
  dict["long_term_debt"] = value_from_label_list(long_term_debt_labels, data, year)
  dict["long_term_debt_due"] = value_from_label_list(long_term_debt_due_labels, data, year)
  dict["liabilities"] = value_from_label_list(liabilities_labels, data, year)
  dict["stockholders_equity"] = value_from_label_list(stockholders_equity_labels, data, year)
  dict["preferred_stock"] = value_from_label_list(preferred_stock_labels, data, year)
  dict["retained_earnings"] = value_from_label_list(retained_earnings_labels, data, year)
  dict["treasury_shares"] = value_from_label_list(treasury_shares_labels, data, year)
  dict["payments_in_investing_activities"] = value_from_label_list(payments_in_investing_labels, data, year)
  dict["repurchase_common_stock"] = value_from_label_list(repurchase_common_stock_labels, data, year)
  dict["dividends"] = value_from_label_list(dividends_labels, data, year)

  return dict



response = requests.get("https://data.sec.gov/api/xbrl/companyfacts/CIK0000320193.json", headers=headers)
# print(response.content)

# response = requests.get("https://data.sec.gov/api/xbrl/companyconcept/CIK0001326801/us-gaap/AccountsPayableCurrent.json", headers=headers)
# print(response.content)

# response = requests.get("https://data.sec.gov/api/xbrl/frames/us-gaap/AccountsPayableCurrent/USD/CY2021.json", headers=headers)
# print(response.content)

# response = requests.get("https://data.sec.gov/api/xbrl/companyconcept/CIK0001326801/frames/CY2021.json", headers=headers)
# print(response.content)

content = json.loads(response.content)

cik = content['cik'] # add zeroes to left until 10 digits
company = content['entityName']
data = content['facts']['us-gaap']

printable_data = []

# companies can file years differently
# CY{year}
# CY{year}Q4
# CY{year}Q4I
year = "2021"

# pprint(data)
# pprint(data["Revenues"])

dict_data = create_simplified_values(data, year)

# pprint(value)
pprint(dict_data)