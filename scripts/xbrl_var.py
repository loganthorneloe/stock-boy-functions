# all possible labels for each var we are looking for ordered by precedence

profit_margin_labels = [
  'GrossProfit',
  'ProfitLoss'
]

# total income, this should be at the top of the income statement
revenue_labels = [
  'RevenueFromContractWithCustomerExcludingAssessedTax',
  'Revenues'
]

admin_labels = [
  'GeneralAndAdministrativeExpense',
  'SellingGeneralAndAdministrativeExpense'
]

research_labels = [
  'ResearchAndDevelopmentExpense'
]

depreciation_labels = [ 
  'Depreciation',
  'DepreciationDepletionAndAmortization',
  'AccumulatedDepreciationDepletionAndAmortizationPropertyPlantAndEquipment'
]

interest_expense_labels = [ 
  'InterestExpense'
]

income_tax_labels = [ 
  'IncomeTaxExpenseBenefit'
]

pre_tax_income_labels = [ 
  'IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest',
  'IncomeLossFromContinuingOperationsBeforeIncomeTaxesMinorityInterestAndIncomeLossFromEquityMethodInvestments'
]

# revenue minus cost of revenue
net_income_labels = [
  'NetIncomeLoss',
  'ProfitLoss'
]

# revenue minus sales returns, allowances, and discounts
# net_sales_labels = [ 
#   'RevenueFromContractWithCustomerExcludingAssessedTax'
# ]

# first choice is when basic and diluted are the same - it reports under one us-gaap. In this case, the second choice will only include different basic earnings per share
earnings_per_share_labels = [ 
  'EarningsPerShareBasicAndDiluted',
  'EarningsPerShareBasic'
]

cash_and_equivalents_labels = [ 
  'CashAndCashEquivalentsAtCarryingValue'
]

inventory_labels = [ 
  'InventoryNet'
]

accounts_receivables_labels = [ 
  'AccountsReceivableNetCurrent',
  'ReceivablesNetCurrent'
]

property_value_labels = [ 
  'PropertyPlantAndEquipmentNet'
]

goodwill_labels = [ 
  'Goodwill'
]

# this one is interesting because 
intangible_assets_labels = [ 
  'IntangibleAssetsNetExcludingGoodwill',
  'FiniteLivedIntangibleAssetsGross',
  'FiniteLivedIntangibleAssetsNet'
]

long_term_investments_labels = [ 
  'LongTermInvestments',
  'OtherAssetsNoncurrent' # needs a manual review
]

total_assets_labels = [ 
  'Assets'
]

# this should include long-term debt come due
short_term_debt_labels = [
  'LongTermDebtCurrent'
  # 'LiabilitiesCurrent'
]

# can also calculate this via liabilities - short term debt (liabilities current)
long_term_debt_labels = [
  'LongTermDebtNoncurrent'
]

liabilities_labels = [ 
  'Liabilities'
]

stockholders_equity_labels = [ 
  'StockholdersEquity'
]

preferred_stock_labels = [ 
  'PreferredStockValue'
]

retained_earnings_labels = [ 
  'RetainedEarningsAccumulatedDeficit'
]

treasury_shares_labels = [ 
  'TreasuryStockValue'
]

payments_in_investing_labels = [ 
  'NetCashProvidedByUsedInInvestingActivities'
]

repurchase_common_stock_labels = [ 
  'PaymentsForRepurchaseOfCommonStock'
]

dividends_labels = [ 
  'PaymentsOfDividends',
  'PaymentsOfDividendsCommonStock'
]