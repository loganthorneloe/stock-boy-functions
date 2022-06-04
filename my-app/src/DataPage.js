import React, { Component } from "react";
import LittleTable from './LittleTable';
import SuperTable from './SuperTable';
import Row from 'react-bootstrap/Row'
import OverviewBar from "./OverviewBar";
import { Accordion, Alert } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faO, faX, faBan, faCircleQuestion, faChartLine, faSackDollar } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faCheck, faO, faX, faBan, faCircleQuestion, faChartLine, faSackDollar)

export class DataPage extends Component {

    render() {
        return (
          <div className="container-fluid" style={{"marginTop":"5em","marginBottom":".5em"}}>
            <div className="row g-2">
                <div className= "col-sm-1"></div>
                <div className= "col-sm-10" align="center">
                  <Row style={{"marginBottom":"1em"}}>
                    <h2><strong>{this.props.company}</strong></h2>
                  </Row>
                  <Accordion defaultActiveKey="1" flush>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header><FontAwesomeIcon icon="fa-solid fa-sack-dollar fa-xl" style ={{color: 'black', "marginRight":"1em" }}/><strong>Show Fundamental Analysis (Beta)</strong></Accordion.Header>
                      <Accordion.Body>
                        <Row className="justify-content-md-center">
                          <Alert variant= 'success' width="80%">
                            The below analysis automates research of stock fundamentals for retail investors to find companies that have a durable, competitive advantage and are considered good investments. The below factors are analyzed according to Warren Buffett's strategy in the book "Warren Buffett and the Interpreration of Financial Statements". Data is taken directly from the SEC. The analysis is still in the beta stage and may be incorrect or incomplete.
                          </Alert>
                        </Row>
                        <Row style={{"marginBottom":"1em"}}>
                          <OverviewBar companyDict = {this.props.companyDict} company= {this.props.company}/>
                        </Row>
                        <Row>
                          <LittleTable companyDict = {this.props.companyDict} company= {this.props.company}/>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                  <Accordion defaultActiveKey="0" flush>
                    <Accordion.Item eventKey="1">
                      <Accordion.Header><FontAwesomeIcon icon="fa-solid fa-chart-line fa-xl" style ={{color: 'black', "marginRight":"1em" }}/>Show Financial Statements</Accordion.Header>
                      <Accordion.Body>
                        <Row className="justify-content-md-center">
                          <Alert variant= 'primary' width="80%">
                            This is a company's income statement, balance sheet, and cash flow statement pulled directly from their filings with the SEC. Due to the inconsistency of filings, some values may not be complete.
                          </Alert>
                        </Row>
                        <Row>
                          <SuperTable company={this.props.company} companyDict={this.props.companyDict} yearList={this.props.yearList} currentYear={this.props.currentYear}/>
                        </Row>
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
                <div className= "col-sm-1"></div>
            </div>
          </div>
        );
    }
}

export default DataPage;