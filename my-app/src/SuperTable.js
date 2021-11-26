import './SuperTable.css';
import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown'
import { Tabs, Tab, ButtonGroup } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import Accordion from 'react-bootstrap/Accordion'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'
import { NavDropdown } from 'react-bootstrap';
import Button from '@restart/ui/esm/Button';
import {TwitterFollowButton} from 'react-twitter-embed';

class SuperTable extends Component {
    constructor(props) { // props will be dict for certain stock
      super(props);
      this.tenKLink = ""
      this.balanceLink = ""
      this.incomeLink = ""
      this.cashLink = ""
      this.yearList = []
      this.currentYear = "2021"
      this.simplify = false 
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
            var split_key_array = keys_to_use[i].split('_')
            years_arr.unshift(split_key_array[0])
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
        var key_to_use = ""
        if(!this.simplify){
            key_to_use = this.currentYear + "_complex" 
            
        }else{
            key_to_use = this.currentYear + "_simple"
        }
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
        var key_to_use = ""
        if(!this.simplify){
            key_to_use = this.currentYear + "_complex" 
            
        }else{
            key_to_use = this.currentYear + "_simple"
        }
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
    if(typeof this.props.companyDict === "undefined" && typeof this.props.company === "undefined"){
        return (
            <div className="container-fluid" style={{"marginTop":"5em"}}>
                <div className="row">
                    <div className= "col-sm-4"></div>
                    <div className= "col-sm-4" align="center">
                    <Card className="border-0" style={{"marginBottom":"1em"}}>
                        <Card.Body>
                            <h2 className="roboto title"><strong>Make investing easy.</strong></h2>
                            <Card.Text className="roboto">
                            Stop working for money - make money work for you.
                            </Card.Text>
                            <a class="gumroad-button" href="https://gumroad.com/l/ngaxy">Show me how!</a>
                        </Card.Body>
                    </Card>
                    </div>
                    <div className= "col-sm-4"></div>
                </div>
                <div className="row">
                    <div className= "col-sm-4"></div>
                    <div className= "col-sm-4" align="center">
                    <Card className="border-0" style={{"marginBottom":"1em"}}>
                        <Card.Body>
                            <h2 className="roboto title"><strong>Stay in the know.</strong></h2>
                            <Card.Text className="roboto">
                            The best investing and passive income strategies delivered right to your fingertips.
                            </Card.Text>
                            <form action="https://app.gumroad.com/follow_from_embed_form" class="form gumroad-follow-form-embed" method="post" style={{"marginBottom":"1em"}}> 
                                <input name="seller_id" type="hidden" value="6943259428485"></input>
                                <input name="email" placeholder="Your email address" type="email"></input>
                                <button data-custom-highlight-color="" type="submit">Follow</button> 
                            </form>
                            <a href="https://twitter.com/meetstockboy?ref_src=twsrc%5Etfw" class="twitter-follow-button" data-size="large" data-lang="en" data-show-count="false">Follow @meetstockboy</a><script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>                           
                        </Card.Body>
                    </Card>
                    </div>
                    <div className= "col-sm-4"></div>
                </div>
                <div className="row">
                    <div className= "col-sm-4"></div>
                    <div className= "col-sm-4" align="center">
                    <Card className="border-0" style={{"marginBottom":"1em"}}>
                        <Card.Body>
                            <h2 className="roboto title"><strong>How does this work?</strong></h2>
                            <Card.Text className="roboto">
                            Stock Boy pulls data from the SEC website and makes it easy to read and easy to find. <strong>You just need to search above.</strong> The database contains ~70% of financial statements from 2013 to now with more on the way. Other company data will be added too. Please direct feedback to the Twitter above.
                            </Card.Text>
                        </Card.Body>
                    </Card>
                    </div>
                    <div className= "col-sm-4"></div>
                </div>
                <div className="row">
                    <div className= "col-sm-4"></div>
                    <div className= "col-sm-4" align="center">
                    <Card className="border-0" style={{"marginBottom":"1em"}}>
                        <Card.Body>
                            <h2 className="roboto title"><strong>Invest in yourself.</strong></h2>
                            <Card.Text className="roboto">
                            Use these free accounts to help your money grow &ndash; work-free!
                            </Card.Text>
                            <a href="https://m1.finance/UHVHgaUnLsdA">
                                <img src="m1.png" width="100" height="100" alt="M1 Finance Logo" style={{"margin":"1em"}}></img>
                            </a>
                            <a href="https://blockfi.com/?ref=c06c8f56">
                                <img src="blockfi.png" width="100" height="100" alt="BlockFi Logo" style={{"margin":"1em"}}></img>
                            </a>
                            <a href="https://celsiusnetwork.app.link/1410746914">
                                <img src="celsius.png" width="100" height="100" alt="Celsius Logo" style={{"margin":"1em"}}></img>
                            </a>
                        </Card.Body>
                    </Card>
                    </div>
                    <div className= "col-sm-4"></div>
                </div>
                <div className="row">
                    <div className= "col-sm-4"></div>
                    <div className= "col-sm-4" align="center">
                    <Card className="border-0" style={{"marginBottom":"1em"}}>
                        <Card.Body>
                            <h2 className="roboto title"><strong>Feeling lost?</strong></h2>
                            <Card.Text className="roboto">
                            Start here to learn the basics of financial freedom.
                            </Card.Text>
                            <a class="gumroad-button" href="https://gumroad.com/a/310580339/EvgKt">Financial Freedom Playbook</a>
                        </Card.Body>
                    </Card>
                    </div>
                    <div className= "col-sm-4"></div>
                </div>
                <div className="row">
                    <div className= "col-sm-4"></div>
                    <div className= "col-sm-4" align="center">
                    <Card className="border-0" style={{"marginBottom":"1em"}}>
                        <Card.Body>
                            <h2 className="roboto title"><strong>Invest in Stock Boy.</strong></h2>
                            <Card.Text className="roboto">
                            Patrons keep Stock Boy free.
                            </Card.Text>
                            <a href="https://www.patreon.com/bePatron?u=58846812" data-patreon-widget-type="become-patron-button">Become a Patron!</a>
                        </Card.Body>
                    </Card>
                    </div>
                    <div className= "col-sm-4"></div>
                </div>
                <div className="row">
                    <div className= "col-sm-1"></div>
                    <div className= "col-sm-10" align="center">
                    <Card className="border-0" style={{"marginBottom":"1em"}}>
                        <Card.Body>
                            <font size="2" className="roboto">
                            None of the information on this site is financial advice. Instead Stock Boy enables you to make your own investing decisions. Contains affiliate links. The M1 Finance, BlockFi, and Celsius logos are owned by their respective companies and these companies are in no way affiliated with Stock Boy.
                            </font>
                        </Card.Body>
                    </Card>
                    </div>
                    <div className= "col-sm-1"></div>
                </div>
            </div>
        )
    }else if(typeof this.props.companyDict === "undefined" && typeof this.props.company !== "undefined"){
        return (
            <div className="container-fluid">
                <div className="row">
                    <div className= "col-sm-1"></div>
                    <div className= "col-sm-10">
                        <div className="card justify-content-center border-light mb-3" style={{"marginTop":"4em","marginBottom":"3em"}}>
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="row justify-content-center" style={{"marginTop":"10px"}}>
                                        <div className="col-sm-12 my-auto" align="center">
                                            <h4 className="card-title"><strong>{this.props.company}</strong></h4>
                                        </div>
                                    </div>
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
            <div className="container-fluid" style={{"marginTop":"4em","marginBottom":"3em"}}>
                <div className="row g-2" style={{"marginTop":"20px", "marginBottom":"10px"}}>
                    <div className= "col-sm-1"></div>
                    <div className= "col-sm-10" align="center">
                        <h2 className="card-title"><strong>{this.props.company}</strong></h2>
                    </div>
                    <div className= "col-sm-1"></div>
                </div>
                <div className="row g-1">
                    <div className= "col-sm-1"></div>
                    <div className= "col-sm-10">
                        <div className="container-fluid">
                        <Tab.Container id="left-tabs-example" defaultActiveKey="finances">
                        <Row className="g-2">
                            <Col sm={3}>
                            <Accordion defaultActiveKey="1" flush>
                                <Accordion.Item eventKey="0">
                                    <Accordion.Header>Company Data</Accordion.Header>
                                        <Accordion.Body>
                                            <Nav variant="pills" className="flex-column">
                                                <Nav.Item>
                                                <Nav.Link eventKey="finances">Financial Statements</Nav.Link>
                                                </Nav.Item>
                                                <NavDropdown.Divider />
                                                <Nav.Item>
                                                <Nav.Link eventKey="sources" disabled><strong>Sources</strong></Nav.Link>
                                                </Nav.Item>
                                                <NavDropdown.Divider />
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
                                                <NavDropdown.Divider />
                                                <Nav.Item>
                                                <Nav.Link eventKey="coming_soon" disabled><strong>Coming Soon!</strong></Nav.Link>
                                                </Nav.Item>
                                                <NavDropdown.Divider />
                                                <Nav.Item>
                                                <Nav.Link eventKey="simplified" disabled>Simplified Statements</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                <Nav.Link eventKey="key" disabled>Key Characteristics</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                <Nav.Link eventKey="business" disabled>Business Profile</Nav.Link>
                                                </Nav.Item>
                                                <Nav.Item>
                                                <Nav.Link eventKey="risks" disabled>Risks</Nav.Link>
                                                </Nav.Item>
                                            </Nav>   
                                        </Accordion.Body>
                                    </Accordion.Item>
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
                                </Accordion>
                            </Col>
                            <Col sm={9}>
                            <Tab.Content>
                                <Tab.Pane eventKey="key">
                                <Table striped bordered hover>
                                    <tbody>
                                        <tr>
                                        <td>Market Cap</td>
                                        <td>Coming Soon!</td>
                                        </tr>
                                        <tr>
                                        <td>Second char</td>
                                        <td>Coming Soon!</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                </Tab.Pane>
                                <Tab.Pane eventKey="finances">
                                <Tabs className="justify-content-center" style={{"marginTop":"10px"}} defaultActiveKey="balance_sheet" onSelect={this.handleSelect.bind(this)} id="controlled-tab-example">
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
                    <div className= "col-sm-1"></div>
                </div>
            </div>
        )
        }   
    }
}

export default SuperTable;