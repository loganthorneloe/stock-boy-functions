import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import Dropdown from 'react-bootstrap/Dropdown'
import { Tabs, Tab } from 'react-bootstrap';
import DropdownButton from 'react-bootstrap/DropdownButton'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'

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

    renderDropdown = (dropDownYear, index) => {
        return (
            <Dropdown.Item eventKey={dropDownYear} onClick={(e) => this.changeValue(e.target.textContent)}>{dropDownYear}</Dropdown.Item>
        )
     }

    changeValue(text) {
        this.currentYear = text
        this.grabSourceLinks()
        this.generateDisplayColumns()
        this.forceUpdate()
    }
    

    render() {    
    if(typeof this.props.companyDict === "undefined" && typeof this.props.company === "undefined"){
        return (
            <div className="container-fluid">
                <div className="row" style={{"marginTop":"6em"}}>
                    <div className= "col-sm-1"></div>
                    <div className= "col-sm-7">
                        <Card style={{"marginBottom":"1em"}}>
                            <Card.Body>
                                <Card.Title align="center">Welcome to Stock Boy!</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted" align="center">We firmly believe everyone <b>should</b> make money in the stock market.</Card.Subtitle>
                                <Card.Text>
                                Stock Boy puts the foundation of great investments right at your fingertips - easy-to-use financial statements.  
                                <b> All you need to do is search above. </b>
                                All retail investors should have access to and utilize this information when choosing an investment so they can make money in the stock market.
                                </Card.Text>
                                <Card.Text>
                                Stock Boy currently has ~70% of financial statements dating back to 2013. More will be added/updated as time goes on. The information from each financial statement is kept as similar as possible to the original company filing while also making them easier to use.
                                </Card.Text>
                                <Card.Text>
                                The app is brand new so we anticipate growing pains. Follow <a href="https://twitter.com/meetstockboy">Stock Boy on Twitter</a> for future updates and DM with any questions or bugs.
                                </Card.Text>
                                <Card.Text>
                                    <b>Future work:</b>
                                </Card.Text>
                                <ListGroup variant="flush">
                                    <ListGroup.Item>Adding more statements</ListGroup.Item>
                                    <ListGroup.Item>Simplifying statements to make understanding them easier</ListGroup.Item>
                                    <ListGroup.Item>Comparing financial statements across timeframes</ListGroup.Item>
                                    <ListGroup.Item>More!</ListGroup.Item>
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </div>
                    <div className= "col-sm-3">
                        <Card style={{"marginBottom":"1em"}}>
                            <Card.Body>
                                <Card.Title align="center">Support Stock Boy</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted" align="center">Keep Stock Boy <b>free for all</b>.</Card.Subtitle>
                                <Card.Text>
                                The best way to support Stock Boy is by investing in yourself - and you get paid for doing it!
                                </Card.Text>
                                <Card.Text>
                                Use <a href="https://m1.finance/UHVHgaUnLsdA">M1 Finance</a>: a great automated brokerage to invest in your freedom.
                                </Card.Text>
                                <Card.Text>
                                Use <a href="https://blockfi.com/?ref=c06c8f56">BlockFi</a>: a trusted company to securely invest in cryptocurrency.
                                </Card.Text>
                                <Card.Text>
                                Feel free to donate on <a href="https://www.patreon.com/stockboy">Patreon</a> to keep the servers running.
                                </Card.Text>
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
                                            <img src="noStatements.png" height="300px" width= "300px" alt="No statements for this company yet"></img>
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
            <div className="container-fluid">
                <div className="row">
                    <div className= "col-sm-1"></div>
                    <div className= "col-sm-10">
                        <div className="card justify-content-center border-light mb-3" style={{"marginTop":"4em","marginBottom":"3em"}}>
                            <div className="card-body">
                                <div className="container-fluid">
                                    <div className="row justify-content-center" style={{"marginTop":"10px"}}>
                                        <div className="col-sm-8 my-auto" align="center">
                                            <h4 className="card-title"><strong>{this.props.company}</strong></h4>
                                        </div>
                                        <div className="col-sm-4 my-auto" align="center">
                                            <div className="row">
                                                <div className="col my-auto">
                                                    <DropdownButton id="dropdown-basic-button" style={{"display":"inline-block"}} title={this.currentYear}>
                                                        {this.yearList.map(this.renderDropdown)}
                                                    </DropdownButton>
                                                </div>
                                                <div className="col my-auto">
                                                    <button onClick={() => this.openURL(this.tenKLink)} type="button" className="btn btn-outline-primary float-right">10-K</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <Tabs className="justify-content-center" style={{"marginTop":"10px"}} currentkey={this.currentSheet} onSelect={this.handleSelect.bind(this)} id="controlled-tab-example">
                                    <Tab eventKey={"balance_sheet"} title="Balance Sheet" className="nav nav-tabs justify-content-center custom-tab">
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
                                        <div className="row">
                                            <div className="col my-auto">
                                                Source Link for this financial sheet:
                                            </div>
                                            <div className="col my-auto">
                                                <button onClick={() => this.openURL(this.balanceLink)} type="button" className="btn btn-outline-primary float-right">Balance Sheet</button>
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey={"income_statement"} title="Income Statement" className="nav nav-tabs justify-content-center custom-tab">
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
                                        <div className="row">
                                            <div className="col my-auto">
                                                Source Link for this financial sheet:
                                            </div>
                                            <div className="col my-auto">
                                                <button onClick={() => this.openURL(this.incomeLink)} type="button" className="btn btn-outline-primary float-right">Income statement</button>
                                            </div>
                                        </div>
                                    </Tab>
                                    <Tab eventKey={"cash_flow"} title="Cash Flow" className="nav nav-tabs justify-content-center  custom-tab">
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
                                        <div className="row">
                                            <div className="col my-auto">
                                                Source for this financial sheet:
                                            </div>
                                            <div className="col my-auto">
                                                <button onClick={() => this.openURL(this.cashLink)} type="button" className="btn btn-outline-primary float-right">Cash Flow</button>
                                            </div>
                                        </div>
                                    </Tab>
                                </Tabs>
                            </div>
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