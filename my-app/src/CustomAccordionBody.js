// import './CompanyAccordion.css'

import React, { Component } from "react";
import LittleTable from './LittleTable';
import FinancialLinks from './FinancialLinks';
import { Accordion, Alert, Row } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faSackDollar } from '@fortawesome/free-solid-svg-icons'

library.add(faSackDollar)

export class CustomAccordionBody extends Component {

    render() {
      return (
        <div className="container-fluid">
          <Accordion.Body>
            <Row>
              <LittleTable companyDataDict = {this.props.companyDict["data"]} company= {this.props.companyDict["company"]}/>
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
                    <FinancialLinks company={this.props.companyDict["company"]} companyDict={this.props.companyDict["financials"]}/>
                  </Row>
                </Accordion.Body>
              </Accordion.Item>
            </Accordion>
          </Accordion.Body>
        </div>
    );
    }
}

export default CustomAccordionBody;