from pprint import pprint
from typing import OrderedDict
import numpy as np

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
  research_analysis(data_dict, ret_dict)
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

  pprint(ret_dict)
  print("GREEN: " + str(ret_dict[GREEN]))
  print("NEUTRAL: " + str(ret_dict[NEUTRAL]))
  print("RED: " + str(ret_dict[RED]))
  print("N/A: " + str(ret_dict[NA]))
  print(len(ret_dict.keys()))

def profit_margin_analysis(data_dict, ret_dict):
  
  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["profit_margin"], data_dict["revenue"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:
      value = list_data[-1]

      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] > .40:
        info["color"] = GREEN
      elif info["target"] < .20:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["profit_margin_over_revenue"] = info
  tally(ret_dict, info["color"])

def admin_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["admin"], data_dict["profit_margin"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:
      value = list_data[-1]
      
      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] < .30:
        info["color"] = GREEN
      elif info["target"] > .80:
        info["color"] = RED
  
  except Exception as e:
    print(e)

  ret_dict["admin_over_profit_margin"] = info
  tally(ret_dict, info["color"])

def research_analysis(data_dict, ret_dict):

  info = {}
  info["consistent"] = "N/A"
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA
  info["consistency_data"] = "N/A"

  try:

    merged_dict = merge_dicts(data_dict["research"], data_dict["profit_margin"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:
      value = list_data[-1]

      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] < .20:
        info["color"] = GREEN

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
        info["color"] = NEUTRAL

      else:
        for value in consistency_check:
          if value[1] > .20:
            info["consistent"] = "No"
            info["color"] = NEUTRAL

        for value in consistency_check:
          if value[1] > .40:
            info["consistent"] = "No"
            info["color"] = RED

      # this needs to take precendence for color 
      if info["target"] > .40:
        info["color"] = RED

      info["consistency_data"] = consistency_check    
  
  except Exception as e:
    print(e)

  ret_dict["research_over_profit_margin"] = info
  tally(ret_dict, info["color"])

def depreciation_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["depreciation"], data_dict["profit_margin"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:
      value = list_data[-1]

      info = {}
      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] < .10:
        info["color"] = GREEN
      elif info["target"] > .20:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["depreciation_over_profit_margin"] = info
  tally(ret_dict, info["color"])

def interest_expense_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["interest_expense"], data_dict["pre_tax_income"])
    list_data = list(merged_dict.items())

    if len(list_data)!=0:
      value = list_data[-1]
      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] < .15:
        info["color"] = GREEN
      elif info["target"] > .50:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["interest_expense_over_pre_tax_income"] = info
  tally(ret_dict, info["color"])

def income_tax_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["income_tax"], data_dict["pre_tax_income"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:
      value = list_data[-1]

      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] > .20:
        info["color"] = GREEN
      elif info["target"] < .05:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["income_tax_over_pre_tax_income"] = info
  tally(ret_dict, info["color"])

def net_income_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA
  info["trend"] = "N/A"

  try:

    merged_dict = merge_dicts(data_dict["net_income"], data_dict["revenue"])
    list_data = list(merged_dict.items())

    print(list_data)

    if len(list_data) != 0:
      value = list_data[-1]
      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] > .20:
        info["color"] = GREEN

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

      if len(new_data) > 5:
        trend = trendline(index, new_data)
        info["trend"] = trend
        if trend < 0:
          info["color"] = RED
        elif trend == 0:
          info['color'] = NEUTRAL

      # this takes precedence
      if info["target"] < .10:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["net_income_over_revenue"] = info
  tally(ret_dict, info["color"])

def per_share_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA
  info["trend"] = "N/A"

  try:

    earnings = data_dict["earnings_per_share"]
    list_data = list(earnings.items())

    if len(list_data) != 0:
      info["year"] = list_data[-1][0]
      info["color"] = GREEN
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
        info["color"] = NA
      else:
        trend = trendline(index, new_data)
        info["trend"] = trend
        if trend < 0:
          info["color"] = NEUTRAL
      if negative_eps:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["earnings_per_share"] = info
  tally(ret_dict, info["color"])

def short_term_cash_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    earnings = data_dict["cash_and_equivalents"]
    list_data = list(earnings.items())

    if len(list_data) != 0:
      info["year"] = list_data[-1][0]
      info["color"] = GREEN
      lastest_year = int(list_data[-1][0])
      info["target"] = list_data[-1][1]

      count = 0
      negative_cash = False
      for value in list_data:
        year = int(value[0])
        if year > lastest_year - 10:
          count += 1
          if value[1] < 0:
            negative_cash = True # we don't want any negative cash

      if count < 5:
        info["target"] = "N/A"
        info["color"] = NA

      if negative_cash:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["short_term_cash_on_hand"] = info
  tally(ret_dict, info["color"])

def inventory_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA
  info["trend"] = "N/A"

  try:

    earnings = data_dict["inventory"]
    list_data = list(earnings.items())

    if len(list_data) != 0:
      info["year"] = list_data[-1][0]
      info["color"] = GREEN
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
        info["color"] = NA
      else:
        trend = trendline(index, new_data)
        info["trend"] = trend
        if trend < 0:
          info["color"] = RED

      if info["target"] < 0:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["inventory"] = info
  tally(ret_dict, info["color"])

def net_receivable_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["accounts_receivables"], data_dict["revenue"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:
      value = list_data[-1]

      info = {}
      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

  except Exception as e:
    print(e)

  ret_dict["net_receivables"] = info
  tally(ret_dict, info["color"])

def property_value_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    earnings = data_dict["property_value"]
    list_data = list(earnings.items())

    if len(list_data) != 0:
      info["year"] = list_data[-1][0]
      info["color"] = NEUTRAL
      info["target"] = list_data[-1][1]

  except Exception as e:
    print(e)

  ret_dict["property_value"] = info
  tally(ret_dict, info["color"])

def goodwill_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA
  info["trend"] = "N/A"

  try:

    earnings = data_dict["goodwill"]
    list_data = list(earnings.items())

    if len(list_data) != 0:
      info["year"] = list_data[-1][0]
      info["color"] = GREEN
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
        info["color"] = NA
      else:
        trend = trendline(index, new_data)
        info["trend"] = trend
        if trend < 0:
          info["color"] = NEUTRAL

  except Exception as e:
    print(e)

  ret_dict["goodwill"] = info
  tally(ret_dict, info["color"])

def intangible_assets_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA
  info["trend"] = "N/A"

  try:

    earnings = data_dict["intangible_assets"]
    list_data = list(earnings.items())

    if len(list_data) != 0:
      info["year"] = list_data[-1][0]
      info["color"] = GREEN
      lastest_year = int(list_data[-1][0])

      count = 1
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
        info["color"] = NA
      else:
        trend = trendline(index, new_data)
        info["trend"] = trend
        if trend < 0:
          info["color"] = NEUTRAL

  except Exception as e:
    print(e)

  ret_dict["intangible_assets"] = info
  tally(ret_dict, info["color"])

def long_term_investments_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    earnings = data_dict["long_term_investments"]
    list_data = list(earnings.items())

    if len(list_data) != 0:
      info["year"] = list_data[-1][0]
      info["color"] = NEUTRAL
      info["target"] = list_data[-1][1]

      if info["target"] > 0:
        info["color"] = GREEN

  except Exception as e:
    print(e)

  ret_dict["long_term_investments"] = info
  tally(ret_dict, info["color"])

def return_on_assets_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["net_income"], data_dict["total_assets"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:
      value = list_data[-1]
      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] < .25:
        info["color"] = GREEN
      if info["target"] > .35 or info["target"] < .06:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["return_on_assets"] = info
  tally(ret_dict, info["color"])

def short_term_debt_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["short_term_debt"], data_dict["long_term_debt"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:
      value = list_data[-1]
      info["year"] = value[0]
      info["target"] = value[1][0]/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] < .6:
        info["color"] = GREEN
      if info["target"] > 1:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["short_term_debt"] = info
  tally(ret_dict, info["color"])

def long_term_debt_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["net_income"], data_dict["long_term_debt"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:
      value = list_data[-1]
      info["year"] = value[0]
      net_income_value = value[1][0]
      long_term_debt_value = value[1][1]
      info["target"] = net_income_value * 4
      info["color"] = NEUTRAL

      if net_income_value * 4 > long_term_debt_value:
        info["color"] = GREEN
      if net_income_value * 8 < long_term_debt_value:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["long_term_debt"] = info
  tally(ret_dict, info["color"])

def adjusted_shareholders_equity_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["liabilities"], data_dict["stockholders_equity"])
    list_data = list(merged_dict.items())

    if len(list_data) != 0:

      value = list_data[-1]

      treasury_shares = data_dict["treasury_shares"]
      repurchase_of_common_stock = data_dict["repurchase_common_stock"]
      addition = 0

      info["year"] = value[0]
      try:
        addition = abs(treasury_shares[info["year"]])
      except:
        try:
          addition = abs(repurchase_of_common_stock[info["year"]])
        except: 
          pass
      
      liabilities = value[1][0]
      stockholders_equity = value[1][1]
      info["target"] = liabilities/(addition+stockholders_equity)
      info["color"] = NEUTRAL

      if info["target"] < .8:
        info["color"] = GREEN
      if info["target"] > 2:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["adjusted_stockholders_equity"] = info
  tally(ret_dict, info["color"])

def preferred_stock_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:
  
    earnings = data_dict["preferred_stock"]
    list_data = list(earnings.items())
    
    if list_data == []:
      info["year"] = "N/A"
      info["color"] = GREEN
      info["target"] = "N/A"
    else:
      info["year"] = list_data[-1][0]
      info["color"] = RED
      info["target"] = list_data[-1][1]

  except Exception as e:
    print(e)

  ret_dict["preferred_stock"] = info
  tally(ret_dict, info["color"])

def retained_earnings_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA
  info["trend"] = "N/A"
  info["buyback"] = 0

  try:
  
    earnings = data_dict["retained_earnings"]
    list_data = list(earnings.items())

    if len(list_data)!=0:
      info["year"] = list_data[-1][0]
      info["color"] = NEUTRAL
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
        info["color"] = NA
        info["trend"] = "N/A"
      else:
        info["trend"] = trendline(index, new_data)

        if info["trend"] > 4.9:
          info["color"] = GREEN
        else:
          repurchase = data_dict["repurchase_common_stock"]
          try:
            buyback = repurchase[info["year"]]
            info["buyback"] = buyback
          except:
            info["buyback"] = "N/A"
            info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["retained_earnings"] = info
  tally(ret_dict, info["color"])

def treasury_shares_repurchase_of_stock_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "0"
  info["color"] = RED

  try:

    treasury_shares = data_dict["treasury_shares"]
    list_data = list(treasury_shares.items())

    repurchase = data_dict["repurchase_common_stock"]
    list_data2 = list(repurchase.items())

    if list_data != []:
      info["year"] = list_data[-1][0]
      info["color"] = GREEN

    if list_data2 != []:
      info["year"] = str(max(info["year"], list_data2[-1][0]))
      info["color"] = GREEN

  except Exception as e:
    print(e)

  ret_dict["treasury_shares_repurchase_stock"] = info
  tally(ret_dict, info["color"])

def return_on_shareholders_equity_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["net_income"], data_dict["stockholders_equity"])
    list_data = list(merged_dict.items())

    if len(list_data)!=0:

      value = list_data[-1]

      treasury_shares = data_dict["treasury_shares"]
      repurchase_of_common_stock = data_dict["repurchase_common_stock"]
      addition = 0

      info["year"] = value[0]
      try:
        addition = abs(treasury_shares[info["year"]])
      except:
        try:
          addition = abs(repurchase_of_common_stock[info["year"]])
        except: 
          pass
      
      net_income = value[1][0]
      stockholders_equity = value[1][1]
      info["target"] = net_income/(addition+stockholders_equity)
      info["color"] = NEUTRAL

      if info["target"] > .2:
        info["color"] = GREEN

      if info["target"] < .1:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["return_on_shareholder_equity"] = info
  tally(ret_dict, info["color"])

def capital_expenditures_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    merged_dict = merge_dicts(data_dict["payments_in_investing_activities"], data_dict["net_income"])
    list_data = list(merged_dict.items())
    
    if len(list_data)!=0:
      value = list_data[-1]
      info["year"] = value[0]
      info["target"] = abs(value[1][0])/value[1][1]
      info["color"] = NEUTRAL

      if info["target"] < .25:
        info["color"] = GREEN

      if info["target"] > .5:
        info["color"] = RED

  except Exception as e:
    print(e)

  ret_dict["capital_expenditures"] = info
  tally(ret_dict, info["color"])

def dividends_analysis(data_dict, ret_dict):

  info = {}
  info["year"] = "N/A"
  info["target"] = "N/A"
  info["color"] = NA

  try:

    divs = data_dict["dividends"]
    list_data = list(divs.items())
    
    if len(list_data)!=0:
      value = list_data[-1]
      info["year"] = value[0]
      info["target"] = value[1]
      info["color"] = NEUTRAL

  except Exception as e:
    print(e)

  ret_dict["dividends"] = info
  tally(ret_dict, info["color"])