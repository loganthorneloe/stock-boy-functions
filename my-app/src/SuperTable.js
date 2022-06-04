import './SuperTable.css';
import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown'
import { Tabs, Tab } from 'react-bootstrap';
import Accordion from 'react-bootstrap/Accordion'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'

class SuperTable extends Component {
    constructor(props) { // props will be dict for certain stock
      super(props);
      this.tenKLink = ""
      this.balanceLink = ""
      this.incomeLink = ""
      this.cashLink = ""
      this.yearList = []
      this.currentYear = "2021"
      this.balanceSheet = []
      this.cashFlow = []
      this.incomeStatement = []
      this.balanceSheetHeader = {}
      this.cashFlowHeader = {}
      this.incomeStatementHeader = {}
      this.currentSheet = "balance_sheet"

      this.determineYears()
      this.grabSourceLinks()
      this.generateDisplayColumns()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.company !== this.props.company) {

            this.determineYears()
            this.grabSourceLinks()
            this.generateDisplayColumns()
            this.forceUpdate()
        }
    }

    determineYears(){
        if(typeof this.props.companyDict == "undefined" || this.props.companyDict == null){
            return
        }
        var keys_to_use = Object.keys(this.props.companyDict)

        var years_arr = []
        for (var i = 0; i < keys_to_use.length; i++){
          if (keys_to_use[i].includes('_')) {
            var split_key_array = keys_to_use[i].split('_')
            years_arr.unshift(split_key_array[0])
          }
        }
        
        this.yearList = years_arr.sort()
        years_arr.reverse()
        this.currentYear = this.yearList[0]
    }

    grabSourceLinks(){
        if(typeof this.props.companyDict == "undefined" || this.props.companyDict == null){
            return
        }
        var list_to_use = []
        var key_to_use = this.currentYear + "_complex"
        list_to_use = this.props.companyDict[key_to_use]
        this.tenKLink = list_to_use[list_to_use.length-1]
        this.balanceLink = list_to_use[list_to_use.length-7]
        this.incomeLink = list_to_use[list_to_use.length-5]
        this.cashLink = list_to_use[list_to_use.length-3]
    }

    generateDisplayColumns(){
        if(typeof this.props.companyDict == "undefined" || this.props.companyDict == null){
            return
        }
        var list_to_use = []
        var key_to_use = this.currentYear + "_complex" 
        list_to_use = this.props.companyDict[key_to_use]
        var list_to_use_minus_sources = list_to_use.slice(0, list_to_use.length-8)

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
    }

    renderRow(new_list_row, index) {
        if(new_list_row.key.includes("<b>")){
            var replaced = new_list_row.key.replace("<b>","")
            return (
                <tr key={index}>
                    <td><strong>{replaced}</strong></td>
                    <td style={{"textAlign":"right"}}>{new_list_row.value}</td>
                </tr>
            )
        }
        return (
            <tr key={index}>
                <td>{new_list_row.key}</td>
                <td style={{"textAlign":"right"}}>{new_list_row.value}</td>
            </tr>
        )
    }

    createCommaNumberFromString(str){
        var split_string = str.split(".")
        var arr = split_string[0].split("")
        var counter = 0
        var current_str = ""
        for(var i = arr.length-1; i >= 0; i--){
            if(arr[i] === "."){
                current_str = arr[i] + current_str
            }else{
                current_str = arr[i] + current_str
                counter++;
            }
            if(counter === 3){
                current_str = "," + current_str
                counter = 0
            }
        }
        if(current_str[0] === ','){
            current_str = current_str.slice(1, current_str.length)
        }
        if(current_str.slice(0,2) === '-,'){
            current_str = '-' + current_str.slice(2, current_str.len)
        }

        // add the decimal back onto the end if it existed
        if(split_string.length > 1){
            current_str = current_str + "." + split_string[1]
        }

        return current_str
    }

    createList (columns) {
        var new_list = []
        for (var i = 2; i < columns.one.length; i++) {
            if(typeof columns.one[i] !== 'string'){
                continue // this needs to be checked
            }
            // get rid of sentences in second column - must be a better way of doing this
            if(columns.two[i].length > 15){
                continue
            }
            var new_value = ""
            if(columns.two[i] !== "nan"){
                new_value = this.createCommaNumberFromString(columns.two[i])
            }
            var new_item = {"key" : columns.one[i], "value" : new_value}
            new_list.push(new_item)
        }
        return new_list
    }

    createHeader (columns) {
        var header = {"key" : columns.one[1], "value" : columns.two[1]}
        return header
    }

    openURL(url){
        if(typeof url !== 'undefined'){
            window.open(url, '_blank');
        }
    }

    handleSelect(key) {
        this.currentSheet = key
    }

    renderDropdown = (dropDownYear) => {
        return (
            <Dropdown.Item key={dropDownYear} eventKey={dropDownYear} onClick={(e) => this.changeValue(e.target.textContent)}>{dropDownYear}</Dropdown.Item>
        )
    }
  
    renderYearAccordion = (navYear) => {
        if(navYear === this.currentYear){
            return (
                <Nav.Item>
                    <Nav.Link onClick={(e) => this.changeValue(e.target.textContent)} align="center" active>{navYear}</Nav.Link>
                </Nav.Item>
            )
        }
        return (
            <Nav.Item>
                <Nav.Link onClick={(e) => this.changeValue(e.target.textContent)} align="center">{navYear}</Nav.Link>
            </Nav.Item>
        )
    }

    changeValue(text) {
        this.currentYear = text
        this.grabSourceLinks()
        this.generateDisplayColumns()
        this.forceUpdate()
    }

    handleNavSelect(url) {
        if(typeof url !== 'undefined'){
            window.open(url, '_blank');
        }
    }

    render() {    
    if(typeof this.props.companyDict === "undefined" && typeof this.props.company !== "undefined"){
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className= "col-sm-1"></div>
                    <div className= "col-sm-10">
                        <div className="card justify-content-center border-light mb-3" style={{"marginTop":"4em","marginBottom":"3em"}}>
                            <div className="card-body">
                                <div className="container-fluid" align="center">
                                    <div className="row justify-content-center" style={{"marginTop":"10px"}}>
                                        <div className="col-sm-12 my-auto" align="center">
                                            <img className="stock-boy-caption" src="noStatements.png" alt="No statements for this company yet"></img>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className= "col-sm-1"></div>
                </div>
            </div>
        )
    }else{
        return (
            <div className="container-fluid" style={{"marginTop":"1em","marginBottom":"3em"}}>
                <div className="row g-1">
                  <div className="container-fluid">
                  <Tab.Container id="left-tabs-example" defaultActiveKey="finances">
                  <Row className="g-2">
                      <Col sm={3}>
                      <Accordion defaultActiveKey="1" flush>
                          <Accordion.Item eventKey="1">
                              <Accordion.Header>Years</Accordion.Header>
                              <Accordion.Body>
                                  <Nav variant="pills" activeKey={this.currentYear} className="flex-column">
                                      {this.yearList.map(this.renderYearAccordion)}
                                      <Nav.Item>
                                          <Nav.Link align="center" eventKey="message" disabled>Can't find a year you're looking for? Check if the company filed under a different name.</Nav.Link>
                                      </Nav.Item>
                                  </Nav>
                              </Accordion.Body>
                          </Accordion.Item>
                          <Accordion.Item eventKey="0">
                            <Accordion.Header>Sources</Accordion.Header>
                                <Accordion.Body>
                                    <Nav variant="pills" className="flex-column">
                                        <Nav.Item>
                                        <Nav.Link onClick={() => this.openURL(this.tenKLink)}>10K</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                        <Nav.Link onClick={() => this.openURL(this.balanceLink)}>Balance Sheet</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                        <Nav.Link onClick={() => this.openURL(this.incomeLink)}>Income Statement</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                        <Nav.Link onClick={() => this.openURL(this.cashLink)}>Cash Flow</Nav.Link>
                                        </Nav.Item>
                                    </Nav>   
                                </Accordion.Body>
                            </Accordion.Item>
                          </Accordion>
                      </Col>
                      <Col sm={9}>
                      <Tab.Content>
                          <Tab.Pane eventKey="finances">
                          <Tabs className="justify-content-center" style={{"marginTop":"10px"}} defaultActiveKey="income_statement" onSelect={this.handleSelect.bind(this)} id="controlled-tab-example">
                              <Tab eventKey={"income_statement"} title="Income Statement" className="navß nav-tabs justify-content-center custom-tab">
                                  <h5 style={{"margin":"10px"}}>
                                  This shows the results of a company's operations over a period of time and can be used to examine a company's earnings.
                                  </h5>
                                  <Table striped bordered hover>
                                      <thead>
                                          <tr>
                                              <th>{this.incomeStatementHeader.key}</th>
                                              <th>{this.incomeStatementHeader.value}</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {this.incomeStatement.map(this.renderRow)}
                                      </tbody>
                                  </Table>
                              </Tab>
                              <Tab eventKey={"balance_sheet"} title="Balance Sheet" className="nav nav-tabs justify-content-center custom-tab">
                                  <h5 style={{"margin":"10px"}}>
                                  This shows a snapshot of a company’s assets and liabilities on a certain date. 
                                  </h5>
                                  <Table striped bordered hover>
                                      <thead>
                                          <tr>
                                              <th>{this.balanceSheetHeader.key}</th>
                                              <th>{this.balanceSheetHeader.value}</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {this.balanceSheet.map(this.renderRow)}
                                      </tbody>
                                  </Table>
                              </Tab>
                              <Tab eventKey={"cash_flow"} title="Cash Flow" className="nav nav-tabs justify-content-center  custom-tab">
                                  <h5 style={{"margin":"10px"}}>
                                  This shows if a company is cash flow negative or positive over a period of time. 
                                  </h5>
                                  <Table striped bordered hover>
                                      <thead>
                                          <tr>
                                              <th>{this.cashFlowHeader.key}</th>
                                              <th>{this.cashFlowHeader.value}</th>
                                          </tr>
                                      </thead>
                                      <tbody>
                                          {this.cashFlow.map(this.renderRow)}
                                      </tbody>
                                  </Table>
                              </Tab>
                          </Tabs>
                          </Tab.Pane>
                          <Tab.Pane eventKey="business">Coming Soon!
                          </Tab.Pane>
                          <Tab.Pane eventKey="risks">Coming Soon!
                          </Tab.Pane>
                      </Tab.Content>
                      </Col>
                  </Row>
                  </Tab.Container>
              </div>
            </div>
        </div>
        )
        }   
    }
}

export default SuperTable;