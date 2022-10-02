import React, { Component } from "react";
import LittleTable from './LittleTable';
import FinancialLinks from './FinancialLinks';
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import OverviewBar from "./OverviewBar";
import { Accordion, Alert } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faO, faX, faBan, faCircleQuestion, faChartLine, faSackDollar } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faCheck, faO, faX, faBan, faCircleQuestion, faChartLine, faSackDollar)

export class DataPage extends Component {

  openURL = (url) => {
    if(typeof url !== 'undefined'){
        window.open(url, '_blank');
    }
  }

  renderData(companyDict) {
    function stripCik(nameAndTicker) {
      var second = nameAndTicker.split(':')
      if (second.length > 1){
        if(second[1].toLowerCase().includes('cik')){
          return second[0]
        }
      }
      return nameAndTicker
    }
    function format(dataDict) {
      try{
        var percentage = dataDict["analyzed"]["confidence"]
      }catch(error){
        return 'N/A'
      }
      var truncated = Math.trunc(percentage*100)
      if (isNaN(truncated)){
        return 'N/A'
      }
      return truncated + '%'
    }

    return(
    <div>
      <div className= "col-sm-1"></div>
      <div className= "col-sm-10" align="center">
        <Accordion defaultActiveKey="0" flush>
          <Accordion.Item key="item1" eventKey="1">
            <Accordion.Header>
              <Col align="center">
                <Row>
                  <h3><strong>{stripCik(companyDict["company"])}</strong></h3>
                </Row>
                <Row>
                  <h2 style={{"fontSize":"50px"}}><strong>{format(companyDict["data"])}</strong></h2>
                </Row>
                <Row style={{"marginTop":".5em"}}>
                  <OverviewBar companyDataDict = {companyDict["data"]}/>
                </Row>
              </Col>
            </Accordion.Header>
            <Accordion.Body>
              <Row>
                <LittleTable companyDataDict = {companyDict["data"]} company= {companyDict["company"]}/>
              </Row>
              <Accordion defaultActiveKey="0" flush>
                <Accordion.Item key="item1" eventKey="1">
                  <Accordion.Header><FontAwesomeIcon icon="fa-solid fa-sack-dollar fa-xl" style ={{color: 'black', "marginRight":"1em" }}/>Links to Financial Statements</Accordion.Header>
                  <Accordion.Body>
                    <Row className="justify-content-md-center">
                      <Alert variant= 'primary' width="80%">
                        This is a company's annual report, balance sheet, income statement, and cash flow statement pulled directly from SEC filings. Due to the inconsistency of filings, some filings may be missing.
                      </Alert>
                    </Row>
                    <Row>
                      <FinancialLinks company={companyDict["company"]} companyDict={companyDict["financials"]}/>
                    </Row>
                  </Accordion.Body>
                </Accordion.Item>
              </Accordion>
            </Accordion.Body>
          </Accordion.Item>
        </Accordion>
      </div>
      <div className= "col-sm-1"></div>
    </div>
    )
  }

  render() {
    if (this.props.companies.length === 1){
      return (
        <div className="container-fluid" style={{"marginTop":"4.5em","marginBottom":".5em"}}>
          <div className="row g-2">
          <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.renderData(this.props.companies[this.props.companies.length-1])}</Col>
              <div className= "col-sm-1"></div>
              <div className= "col-sm-10">
                <h2 style={{"marginLeft":"1em", "fontSize":"20px"}}>Recents</h2>
              </div>
              <div className= "col-sm-1"></div>
              <Row className="justify-content-md-center">
                <div className= "col-sm-1"></div>
                <div className= "col-sm-10" align="center">
                  <font size="2" className="roboto">
                    As you search more stocks, we'll show up to 9 recent searches here to compare fundamentals!
                  </font>
                </div>
                <div className= "col-sm-1"></div>
              </Row>
          </div>
        </div>
      );
    } else {
      return (
        <div className="container-fluid" style={{"marginTop":"4.5em","marginBottom":".5em"}}>
          <div className="row g-2">
          <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.renderData(this.props.companies[this.props.companies.length-1])}</Col>
              <div className= "col-sm-1"></div>
              <div className= "col-sm-10">
                <h2 style={{"marginLeft":"1em", "fontSize":"20px"}}>Recents</h2>
                <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.props.companies.slice(0,this.props.companies.length-1).reverse().map(this.renderData)}</Col>
              </div>
              <div className= "col-sm-1"></div>
              <Row className="justify-content-md-center">
                <div className= "col-sm-1"></div>
                <div className= "col-sm-10" align="center">
                  <font size="2" className="roboto">
                    As you search more stocks, we'll show up to 9 recent searches here to compare fundamentals!
                  </font>
                </div>
                <div className= "col-sm-1"></div>
              </Row>
          </div>
        </div>
      );
    }
  }
}

export default DataPage;