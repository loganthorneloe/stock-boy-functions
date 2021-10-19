import React, { Component, Fragment } from "react";
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { Tabs, Tab } from 'react-bootstrap';
// import { Tabs, Tab } from "@tarragon/swipeable-tabs";
import DropdownButton from 'react-bootstrap/DropdownButton'
import Nav from 'react-bootstrap/Nav'

// const changeTab () => {
//     setSelectedTab(updatedTab.label);
// };

class SuperTable extends Component {
    constructor(props) { // props will be dict for certain stock
      super(props);
    //   this.prevProps = props;
      console.log("updating props for SuperTable")

      this.tenKLink = ""
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
      this.grab10kLink()
      this.generateDisplayColumns()
    }
    //   this.state = {
    //     tenKLink: "",
    //     yearList: [],
    //     currentYear: "",
    //     simplify: false, // default to start on 
    //     balanceSheet: [],
    //     cashFlow: [],
    //     incomeStatement: [],
    //     balanceSheetHeader: {},
    //     cashFlowHeader: {},
    //     incomeStatementHeader: {}
    //   };
    // }

    // functions start here
    // useEffect() {
    //     console.log("use effect for super table!")
    //     if(this.props.company !== ""){
    //         console.log("updating super table")
    //         this.determineYears()
    //         this.grab10kLink()
    //         this.generateDisplayColumns()
    //         this.setStockAndTicker()
    //     }
    // }

    // useEffect = () => {
    //     console.log("use effect for super table!")
    //     if(this.props.company !== ""){
    //         console.log("updating super table")
    //         this.determineYears()
    //         this.grab10kLink()
    //         this.generateDisplayColumns()
    //     }
    // }, [companyname]);

    componentDidUpdate(prevProps) {
        if (prevProps.company !== this.props.company) {
            console.log('something prop has changed.')
            console.log(this.props.company)
            console.log(this.props.companyDict)

            this.determineYears()
            this.grab10kLink()
            this.generateDisplayColumns()
            this.forceUpdate()
        }
    }

    determineYears(){
        if(typeof this.props.companyDict == "undefined" || this.props.companyDict == null){
            return
        }
        // console.log("determing years")
        var keys_to_use = Object.keys(this.props.companyDict)
        var years_arr = []
        for (var i = 0; i < keys_to_use.length; i++){
            var split_key_array = keys_to_use[i].split('_')
            years_arr.push(split_key_array.at(0))
        }
        
        this.yearList = years_arr
        this.currentYear = years_arr.at(-1)
        // console.log('error checking in determine years')
        // console.log(this.yearList)
        // console.log(this.currentYear)
        // this.setState({
        //     yearList: years_arr,
        //     currentYear: years_arr[-1]
        // });
    }

    grab10kLink(){
        if(typeof this.props.companyDict == "undefined" || this.props.companyDict == null){
            return
        }
        // console.log("grabbing 10k link")
        var ten_k_source = ""
        var list_to_use = []
        var key_to_use = ""
        if(!this.simplify){
            key_to_use = this.currentYear + "_complex" 
            
        }else{
            key_to_use = this.currentYear + "_simple"
        }
        list_to_use = this.props.companyDict[key_to_use]
        // console.log('error checking in grab 10k link')
        // console.log(key_to_use)
        // console.log(this.simplify)
        // console.log(this.currentYear)
        // console.log(this.yearList)
        // console.log(this.props.companyDict)
        if(list_to_use.at(-2) === "source"){
            ten_k_source = list_to_use.at(-1)
        }
        this.tenKLink = ten_k_source
        // console.log(this.tenKLink)
        // this.setState({
        //     tenKLink: ten_k_source,
        // });
    }

    generateDisplayColumns(){
        if(typeof this.props.companyDict == "undefined" || this.props.companyDict == null){
            return
        }
        // console.log("generating columns")
        var list_to_use = []
        var key_to_use = ""
        if(!this.simplify){
            key_to_use = this.currentYear + "_complex" 
            
        }else{
            key_to_use = this.currentYear + "_simple"
        }
        list_to_use = this.props.companyDict[key_to_use]
        if(list_to_use.at(-2) === "source"){
            // get rid of the source in the array
            list_to_use.pop()
            list_to_use.pop()
        }

        var income_statement_index = list_to_use.indexOf("income_statement")
        var cash_flow_index = list_to_use.indexOf("cash_flow")

        var balance_sheet_arr = list_to_use.slice(0, income_statement_index)
        var income_statement_arr = list_to_use.slice(income_statement_index, cash_flow_index)
        var cash_flow_arr = list_to_use.slice(cash_flow_index, list_to_use.length)

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
        this.cashFlow = this.createList(income_statement_columns)
        this.incomeStatement = this.createList(cash_flow_columns)
        this.balanceSheetHeader = this.createHeader(balance_sheet_columns)
        this.cashFlowHeader = this.createHeader(cash_flow_columns)
        this.incomeStatementHeader = this.createHeader(income_statement_columns)

        // console.log(this.balanceSheetHeader)
        // console.log(this.cashFlowHeader)
        // console.log(this.incomeStatementHeader)
        // console.log(this.balanceSheet)
        // console.log(this.cashFlow)
        // console.log(this.incomeStatement)
        // this.setState({
        //     balanceSheet: this.createList(balance_sheet_columns),
        //     cashFlow: this.createList(income_statement_columns),
        //     incomeStatement: this.createList(cash_flow_columns),
        //     balanceSheetHeader: this.createHeader(balance_sheet_columns),
        //     cashFlowHeader: this.createHeader(income_statement_columns),
        //     incomeStatementHeader: this.createHeader(cash_flow_columns),
        // })
    }

    renderDropdown(dropDownYear, index) {
        return (
            <Dropdown.Item /*onClick={this.currentYear=dropDownYear}*/ class="dropdown-item">
                {dropDownYear}
            </Dropdown.Item>
        )
    }

    renderRow(new_list_row, index) {
        // console.log(new_list_row)
        if(new_list_row.key.includes("<b>")){
            var replaced = new_list_row.key.replace("<b>","")
            return (
                <tr key={index}>
                    <td><strong>{replaced}</strong></td>
                    <td style={{"text-align":"right"}}>{new_list_row.value}</td>
                </tr>
            )
        }
        return (
            <tr key={index}>
                <td>{new_list_row.key}</td>
                <td style={{"text-align":"right"}}>{new_list_row.value}</td>
            </tr>
        )
    }

    createCommaNumberFromString(str){
        var split_string = str.split(".")
        var arr = split_string[0].split("")
        var counter = 0
        var current_str = ""
        for(var i = arr.length-1; i >= 0; i--){
            if(arr[i] == "."){
                current_str = arr[i] + current_str
            }else{
                current_str = arr[i] + current_str
                counter++;
            }
            if(counter == 3){
                current_str = "," + current_str
                counter = 0
            }
        }
        if(current_str[0] == ','){
            current_str = current_str.slice(1, current_str.length)
        }
        if(current_str.slice(0,2) == '-,'){
            current_str = '-' + current_str.slice(2, current_str.len)
        }

        // add the decimal back onto the end if it existed
        if(split_string.length < 1){
            current_str = current_str + split_string[1]
        }

        return current_str
    }

    createList (columns) {
        var new_list = []
        for (var i = 2; i < columns.one.length; i++) {
            if(typeof columns.one[i] !== 'string'){
                continue // this needs to be checked
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
        // console.log(columns)
        var header = {"key" : columns.one[1], "value" : columns.two[1]}
        return header
    }

    openURL(url){
        if(typeof url !== 'undefined'){
            // console.log('opening window')
            // console.log(this.tenKLink)
            window.open(this.tenKLink, '_blank');
        }
    }

    handleSelect(key) {
        // console.log('selected ' + key);
        this.currentSheet = key
        // console.log(this.currentSheet)
        // this.forceUpdate()
    }

    renderDropdown = (dropDownYear, index) => {
        return (
            <Dropdown.Item href="#/action-{dropDownYear}" class="dropdown-item">
                {dropDownYear}
            </Dropdown.Item>
        )
     }
    

    render() {
        // const {
        //   state: {
        //     tenKLink,
        //     yearList,
        //     currentYear,
        //     simplify,
        //     balanceSheet,
        //     cashFlow,
        //     incomeStatement,
        //     balanceSheetHeader,
        //     cashFlowHeader,
        //     incomeStatementHeader
        //   }
        // } = this;

    console.log("logging before render")
    console.log(this.tenKLink)
    // console.log(this.yearList)
    // console.log(this.currentYear)
    // console.log(this.simplify)
    // console.log(this.balanceSheet)
    // console.log(this.cashFlow)
    // console.log(this.incomeStatement)
    // console.log(this.balanceSheetHeader)
    // console.log(this.cashFlowHeader)
    // console.log(this.incomeStatementHeader)

    console.log(this.currentSheet)
    
    if(typeof this.props.companyDict == "undefined"){
        return (
            <div class="container-fluid">
                <div class="row">
                    <div class= "col-sm-2"></div>
                    <div class= "col-sm-8" align="center">
                        <div class="card justify-content-center border-light mb-3" style={{"margin-top":"10em","margin-bottom":"3em","border":"none"}}>
                            <h1>Easy-to-use financial statements for the everyday investor.</h1>
                            <h2>All you have to do is <strong>search.</strong></h2>
                        </div>
                    </div>
                    <div class= "col-sm-2"></div>
                </div>
            </div>
        )
    }else{
        return (
            <div class="container-fluid">
                <div class="row">
                    <div class= "col-sm-2"></div>
                    <div class= "col-sm-8">
                        <div class="card justify-content-center border-light mb-3" style={{"margin-top":"4em","margin-bottom":"3em"}}>
                            <div class="card-body">
                                <div class="container-fluid">
                                    <div class="row justify-content-center" style={{"margin-top":"10px"}}>
                                        <div class="col-sm-8 my-auto" align="center">
                                            <h4 class="card-title"><strong>{this.props.company}</strong></h4>
                                        </div>
                                        <div class="col-sm-4 my-auto" align="center">
                                            <div class="row">
                                                <div class="col my-auto">
                                                    <DropdownButton id="dropdown-basic-button" style={{"display":"inline-block"}} title={this.props.currentYear}>
                                                        {this.renderDropdownMenu}
                                                    </DropdownButton>
                                                </div>
                                                <div class="col my-auto">
                                                    <button onClick={() => this.openURL(this.tenKLink)} type="button" class="btn btn-outline-primary float-right">10-K</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                {/* <div style={{ height: "300px", width: "100%", border: "1px solid black" }}>
      
                                    <Tabs value={this.currentSheet} onChange={this.handleSelect(this)}>
                                        <Tab label="Tab 1" key={0}>
                                        <div>Tab 1 Content</div>
                                        </Tab>
                                        <Tab label="Tab 2" key={1}>
                                        <div>Tab 2 content</div>
                                        </Tab>
                                        <Tab label="Tab 3" key={2}>
                                        <div>Tab 3 content</div>
                                        </Tab>
                                        <Tab label="Tab 4" key={3}>
                                        <div>Tab 4 content</div>
                                        </Tab>
                                    </Tabs>
                                // onChange -> onSelect, key -> eventKey, label -> title, value -> currentKey
                                </div> */}
                                <Tabs className="justify-content-center" style={{"margin-top":"10px"}} currentKey={this.currentSheet} onSelect={this.handleSelect.bind(this)} id="controlled-tab-example">
                                    <Tab eventKey={"balance_sheet"} title="Balance Sheet" class="nav nav-tabs justify-content-center custom-tab">
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
                                    <Tab eventKey={"income_statement"} title="Income Statement" class="nav nav-tabs justify-content-center custom-tab">
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
                                    <Tab eventKey={"cash_flow"} title="Cash Flow" class="nav nav-tabs justify-content-center  custom-tab">
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
                            </div>
                        </div>
                    </div>
                    <div class= "col-sm-2"></div>
                </div>
            </div>
        )
        }   
    }
}

export default SuperTable;