import React, { Component } from "react";
import LittleTable from './LittleTable';
import FinancialLinks from './FinancialLinks';
import Row from 'react-bootstrap/Row'
import OverviewBar from "./OverviewBar";
import { Accordion, Alert, Button } from "react-bootstrap";
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

  stripCik = (nameAndTicker) => {
    var second = nameAndTicker.split(':')
    if (second.length > 1){
      if(second[1].toLowerCase().includes('cik')){
        return second[0]
      }
    }
    return nameAndTicker
  }

  render() {
      return (
        <div className="container-fluid" style={{"marginTop":"4.5em","marginBottom":".5em"}}>
          <div className="row g-2">
              <div className= "col-sm-1"></div>
              <div className= "col-sm-10" align="center">
                <Row style={{"marginBottom":"1em"}}>
                  <h2><strong>{this.stripCik(this.props.company)}</strong></h2>
                </Row>
                <Accordion defaultActiveKey="1" flush>
                  <Accordion.Item key="item1" eventKey="1">
                    <Accordion.Header><strong><FontAwesomeIcon icon="fa-solid fa-chart-line fa-xl" style ={{color: 'black', "marginRight":"1em" }}/>Fundamental Analysis (Beta)</strong></Accordion.Header>
                    <Accordion.Body>
                      <Row className="justify-content-md-center">
                        <Alert variant= 'primary' width="80%">
                        The below fundamentals help investors determine if a company has a competitive advantage and is a great long-term investment. They are analyzed according to Warren Buffett's strategy in the book "Warren Buffett and the Interpreration of Financial Statements".
                        </Alert>
                      </Row>
                      <Row style={{"marginBottom":"1em"}}>
                        <OverviewBar companyDataDict = {this.props.companyDataDict}/>
                      </Row>
                      <Row>
                        <LittleTable companyDataDict = {this.props.companyDataDict} company= {this.props.company}/>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <Accordion defaultActiveKey="1" flush>
                  <Accordion.Item key="item1" eventKey="1">
                    <Accordion.Header><FontAwesomeIcon icon="fa-solid fa-sack-dollar fa-xl" style ={{color: 'black', "marginRight":"1em" }}/><strong>Financial Statements</strong></Accordion.Header>
                    <Accordion.Body>
                      <Row className="justify-content-md-center">
                        <Alert variant= 'primary' width="80%">
                          This is a company's annual report, balance sheet, income statement, and cash flow statement pulled directly from SEC filings. Due to the inconsistency of filings, some filings may be missing.
                        </Alert>
                      </Row>
                      <Row>
                        <FinancialLinks company={this.props.company} companyDict={this.props.companyFinancialsDict}/>
                      </Row>
                    </Accordion.Body>
                  </Accordion.Item>
                </Accordion>
                <Row className="justify-content-md-center">
                  <div className= "col-sm-1"></div>
                    <div className= "col-sm-10">
                      <Button variant="outline-danger" onClick={() => this.openURL("https://twitter.com/messages/compose?recipient_id=1255526571764600834")}>Report An Issue</Button>{''}
                    </div>
                  <div className= "col-sm-1"></div>
                </Row>
              </div>
              <div className= "col-sm-1"></div>
          </div>
        </div>
      );
  }
}

export default DataPage;