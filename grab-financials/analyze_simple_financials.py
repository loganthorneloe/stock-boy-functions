from pprint import pprint
from collections import defaultdict
from typing import OrderedDict
import numpy as np

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

def analyze_simple_financials(data_dict):

  ret_dict = {}
  # profit_margin_analysis(data_dict, ret_dict)
  # admin_analysis(data_dict, ret_dict)
  # research_analysis(data_dict, ret_dict)
  # depreciation_analysis(data_dict, ret_dict)
  # interest_expense_analysis(data_dict, ret_dict)
  # income_tax_analysis(data_dict, ret_dict)
  # net_income_analysis(data_dict, ret_dict)
  # per_share_analysis(data_dict, ret_dict)
  # short_term_cash_analysis(data_dict, ret_dict)
  # inventory_analysis(data_dict, ret_dict)
  # net_receivable_analysis(data_dict, ret_dict)
  # property_value_analysis(data_dict, ret_dict)
  # goodwill_analysis(data_dict, ret_dict)
  # intangible_assets_analysis(data_dict, ret_dict)
  # long_term_investments_analysis(data_dict, ret_dict)
  # return_on_assets_analysis(data_dict, ret_dict)
  # short_term_debt_analysis(data_dict, ret_dict)
  long_term_debt_analysis(data_dict, ret_dict)

  pprint(ret_dict)

def profit_margin_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["profit_margin"], data_dict["revenue"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  if info["target"] > .40:
    info["color"] = "green"
  elif info["target"] < .20:
    info["color"] = "red"

  ret_dict["profit_margin_over_revenue"] = info

def admin_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["admin"], data_dict["profit_margin"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  if info["target"] < .30:
    info["color"] = "green"
  elif info["target"] > .80:
    info["color"] = "red"

  ret_dict["admin_over_profit_margin"] = info

def research_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["research"], data_dict["profit_margin"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  if info["target"] < .20:
    info["color"] = "green"

  lastest_year = int(info["year"])

  # check for this being consistently healthy over the past decade
  info["consistent"] = "Yes"
  consistency_check = []

  for value in list_data:
    year = int(value[0])
    if year > lastest_year - 10: # data is too old for accurate analysis
      consistency_check.append((str(year), value[1][0]/value[1][1]))

  if len(consistency_check) < 5:
    info["consistent"] = "N/A"
    info["color"] = "neutral"

  else:
    for value in consistency_check:
      if value[1] > .20:
        info["consistent"] = "No"
        info["color"] = "neutral"

    for value in consistency_check:
      if value[1] > .40:
        info["consistent"] = "No"
        info["color"] = "red"

  # this needs to take precendence for color 
  if info["target"] > .40:
    info["color"] = "red"

  info["consistency_data"] = consistency_check    

  ret_dict["research_over_profit_margin"] = info

def depreciation_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["depreciation"], data_dict["profit_margin"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  if info["target"] < .10:
    info["color"] = "green"
  elif info["target"] > .20:
    info["color"] = "red"

  ret_dict["depreciation_over_profit_margin"] = info

def interest_expense_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["interest_expense"], data_dict["pre_tax_income"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  if info["target"] < .15:
    info["color"] = "green"
  elif info["target"] > .50:
    info["color"] = "red"

  ret_dict["interest_expense_over_pre_tax_income"] = info

def income_tax_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["income_tax"], data_dict["pre_tax_income"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  if info["target"] > .20:
    info["color"] = "green"
  elif info["target"] < .05:
    info["color"] = "red"

  ret_dict["income_tax_over_pre_tax_income"] = info

def net_income_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["net_income"], data_dict["revenue"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  if info["target"] > .20:
    info["color"] = "green"

  lastest_year = int(info["year"])

  count = 1
  index = []
  new_data = []
  for value in list_data:
    year = int(value[0])
    if year > lastest_year - 10: # data is too old for accurate analysis
      index.append(count)
      count += 1
      new_data.append(value[1][0]/value[1][1])

  if len(new_data) < 5:
    info["trend"] = "N/A"
    info["color"] = "neutral"
  else:
    trend = trendline(index, new_data)
    info["trend"] = trend
    if trend < 0:
      info["color"] = "red"
    elif trend == 0:
      info['color'] = "neutral"

  # this takes precedence
  if info["target"] < .10:
    info["color"] = "red"

  ret_dict["net_income_over_revenue"] = info

def per_share_analysis(data_dict, ret_dict):

  earnings = data_dict["earnings_per_share"]
  list_data = list(earnings.items())

  info = {}
  info["year"] = list_data[-1][0]
  info["color"] = "green"
  lastest_year = int(list_data[-1][0])

  count = 1
  index = []
  new_data = []
  negative_eps = False
  for value in list_data:
    year = int(value[0])
    if year > lastest_year - 5: # analyze past 5 years for a trend
      index.append(count)
      count += 1
      new_data.append(value[1])
    if year > lastest_year - 10:
      if value[1] < 0:
        negative_eps = True # we don't want any negative eps

  if len(new_data) < 5:
    info["trend"] = "N/A"
    info["color"] = "neutral"
  else:
    trend = trendline(index, new_data)
    info["trend"] = trend
    if trend < 0:
      info["color"] = "neutral"
  if negative_eps:
    info["color"] = "red"

  ret_dict["earnings_per_share"] = info


def short_term_cash_analysis(data_dict, ret_dict):

  earnings = data_dict["cash_and_equivalents"]
  list_data = list(earnings.items())

  info = {}
  info["year"] = list_data[-1][0]
  info["color"] = "green"
  lastest_year = int(list_data[-1][0])
  info["target"] = list_data[-1][1]

  count = 0
  negative_cash = False
  for value in list_data:
    year = int(value[0])
    if year > lastest_year - 10:
      count += 1
      if value[1] < 0:
        negative_cash = True # we don't want any negative eps

  if count < 5:
    info["target"] = "N/A"
    info["color"] = "neutral"

  if negative_cash:
    info["color"] = "red"

  ret_dict["short_term_cash_on_hand"] = info

def inventory_analysis(data_dict, ret_dict):

  earnings = data_dict["inventory"]
  list_data = list(earnings.items())

  info = {}
  info["year"] = list_data[-1][0]
  info["color"] = "green"
  lastest_year = int(list_data[-1][0])
  info["target"] = list_data[-1][1]

  count = 0
  index = []
  new_data = []
  for value in list_data:
    year = int(value[0])
    if year > lastest_year - 10:
      index.append(count)
      count += 1
      new_data.append(value[1])

  if len(new_data) < 5:
    info["trend"] = "N/A"
    info["color"] = "neutral"
  else:
    trend = trendline(index, new_data)
    info["trend"] = trend
    if trend < 0:
      info["color"] = "red"

  if info["target"] < 0:
    info["color"] = "red"

  ret_dict["inventory"] = info

def net_receivable_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["accounts_receivables"], data_dict["revenue"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  ret_dict["net_receivables"] = info

def property_value_analysis(data_dict, ret_dict):

  earnings = data_dict["property_value"]
  list_data = list(earnings.items())

  info = {}
  info["year"] = list_data[-1][0]
  info["color"] = "neutral"
  info["target"] = list_data[-1][1]

  ret_dict["property_value"] = info

def goodwill_analysis(data_dict, ret_dict):

  earnings = data_dict["goodwill"]
  list_data = list(earnings.items())

  info = {}
  info["year"] = list_data[-1][0]
  info["color"] = "green"
  lastest_year = int(list_data[-1][0])

  count = 1
  index = []
  new_data = []
  for value in list_data:
    year = int(value[0])
    if year > lastest_year - 10: # analyze past 5 years for a trend
      index.append(count)
      count += 1
      new_data.append(value[1])

  if len(new_data) < 5:
    info["trend"] = "N/A"
    info["color"] = "neutral"
  else:
    trend = trendline(index, new_data)
    info["trend"] = trend
    if trend < 0:
      info["color"] = "neutral"

  ret_dict["goodwill"] = info

def intangible_assets_analysis(data_dict, ret_dict):

  earnings = data_dict["intangible_assets"]
  list_data = list(earnings.items())

  info = {}
  info["year"] = list_data[-1][0]
  info["color"] = "green"
  lastest_year = int(list_data[-1][0])

  count = 1
  index = []
  new_data = []
  for value in list_data:
    year = int(value[0])
    if year > lastest_year - 10: # analyze past 5 years for a trend
      index.append(count)
      count += 1
      new_data.append(value[1])

  if len(new_data) < 5:
    info["trend"] = "N/A"
    info["color"] = "neutral"
  else:
    trend = trendline(index, new_data)
    info["trend"] = trend
    if trend < 0:
      info["color"] = "neutral"

  ret_dict["intangible_assets"] = info

def long_term_investments_analysis(data_dict, ret_dict):

  earnings = data_dict["long_term_investments"]
  list_data = list(earnings.items())

  info = {}
  info["year"] = list_data[-1][0]
  info["color"] = "neutral"
  info["target"] = list_data[-1][1]

  if info["target"] > 0:
    info["color"] = "green"

  ret_dict["long_term_investments"] = info

def return_on_assets_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["net_income"], data_dict["total_assets"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  if info["target"] < .25:
    info["color"] = "green"
  if info["target"] > .35 or info["target"] < .06:
    info["color"] = "red"

  ret_dict["return_on_assets"] = info

def short_term_debt_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["short_term_debt"], data_dict["long_term_debt"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  info["target"] = value[1][0]/value[1][1]
  info["color"] = "neutral"

  if info["target"] < .6:
    info["color"] = "green"
  if info["target"] > 1:
    info["color"] = "red"

  ret_dict["short_term_debt"] = info

def long_term_debt_analysis(data_dict, ret_dict):

  merged_dict = merge_dicts(data_dict["net_income"], data_dict["long_term_debt"])
  list_data = list(merged_dict.items())
  value = list_data[-1]

  info = {}
  info["year"] = value[0]
  net_income_value = value[1][0]
  long_term_debt_value = value[1][1]
  info["target"] = net_income_value * 4
  info["color"] = "neutral"

  print(net_income_value)
  print(long_term_debt_value)

  if info["target"] > long_term_debt_value:
    info["color"] = "green"
  if net_income_value * 8 < long_term_debt_value:
    info["color"] = "red"

  ret_dict["long_term_debt"] = info