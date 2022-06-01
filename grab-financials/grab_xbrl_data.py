from collections import OrderedDict
import bs4 as bs
import requests
import pandas as pd
import time
from pprint import pprint
import os
import math

import firebase_admin
from firebase_admin import credentials
from firebase_admin import firestore

# Setting up firestore connection
cred = credentials.Certificate('/Users/loganthorneloe/src/stock-boy-3d183-firebase-adminsdk-zyxu6-76a70bc31c.json')
firebase_admin.initialize_app(cred, {
  'projectId': 'stock-boy-3d183',
})

db = firestore.client()

def get_ticker_doc(company_name):
    doc_ref = db.collection(u'stock_data').document(company_name).get()
    doc_dict = doc_ref.to_dict()
    return doc_dict

def get_company_names():
    doc_ref = db.collection(u'single_data').document('trading_symbols').get()
    doc_dict = doc_ref.to_dict().keys()
    return doc_dict

# this function needs to grab a document and simplify everything in it
def create_simple_data(company_name):

    #get the complex data here
    company_dict = get_ticker_doc(company_name)

    for key, value in company_dict.items():
        split_key = key.split('_')
        if split_key[1] == "complex":
            this_year = split_key[0]
            
            list_of_data = value[0:len(value)-8] # removing the source urls

            income_index = list_of_data.index("income_statement")
            cash_index = list_of_data.index("cash_flow")

            balance_sheet_arr = list_of_data[0:income_index]
            income_statement_arr = list_of_data[income_index: cash_index]
            cash_flow_arr = list_of_data[cash_index:len(list_of_data)]

            balance_sheet_titles = balance_sheet_arr[0:(len(balance_sheet_arr)//2)]
            balance_sheet_data = balance_sheet_arr[len(balance_sheet_arr)//2:len(balance_sheet_arr)]

            income_statement_titles = income_statement_arr[0:len(income_statement_arr)//2]
            income_statement_data = income_statement_arr[len(income_statement_arr)//2:len(income_statement_arr)]

            cash_flow_titles = cash_flow_arr[0:len(cash_flow_arr)//2]
            cash_flow_data = cash_flow_arr[len(cash_flow_arr)//2:len(cash_flow_arr)]

            print(this_year)

            print(len(balance_sheet_titles))
            print(len(balance_sheet_data))
            print(len(income_statement_titles))
            print(len(income_statement_data))
            print(len(cash_flow_titles))
            print(len(cash_flow_data))

            '''
            Things we want to retrieve:
            Income Statement
            1. Profit Margin / Revenue: >40% or >70% (great), <20% is very bad
            This is calculated by profit margin/revenue
            Profit Margin can be: gross margin or net sale - cost of sales
            2. Admin Costs / Profit Marging: <30%, >80% is terrible
            Selling, general and administrative / profit margin (this can be determined from above)
            3. Research and Development/ Profit Marging: <20% and consistent over a decade
            Research and Development / profit margin
            4. Depreciation / Profit Margin: < 10%
            Depreciation/ Profit Margin, but depreciation can also be hidden in the other income/expense section of the statement
            5. Interest Expense: < 15%, banking industry is an exception to this rule
            interest expense/ pre-tax income -> this expense can be hidden in other income/expense and pre-tax income can be referenced as income before provision for income taxes
            6. Income tax: > 10%, closest to 30%
            provision for income taxes / pre-tax income -> pre-tax income can be references as income before provision for income taxes
            7. Net income: > 20%, <10% is disqualifying, we want a general upward trand over a decade
            Net income / net sales
            8. Per-share earnings: consistent over past decade, increasing is preferred, want this to be positive
            Earnings per share (basic) or EPS(basic) -> this might be in a header and then sub-row
            Balance Sheet:
            9. Short-term cash: positive/consistent over the past decade
            Cash and cash equivalents -> short-term investments included in current assets also work here
            10. Inventory: rising inventory value over a decade
            Inventories or inventory
            11. Net receivables: lower than competitors (need to use judgment here)
            account receivables, net/net sales -> account receivables, net = account receivables - short-term deb
            12. Property value: low compared to competitors
            Property, plant and equipment, net
            13. Goodwill: increasing over the decade
            Goodwill
            14. Intangible assets: increasing over the decade
            intangible assets, net -> also need to consider the company brand in this evaluation
            15. Long-term investments: companies buy other companies with DCA
            Check for non-current asets for sub-category that fits this. If it's positive, check what companies they have purchased
            16. Return on Assets Ratio: > 6% but less than 25%
            Divide net income / total assets
            17. Short-term debt: <0.60, but the lower the better, none is best
            Divide short-term debt by long-term debt -> might be under current and non-current liabilities as term debt
            18. Long-term debt: net income * 4 > long-term debt
            Net income * 4 > long-term debt
            19. Adjust debt to shareholders' equity ratio: <.80
            Total liabilities / (total shareholder's equity + treasury shares) -> treasury shares might not exist, use common stock repurchase on cash flow if this is the ase
            20. Preferred stock: none or very little
            Preferred stock existing or not existing on balance sheet -> will be in shareholder's equity section
            21. Retained earnings: growing by >5% each year
            Look for retained earnings -> (net earnings - common stock cash dividends paid - common stock repurchased)
            22. Treasury share: look for presence of treasury shares
            Treasury shares or Treasury stock (should be a negative value)
            23. Return on Shareholder's equity: >20%
            Net income/shareholder's equity -> add in treasury shares to shareholders' equity if they exist
            Cash Flow
            24. Capital Expenditures: <25% is really good, > 50% is bad
            Total payments in investing activities and divide by net income -> payments for or payments made in
            25. Stock buybacks: the existence of these
            Repurchase of common stock and it should be negative
            '''

            '''
            Things we need to pull from financials:
            Profit Margin us-gaap:GrossProfit
            Revenue us-gaap:Revenues
            Admin costs us-gaap:SellingGeneralAndAdministrativeExpense us-gaap:GeneralAndAdministrativeExpense
            Research and development costs us-gaap:ResearchAndDevelopmentExpense
            Depreciation tsla:DepreciationAmortizationAndImpairment us-gaap:DepreciationDepletionAndAmortization
            Interest expense us-gaap:InterestExpense
            Provisions for income tax us-gaap:IncomeTaxExpenseBenefit
            pre-tax income us-gaap:IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest
            Net income us-gaap:ProfitLoss
            Net sales -> us-gaap:RevenueFromContractWithCustomerExcludingAssessedTax
            EPS(basic) us-gaap:EarningsPerShareBasic
            Cash and cash equivalents (short-term cash) us-gaap:CashAndCashEquivalentsAtCarryingValue
            inventory us-gaap:InventoryNet
            Account receivables, net us-gaap:AccountsReceivableNetCurrent
            property, plant, equipment value us-gaap:PropertyPlantAndEquipmentNet
            goodwill us-gaap:Goodwill
            intangible assets us-gaap:IntangibleAssetsNetExcludingGoodwill
            long-term investments us-gaap:LongTermInvestments or us-gaap:OtherAssetsNoncurrent -> needs a manual review
            total assets us-gaap:Assets
            short-term debt us-gaap:LiabilitiesCurrent
            long-term debt us-gaap:Liabilities - us-gaap:LiabilitiesCurrent or us-gaap:LongTermDebtNoncurrent
            long-term debt come due us-gaap:LongTermDebtCurrent
            total liabilities us-gaap:Liabilities
            total shareholders' equity us-gaap:StockholdersEquity
            preferred stock us-gaap:PreferredStockValue
            retained earnings (possible subcategories instead) us-gaap:RetainedEarningsAccumulatedDeficit
            treasury shares us-gaap:TreasuryStockValue
            payments in investing activities us-gaap:NetCashProvidedByUsedInInvestingActivities
            repurchase of common stock us-gaap:PaymentsForRepurchaseOfCommonStock
            dividends us-gaap:PaymentsOfDividends

            '''

# create_simple_data('tesla, inc.')



import csv
import pprint
import pathlib
import collections
import xml.etree.ElementTree as ET

# define our working directory
sec_directory = pathlib.Path.cwd().join("facebook10Q")
print(sec_directory)

# define filepath to the documents
# NEED TO COME BACK TO THIS - 5:47
# can't really download each of these each time

# creating url for these files seems to be similar to what I was doing for xml
# grab starting two numbers from 10 idx doing the necessary things to the end of it
# append {ticker}-{year}{fiscal_year_end}_{htm/cal/lab/def}.xml
file_htm = ''
file_cal = ''
file_lab = ''
file_def = ''

# define storage components
storage_list = []
storage_values = {}
storage_gap = {}

# create a named Tuple
FilingTuple = collections.namedtuple('FilingTuple', ['file_path', 'namespace_element', 'namespace_label'])

files_list = [
  FilingTuple(file_cal, r'{http://www.xbrl.org/2003/linkbase}calculationLink', 'calculation'),
  FilingTuple(file_def, r'{http://www.xbrl.org/2003/linkbase}definitionLink', 'definition'),
  FilingTuple(file_lab, r'{http://www.xbrl.org/2003/linkbase}labelLink', 'label'),
]

# define two categories of labels - wanted and not wanted
avoids = ['linkbase','roleRef']
parse  = ['label','labelLink','labelArc','loc','definition','definitionArc','calculationArc']

# create two sets to store keys
lab_list = set()
cal_list = set()

# loop through each file
for file in files_list[0]:

  # parse that file
  tree = ET.parse(file.file_path)

  # grab all the namespace elements in the tree
  elements = tree.findall(file.namespace_element)

  # loop through each element
  for element in elements:

    # if there's an element child we want to parse those as well
    for child_element in element.iter():

      print(child_element)


