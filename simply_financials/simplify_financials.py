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

    for key, value in company_dict:
        split_key = key.split('_')
        if split_key[1] == "complex":
            this_year = split_key[0]
            
            list_of_data = value[0:len(value)-8]

            income_index = list_of_data.index("income_statement")
            cash_index = list_of_data.index("cash_flow")

            balance_sheet_arr = list_of_data[0:income_index]
            income_statement_arr = list_of_data[income_index: cash_index]
            cash_flow_arr = list_of_data[cash_index:len(list_of_data)]

            balance_sheet_titles = balance_sheet_arr[0:len(balance_sheet_arr)/2]
            balance_sheet_data = balance_sheet_arr[len(balance_sheet_arr)/2:len(balance_sheet_arr)]

            income_statement_titles = income_statement_arr[0:len(income_statement_arr)/2]
            income_statement_data = income_statement_arr[len(income_statement_arr)/2:len(income_statement_arr)]

            cash_flowt_titles = cash_flow_arr[0:len(cash_flow_arr)/2]
            cash_flow_data = cash_flow_arr[len(cash_flow_arr)/2:len(cash_flow_arr)]


            '''
            list_to_use = this.props.companyDict[key_to_use]

            // this is popping for the sources
            // for(var i = 0; i < 8; i++){
            //     list_to_use.pop()
            // }

            var list_to_use_minus_sources = list_to_use.slice(0, list_to_use.length-8)

            // if(list_to_use.at(-2) === "source"){
            //     // get rid of the source in the array
            //     list_to_use.pop()
            //     list_to_use.pop()
            // }

            var income_statement_index = list_to_use_minus_sources.indexOf("income_statement")
            var cash_flow_index = list_to_use_minus_sources.indexOf("cash_flow")

            var balance_sheet_arr = list_to_use_minus_sources.slice(0, income_statement_index)
            var income_statement_arr = list_to_use_minus_sources.slice(income_statement_index, cash_flow_index)
            var cash_flow_arr = list_to_use_minus_sources.slice(cash_flow_index, list_to_use_minus_sources.length)

            var balance_sheet_columns = {
                one: balance_sheet_arr.slice(0, (balance_sheet_arr.length/2)),
                two: balance_sheet_arr.slice(balance_sheet_arr.length/2, balance_sheet_arr.length)
            }
            var income_statement_columns = {
                one: income_statement_arr.slice(0, (income_statement_arr.length/2)),
                two: income_statement_arr.slice(income_statement_arr.length/2, income_statement_arr.length)
            }
            var cash_flow_columns = {
                one: cash_flow_arr.slice(0, (cash_flow_arr.length/2)),
                two: cash_flow_arr.slice(cash_flow_arr.length/2, cash_flow_arr.length)
            }

            this.balanceSheet = this.createList(balance_sheet_columns)
            this.cashFlow = this.createList(cash_flow_columns)
            this.incomeStatement = this.createList(income_statement_columns)
            this.balanceSheetHeader = this.createHeader(balance_sheet_columns)
            this.cashFlowHeader = this.createHeader(cash_flow_columns)
            this.incomeStatementHeader = this.createHeader(income_statement_columns)
            '''

