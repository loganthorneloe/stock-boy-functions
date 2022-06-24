from pprint import pprint
from typing import OrderedDict
import numpy as np

from datetime import datetime

RED = "red"
GREEN = "green"
NEUTRAL = "neutral"
NA = "N/A"

# returns dict with like keys joining values as a tuple (d1_value, d2_value)
def merge_dicts(d1, d2):
  dd = OrderedDict()
  for key, value in d1.items():
    if key in d2:
      dd[key] = [value]

  for key, value in d2.items():
    if key in dd:
      dd[key].append(value)
    
  return dd

def trendline(index, data, order=1):
  coeffs = np.polyfit(index, list(data), order)
  slope = coeffs[-2]
  return float(slope)

def tally(ret_dict, value):
  ret_dict[value] += 1

def analyze_simple_financials(data_dict):

  ret_dict = {}
  ret_dict[NEUTRAL] = 0
  ret_dict[RED] = 0
  ret_dict[GREEN] = 0
  ret_dict[NA] = 0
  profit_margin_analysis(data_dict, ret_dict)
  admin_analysis(data_dict, ret_dict)
  research_analysis(data_dict, ret_dict) # float object is not subscriptable exception here with aapl
  depreciation_analysis(data_dict, ret_dict)
  interest_expense_analysis(data_dict, ret_dict)
  income_tax_analysis(data_dict, ret_dict)
  net_income_analysis(data_dict, ret_dict)
  per_share_analysis(data_dict, ret_dict)
  short_term_cash_analysis(data_dict, ret_dict)
  inventory_analysis(data_dict, ret_dict)
  net_receivable_analysis(data_dict, ret_dict)
  property_value_analysis(data_dict, ret_dict)
  goodwill_analysis(data_dict, ret_dict)
  intangible_assets_analysis(data_dict, ret_dict)
  long_term_investments_analysis(data_dict, ret_dict)
  return_on_assets_analysis(data_dict, ret_dict)
  short_term_debt_analysis(data_dict, ret_dict)
  long_term_debt_analysis(data_dict, ret_dict)
  adjusted_shareholders_equity_analysis(data_dict, ret_dict)
  preferred_stock_analysis(data_dict, ret_dict)
  retained_earnings_analysis(data_dict, ret_dict)
  treasury_shares_repurchase_of_stock_analysis(data_dict, ret_dict)
  return_on_shareholders_equity_analysis(data_dict, ret_dict)
  capital_expenditures_analysis(data_dict, ret_dict)
  dividends_analysis(data_dict, ret_dict)
  print("GREEN: " + str(ret_dict[GREEN]))
  print("NEUTRAL: " + str(ret_dict[NEUTRAL]))
  print("RED: " + str(ret_dict[RED]))
  print("N/A: " + str(ret_dict[NA]))
  # print(len(ret_dict.keys()))
  print(ret_dict)

  return ret_dict

'''
analysis plan
dict of year:values
trend for values
info = {}
info["data"] = {year, calculated_value}
info["trend"] = value
info["color"] = GREEN, RED, NEUTRAL based on analysis characteristics
'''

def create_empty_years_dict():
  values_dict = {}
  currentYear = datetime.now().year

  # creates an empty values dict to fill values that are there
  for i in range(0,11):
    values_dict[str(currentYear-10+i)] = NA
  return values_dict


def profit_margin_analysis(data_dict, ret_dict):
  
  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["profit_margin"], data_dict["revenue"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    # calculate color
    if len(values_list) != 0:
      target = values_list[-1]
      info["color"] = NEUTRAL

      if target > .40:
        info["color"] = GREEN
      elif target < .20:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["profit_margin_over_revenue"] = info
  tally(ret_dict, info["color"])

def admin_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["admin"], data_dict["profit_margin"])
    values_dict = create_empty_years_dict()

    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    # color calculation
    if len(values_list) != 0:
      value = values_list[-1]
      info["color"] = NEUTRAL

      if value < .30:
        info["color"] = GREEN
      elif value > .80:
        info["color"] = RED

      if value < 0: # this means we have a negative profit margin - this is bad
        info["color"] = RED
      if next(reversed(merged_dict.values()))[1] < 0: # this means we have a negative profit margin and can't evaluate further
        info["color"] = NA
  
  except Exception as e:
    print(e)

  ret_dict["admin_over_profit_margin"] = info
  tally(ret_dict, info["color"])

def research_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["research"], data_dict["profit_margin"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      
      value = values_list[-1]
      info["color"] = NEUTRAL

      if next(reversed(merged_dict.values()))[1] < 0: # this means we have a negative profit margin and can't evaluate further
        info["color"] = NA

      else:
        if value < .20:
          info["color"] = GREEN

        if len(values_list) < 5:
          info["color"] = NEUTRAL

        else:
          for value in values_list:
            if value > .20:
              info["color"] = NEUTRAL

          for value in values_list:
            if value > .40:
              info["color"] = RED

        # this needs to take precendence for color 
        if value > .40:
          info["color"] = RED   
  
  except Exception as e:
    print(e)

  ret_dict["research_over_profit_margin"] = info
  tally(ret_dict, info["color"])

def depreciation_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["depreciation"], data_dict["profit_margin"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      value = values_list[-1]
      info["color"] = NEUTRAL

      if next(reversed(merged_dict.values()))[1] < 0: # this means we have a negative profit margin and can't evaluate further
        info["color"] = NA
      elif value < .10:
        info["color"] = GREEN
      elif value > .20:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["depreciation_over_profit_margin"] = info
  tally(ret_dict, info["color"])

def interest_expense_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["interest_expense"], data_dict["pre_tax_income"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list)!=0:
      value = values_list[-1]
      info["color"] = NEUTRAL

      if next(reversed(merged_dict.values()))[1] < 0: # this means pre tax income is negative - can't determine anything from this metric
        info["color"] = NA
      elif value < .15:
        info["color"] = GREEN
      elif value > .50:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["interest_expense_over_pre_tax_income"] = info
  tally(ret_dict, info["color"])

def income_tax_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["income_tax"], data_dict["pre_tax_income"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      value = values_list[-1]
      info["color"] = NEUTRAL

      if next(reversed(merged_dict.values()))[1] < 0: # this means pre tax income is negative - can't determine anything from this metric
        info["color"] = NA
      elif value > .20:
        info["color"] = GREEN
      elif value < .05:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["income_tax_over_pre_tax_income"] = info
  tally(ret_dict, info["color"])

def net_income_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["net_income"], data_dict["revenue"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    # calculate the color
    if len(values_list) != 0:
      value = values_list[-1]
      info["color"] = NEUTRAL

      if next(reversed(merged_dict.values()))[1] < 0: # this means we have a negative revenue and this is bad
        info["color"] = RED

      else:
        if value > .20:
          info["color"] = GREEN
        if len(values_list) >= 5:
          if info["trend"] < 0:
            info["color"] = RED
          elif info["trend"] == 0:
            info['color'] = NEUTRAL
        else:
          info['color'] = NA

        # this takes precedence
        if value < .10:
          info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["net_income_over_revenue"] = info
  tally(ret_dict, info["color"])

def per_share_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    earnings = data_dict["earnings_per_share"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    negative_eps = False
    for key in values_dict.keys():
      if key in earnings:
        values_dict[key] = earnings[key]
        values_list.append(values_dict[key])
        index.append(int(key))

        if values_dict[key] < 0:
          negative_eps = True

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = GREEN

      if len(index) < 5:
        info["color"] = NA
      else:
        if info["trend"] < 0:
          info["color"] = NEUTRAL
      if negative_eps:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["earnings_per_share"] = info
  tally(ret_dict, info["color"])

def short_term_cash_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    cash = data_dict["cash_and_equivalents"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    negative_cash = False
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in cash:
        values_dict[key] = cash[key]
        values_list.append(values_dict[key])
        index.append(int(key))

        if values_dict[key] < 0:
          negative_cash = True

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = GREEN

      if len(index) < 5:
        info["color"] = NA

      if negative_cash:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["short_term_cash_on_hand"] = info
  tally(ret_dict, info["color"])

def inventory_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    inventory = data_dict["inventory"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in inventory:
        values_dict[key] = inventory[key]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = GREEN

      if len(index) < 5:
        info["color"] = NA
      else:
        if info["trend"] < 0:
          info["color"] = RED

      if values_list[-1] < 0:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["inventory"] = info
  tally(ret_dict, info["color"])

def net_receivable_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["accounts_receivables"], data_dict["revenue"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:

      info["color"] = NEUTRAL

      if next(reversed(merged_dict.values()))[1] < 0: # this means we have a negative profit margin and can't evaluate further
        info["color"] = NA

  except Exception as e:
    print(e)

  ret_dict["net_receivables"] = info
  tally(ret_dict, info["color"])

def property_value_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    property_values = data_dict["property_value"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in property_values:
        values_dict[key] = property_values[key]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = NEUTRAL

  except Exception as e:
    print(e)

  ret_dict["property_value"] = info
  tally(ret_dict, info["color"])

def goodwill_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    goodwill = data_dict["goodwill"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in goodwill:
        values_dict[key] = goodwill[key]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = GREEN

      if len(values_list) == 1: # only one year of goodwill is good
        info["color"] = GREEN
      elif info["trend"] < 0: # more than one year and we want too see an increasing trend
        info["color"] = NEUTRAL

  except Exception as e:
    print(e)

  ret_dict["goodwill"] = info
  tally(ret_dict, info["color"])

def intangible_assets_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    intangibles = data_dict["intangible_assets"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in intangibles:
        values_dict[key] = intangibles[key]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = GREEN

      if len(index) < 5:
        info["color"] = NA
      elif info["trend"] < 0:
        info["color"] = NEUTRAL

  except Exception as e:
    print(e)

  ret_dict["intangible_assets"] = info
  tally(ret_dict, info["color"])

def long_term_investments_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    long_term_investments = data_dict["long_term_investments"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in long_term_investments:
        values_dict[key] = long_term_investments[key]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = RED

      if values_list[-1] >= 0:
        info["color"] = NEUTRAL

  except Exception as e:
    print(e)

  ret_dict["long_term_investments"] = info
  tally(ret_dict, info["color"])

def return_on_assets_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["net_income"], data_dict["total_assets"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = NEUTRAL

      if next(reversed(merged_dict.values()))[0] < 0 or next(reversed(merged_dict.values()))[1] < 0: # this means we have a negative income or assets
        info["color"] = NA
      else:
        if values_list[-1] < .25:
          info["color"] = GREEN
        if values_list[-1] > .35 or values_list[-1] < .06:
          info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["return_on_assets"] = info
  tally(ret_dict, info["color"])

def short_term_debt_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["short_term_debt"], data_dict["long_term_debt"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = merged_dict[key][0]/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = NEUTRAL

      if values_list[-1] < .6:
        info["color"] = GREEN
      if values_list[-1] > 1:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["short_term_debt"] = info
  tally(ret_dict, info["color"])

def long_term_debt_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["net_income"], data_dict["long_term_debt"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = (merged_dict[key][0]*4)/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = NEUTRAL

      if next(reversed(merged_dict.values()))[0] < 0: # checks for net income less than 0 
        info["color"] = RED
      elif values_list[-1] > 1: # checks for net_income * 4 > long term debt
        info["color"] = GREEN
      elif values_list[-1] < 0.5: # checks if net_income * 8 < long-term debt
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["long_term_debt"] = info
  tally(ret_dict, info["color"])

def adjusted_shareholders_equity_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["liabilities"], data_dict["stockholders_equity"])
    values_dict = create_empty_years_dict()

    treasury_shares = data_dict["treasury_shares"]
    repurchase_of_common_stock = data_dict["repurchase_common_stock"]

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        addition = 0

        try:
          addition = abs(treasury_shares[key])
        except:
          try:
            addition = abs(repurchase_of_common_stock[key])
          except: 
            pass
        
        values_dict[key] = merged_dict[key][0]/(addition+merged_dict[key][1])
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list) != 0:
      info["color"] = NEUTRAL

      if values_list[-1] < .8:
        info["color"] = GREEN
      if values_list[-1] > 2:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["adjusted_stockholders_equity"] = info
  tally(ret_dict, info["color"])

def preferred_stock_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:
  
    preferred_stock = data_dict["preferred_stock"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in preferred_stock:
        values_dict[key] = preferred_stock[key]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    if len(index) != 0:
      info["trend"] = trendline(index, values_list)
    info["data"] = values_dict
    
    if values_list == []:
      info["color"] = GREEN
    else:
      info["color"] = RED
      if values_list[-1] == 0: # this is for companies that put zero instead of leaving is absent
        info["color"] = GREEN

  except Exception as e:
    print(e)

  ret_dict["preferred_stock"] = info
  tally(ret_dict, info["color"])

def retained_earnings_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:
  
    earnings = data_dict["retained_earnings"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in earnings:
        values_dict[key] = earnings[key]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list)!=0:
      info["color"] = NEUTRAL

      if len(values_list) < 5:
        info["color"] = NA
      else:
        if info["trend"] > 4.9:
          info["color"] = GREEN
        else:
          try:
            repurchase = data_dict["repurchase_common_stock"]
            buyback = repurchase[str(index[-1])]
          except:
            info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["retained_earnings"] = info
  tally(ret_dict, info["color"])

def treasury_shares_repurchase_of_stock_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    treasury_shares = data_dict["treasury_shares"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in treasury_shares:
        values_dict[key] = treasury_shares[key]
        values_list.append(values_dict[key])
        index.append(int(key))

    repurchase = data_dict["repurchase_common_stock"]
    values_dict2 = {}
    currentYear = datetime.now().year

    # creates an empty values dict to fill values that are there
    for i in range(0,10):
      values_dict[str(currentYear-10+i)] = 0

    # filling out values dict with calculations
    values_list2 = []
    index2 = []
    for key in values_dict.keys():
      if key in repurchase:
        values_dict2[key] = repurchase[key]
        values_list2.append(values_dict[key])
        index2.append(int(key))

    if values_list != []:
      # calculate the trend
      info["trend"] = trendline(index, values_list)
      info["data"] = values_dict
      info["color"] = GREEN

    if values_list2 != []:
      # calculate the trend
      info["trend"] = trendline(index2, values_list2)
      info["data"] = values_dict2
      info["color"] = GREEN

  except Exception as e:
    print(e)

  ret_dict["treasury_shares_repurchase_stock"] = info
  tally(ret_dict, info["color"])

def return_on_shareholders_equity_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["net_income"], data_dict["stockholders_equity"])
    values_dict = create_empty_years_dict()

    treasury_shares = data_dict["treasury_shares"]
    repurchase_of_common_stock = data_dict["repurchase_common_stock"]

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        addition = 0
        try:
          addition = abs(treasury_shares[info["year"]])
        except:
          try:
            addition = abs(repurchase_of_common_stock[info["year"]])
          except: 
            pass
        values_dict[key] = merged_dict[key][0]/(addition+merged_dict[key][1])
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict

    if len(values_list)!=0:
      info["color"] = NEUTRAL

      if values_list[-1] > .2:
        info["color"] = GREEN

      if values_list[-1] < .1:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["return_on_shareholder_equity"] = info
  tally(ret_dict, info["color"])

def capital_expenditures_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["payments_in_investing_activities"], data_dict["net_income"])
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in merged_dict:
        values_dict[key] = abs(merged_dict[key][0])/merged_dict[key][1]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict
    
    if len(values_list)!=0:
      info["color"] = NEUTRAL

      if next(reversed(merged_dict.values()))[1] < 0: # check for negative income here
        info["color"] = NA
      
      else:
        if values_list[-1] < .25:
          info["color"] = GREEN

        if values_list[-1] > .5:
          info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["capital_expenditures"] = info
  tally(ret_dict, info["color"])

def dividends_analysis(data_dict, ret_dict):

  info = {}
  info["data"] = {}
  info["trend"] = "N/A"
  info["color"] = NA

  try:

    divs = data_dict["dividends"]
    values_dict = create_empty_years_dict()

    # filling out values dict with calculations
    values_list = []
    index = []
    for key in values_dict.keys():
      if key in divs:
        values_dict[key] = divs[key]
        values_list.append(values_dict[key])
        index.append(int(key))

    # calculate the trend
    info["trend"] = trendline(index, values_list)
    info["data"] = values_dict    
    info["color"] = NEUTRAL

  except Exception as e:
    print(e)

  ret_dict["dividends"] = info