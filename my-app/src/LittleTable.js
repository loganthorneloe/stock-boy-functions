import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import { Col } from "react-bootstrap";
import { Row, Alert } from "react-bootstrap";
import { Accordion } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faO, faX, faBan, faCircleQuestion } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { Line } from "react-chartjs-2"
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

library.add(faCheck, faO, faX, faBan, faCircleQuestion)

var analyzed_dict = {
  "profit_margin_over_revenue": {
    "desc": "This checks what percentage of a company's revenue ends up as profit.",
    "label" : "Profit Margin",
    "target" : ">0.40"
  },
  "admin_over_profit_margin": {
    "desc": "This checks what percentage of a company's profit goes toward administration costs.",
    "label" : "Administration Cost",
    "target" : "<0.30"
  },
  "research_over_profit_margin": {
    "desc": "This checks what percentage of a company's profit goes toward research and development costs. This check may be red or neutral if R&D costs aren't consistently below the target value for 5-10 years. Note: the tech industry will spend more on R&D so this value can be a little bit higher for tech companies.",
    "label" : "Research Cost",
    "target" : "<0.20 for the past 5-10 years"
  },
  "depreciation_over_profit_margin": {
    "desc": "This checks what percentage of a company's profits are dimished by asset depreciation.",
    "label" : "Depreciation",
    "target" : "<0.10"
  },
  "interest_expense_over_pre_tax_income": {
    "desc": "This checks how much debt a company is using to pay for their assets. Note: financial companies can't be judged by this metric because the entire business model is based on debt.",
    "label" : "Interest Expense",
    "target" : "<0.15"
  },
  "income_tax_over_pre_tax_income": {
    "desc": "This checks what percentage of income a company pays in taxes. We want this to be accurate to what the company should pay (~30% of income). If a company is misleading the IRS to pay less in taxes, they're probably misleading their shareholders as well.",
    "label" : "Income Tax",
    "target" : ">0.20"
  },
  "net_income_over_revenue": {
    "desc": "This checks what percentage of a company's revenue ends up as earnings. This check will fail if net income isn't showing a general upward trend over the past 5-10 years. Note: financial companies can't be judged by this factor because higher net earnings can show a lack of risk management which is where banks make their money.",
    "label" : "Net Income",
    "target" : ">0.20"
  },
  "earnings_per_share": {
    "desc": "This checks for an upward per-share earnings trend over the past 5-10 years but will fail if those historical earnings are not positive and consistent.",
    "label" : "Per-share Earnings",
    "target" : "positive"
  },
  "short_term_cash_on_hand": {
    "desc": "This checks if a company has enough cash on hand to work through possible financial issues. This check will fail if cash on hand hasn't been positive for the past 5-10 years.",
    "label" : "Short-term Cash",
    "target" : "positive"
  },
  "inventory": {
    "desc": "This checks for an upward trend in inventory value over the past 5-10 years.",
    "label" : "Inventory",
    "target" : "positive"
  },
  "net_receivables": {
    "desc": "This checks the ratio of net receivables to gross profit for a company. A higher value here shows a company is owed money for sales. This value should be lower than the competition.",
    "label" : "Net Receivables",
    "target" : "lower than competitors"
  },
  "property_value": {
    "desc": "This checks how expensive a company's facilities are. This value should be lower than the competition.",
    "label" : "Property",
    "target" : "lower than competitors"
  },
  "goodwill": {
    "desc": "This checks for increasing goodwill over time. Increasing goodwill means a company is purchasing other valuable companies. Note: a lack of goodwill is not a negative factor.",
    "label" : "Goodwill",
    "target" : "increasing over time"
  },
  "intangible_assets": {
    "desc": "This checks the value of a company's reported intangible assets for an upward trend.",
    "label" : "Intangible Assets",
    "target" : "increasing over time"
  },
  "long_term_investments": {
    "desc": "This checks the value of a company's long-term investments. If long-term investments are present, an investor must research what those are and decide whether they are good investments.",
    "label" : "Long-term Investments",
    "target" : "present and good investments"
  },
  "return_on_assets": {
    "desc": "This checks a company's net earnings compared to their assets. A higher return on assets ratio shows a company is utilizing their assets well to generate returns. If this value is too high, it shows it doesn't take much capital to compete with the company.",
    "label" : "Return on Assets",
    "target" : ">0.06, <0.25"
  },
  "short_term_debt": {
    "desc": "This checks how many dollars of short-term debt a company takes on per $1 of long-term debt. A high amount of short-term debt can put a company's advantage at the mercy of their short-term debtors. ",
    "label" : "Short-term Debt",
    "target" : "<0.60"
  },
  "long_term_debt": {
    "desc": "This checks if a company has enough earnings to pay off their long-term debt in 4 years or less.",
    "label" : "Long-term Debt",
    "target" : ">1"
  },
  "adjusted_stockholders_equity": {
    "desc": "This determines if a company is using debt or earnings to pay for their operations. Using debt to fund operations puts a company's advantage at risk. This adjusted ratio takes stock buybacks into account to get a better picture of total shareholders' equity. Note: this factor is not applicable to financial companies because they need to utilize lots of debt to make money.",
    "label" : "Adjusted Debt to Shareholders' Equity",
    "target" : "<0.80"
  },
  "preferred_stock": {
    "desc": "This checks for the presence of preferred shares on a company's balance sheet. Preferred shares are bad for retail investors and expensive for a company.",
    "label" : "Preferred Stock",
    "target" : "0"
  },
  "retained_earnings": {
    "desc": "This checks for earnings that aren't used for dividends or stock buybacks. These earnings stay with the business and are used to make it to grow. This check will fail if retained earnings aren't growing for the past 5-10 years. Note: some companies pay out all retained earnings toward dividends and buybacks because they are so profitable they don't need to retain them to grow. In this case, a lack of retained earnings can be positive.",
    "label" : "Retained Earnings",
    "target" : "growing retained earnings/stock buybacks"
  },
  "treasury_shares_repurchase_stock": {
    "desc": "This checks for the repurchase of common stock. This is a great way for companies to grow their share price.",
    "label" : "Stock Buyback",
    "target" : "a non-zero, non-NaN value"
  },
  "return_on_shareholder_equity": {
    "desc": "This checks how well a company is allocating its shareholders' money. A higher value shows retained earnings are being used well.",
    "label" : "Return on Shareholders' Equity",
    "target" : ">0.20"
  },
  "capital_expenditures": {
    "desc": "This checks what percentage of earnings are used toward long-term operating expenses.",
    "label" : "Capital Expenditures",
    "target" : "<0.25"
  }
}

export class LittleTable extends Component {

    constructor(props) {
      super(props);
      this.known_analyzed1 = []
      this.known_analyzed2 = []
      this.generateAnalyzedData()
    }

    componentDidUpdate(prevProps) {
      if (prevProps.companyDataDict !== this.props.companyDataDict || prevProps.company !== this.props.company) {
        this.generateAnalyzedData()
        this.forceUpdate()
      }
    }

    retrieveLatestYearValue(data){
      var returnVal = 0
      for (const value of Object.values(data)) {
        if (value!==0 && value!=='N/A'){
          returnVal = value
        }
      }
      return returnVal
    }

    generateAnalyzedData(){
      if(typeof this.props.companyDataDict == 'undefined' || this.props.companyDataDict == null || this.props.companyDataDict === "undefined"){
        this.known_analyzed1 = []
        this.known_analyzed2 = []
        return
      }
      if ("analyzed" in this.props.companyDataDict){
        var analyzed = this.props.companyDataDict["analyzed"]
        var known_analyzed = []

        for (const [key, value] of Object.entries(analyzed_dict)) {
          var factor_data = analyzed[key]
          known_analyzed.push({key: value["label"], color: factor_data["color"], value: this.retrieveLatestYearValue(factor_data["data"]), desc: value["desc"], target: value["target"], trend: factor_data["trend"], data: factor_data["data"]})
        }

        var known_split = known_analyzed.length/2
        if (known_analyzed.length%2 !== 0){
          known_split += .5
        }
        this.known_analyzed1 = known_analyzed.slice(0, known_split)
        this.known_analyzed2 = known_analyzed.slice(known_split, known_analyzed.length)

      }else{
        this.known_analyzed1 = []
        this.known_analyzed2 = []
      }
    }

    renderRow(new_list_row) {

      function renderTrend(num){
        if(num > 0){
          return "positive"
        }else if(num < 0){
          return "negative"
        }else{
          return "neutral"
        }
      }

      function renderChart(dict, value){

        var options = {
          plugins: {
            legend: {
              display: false
            }
          }
        }
        if(value>1000000){
          options = {
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                ticks: {
                  callback: v => `${v/1000000}M`
                },
              }
            }
          }
        }else if(value > 1000){
          options = {
            plugins: {
              legend: {
                display: false
              }
            },
            scales: {
              y: {
                ticks: {
                  callback: v => `${v/1000}K`
                },
              }
            }
          }
        }
        
        var labels = Object.keys(dict);
        
        const data = {
          labels,
          datasets: [
            {
              data: dict,
              borderColor: 'rgb(0, 0, 0)',
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
            }
          ],
        }
  
        return (
          <Line options={options} data={data} />
        )
      }

      if(new_list_row.color === "green"){
        return (
          <Accordion key={new_list_row.key} defaultActiveKey="0" style ={{background: '#bfe3b4', "margin":"1px" }} flush>
            <Accordion.Item style ={{backgroundColor: '#bfe3b4' }}>
              <Accordion.Header>
                <FontAwesomeIcon icon="fa-solid fa-check fa-xl" style ={{color: 'green', "marginRight":"1em" }}/> {new_list_row.key}
              </Accordion.Header>
              <Accordion.Body>
                <h6>Value: <strong>{parseFloat(new_list_row.value).toLocaleString()}</strong></h6>
                <div></div>
                <h6>Trend: <strong>{renderTrend(parseFloat(new_list_row.trend))}</strong></h6>
                <div></div>
                <h6>Target: <strong>{new_list_row.target}</strong></h6>
                <div></div>
                {new_list_row.desc}
                {renderChart(new_list_row.data, new_list_row.value)} 
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )
      }
      if(new_list_row.color === "red"){
        return (
          <Accordion key={new_list_row.key} defaultActiveKey="0" style ={{backgroundColor: '#F47174' , "margin":"1px" }} flush>
            <Accordion.Item style ={{backgroundColor: '#F47174' }}>
              <Accordion.Header>
                <FontAwesomeIcon icon="fa-solid fa-x fa-xl" style ={{color: 'red', "marginRight":"1em" }}/> {new_list_row.key}
              </Accordion.Header>
              <Accordion.Body>
                Value: <strong>{parseFloat(new_list_row.value).toLocaleString()}</strong>
                <div></div>
                Trend: <strong>{renderTrend(parseFloat(new_list_row.trend))}</strong>
                <div></div>
                Target: <strong>{new_list_row.target}</strong>
                <div></div>
                {new_list_row.desc}
                {renderChart(new_list_row.data, new_list_row.value)} 
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )
      }
      if(new_list_row.color === "neutral"){
        return (
          <Accordion key={new_list_row.key} defaultActiveKey="0" style ={{backgroundColor: '#D3D3D3' , "margin":"1px"}} flush>
            <Accordion.Item style ={{backgroundColor: '#D3D3D3' }}>
              <Accordion.Header>
                <FontAwesomeIcon icon="fa-solid fa-o fa-xl" style ={{color: 'grey', "marginRight":"1em" }}/> {new_list_row.key}
              </Accordion.Header>
              <Accordion.Body>
                Value: <strong>{parseFloat(new_list_row.value).toLocaleString()}</strong>
                <div></div>
                Trend: <strong>{renderTrend(parseFloat(new_list_row.trend))}</strong>
                <div></div>
                Target: <strong>{new_list_row.target}</strong>
                <div></div>
                {new_list_row.desc}
                {renderChart(new_list_row.data, new_list_row.value)} 
              </Accordion.Body>
            </Accordion.Item>
          </Accordion>
        )
      }
      return (
        <Accordion key={new_list_row.key} defaultActiveKey="0" style ={{backgroundColor: '#666666' , "margin":"1px"}} flush>
          <Accordion.Item style ={{backgroundColor: '#666666'}}>
            <Accordion.Header>
              <FontAwesomeIcon icon="fa-solid fa-ban fa-xl" style ={{color: 'black', "marginRight":"1em" }}/> {new_list_row.key}
            </Accordion.Header>
            <Accordion.Body style={{color: '#ffffff'}}>
                {new_list_row.desc}  
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      )
  }

    render() {
      if (this.known_analyzed1.length === 0){
        return(
          <div>
            <Alert variant='primary'>
              Fundamental Analysis for this stock coming soon! Check out the financial statements below in the meantime.
            </Alert>
          </div>
        );
      } else{
        return (
          <div>
            <Alert variant='primary'>
              The 24 fundamentals below are determined <strong style ={{color: 'green'}}>good</strong>, <strong style ={{color: 'red'}}>bad</strong>, or <strong style ={{color: 'grey'}}>neutral</strong> for company growth. These determine a % score in the confidence of a stock's long-term competitive advantage.
            </Alert>
            <Table bordered hover>
                <Row>
                  <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.known_analyzed1.map(this.renderRow)}</Col>
                  <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.known_analyzed2.map(this.renderRow)}</Col>
                </Row>
            </Table>
          </div>
        );
      }
    }
}

export default LittleTable;