import React, { Component, Fragment } from "react";
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

class SuperTable extends Component {
    constructor(props) { // props will be dict for certain stock
      super(props);
      this.state = {
        tenKLink: "",
        yearList: [],
        currentYear: "",
        simplify: false, // default to start on 
        balanceSheet: [],
        cashFlow: [],
        incomeStatement: [],
        balanceSheetHeader: {},
        cashFlowHeader: {},
        incomeStatementHeader: {}
      };
    }

    // functions start here
    useEffect() {
        console.log("use effect for super table!")
        if(this.props.company !== ""){
            console.log("updating super table")
            this.determineYears()
            this.grab10kLink()
            this.generateDisplayColumns()
            this.setStockAndTicker()
        }
    }

    determineYears(){
        var keys_to_use = Object.keys(this.props.companyDict)
        var years_arr = []
        for(var key in keys_to_use){
            var split_key_array = key.split('_')
            years_arr.push(split_key_array[0])
        }
        this.setState({
            yearList: years_arr,
            currentYear: years_arr[-1]
        });
    }

    grab10kLink() {
        var ten_k_source = ""
        var list_to_use = []
        if(!this.state.simplify){
            list_to_use = this.props.companyDict["complex_" + this.state.currentYear]
        }else{
            list_to_use = this.props.companyDict["simple_" + this.state.currentYear]
        }
        if(list_to_use.at(-2) === "source"){
            // get rid of the source in the array
            ten_k_source = list_to_use.at(-1)
        }
        this.setState({
            tenKLink: ten_k_source,
        });
    }

    generateDisplayColumns(){
        var list_to_use = []
        if(!this.state.simplify){
            list_to_use = this.props.companyDict["complex_" + this.state.currentYear]
        }else{
            list_to_use = this.props.companyDict["simple_" + this.state.currentYear]
        }
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
            two: balance_sheet_arr.slice((balance_sheet_arr.length/2, balance_sheet_arr.length))
        }
        var income_statement_columns = {
            one: income_statement_arr.slice(0, (income_statement_arr.length/2)),
            two: income_statement_arr.slice((income_statement_arr.length/2, income_statement_arr.length))
        }
        var cash_flow_columns = {
            one: cash_flow_arr.slice(0, (cash_flow_arr.length/2)),
            two: cash_flow_arr.slice((cash_flow_arr.length/2, cash_flow_arr.length))
        }

        this.setState({
            balanceSheet: this.createList(balance_sheet_columns),
            cashFlow: this.createList(income_statement_columns),
            incomeStatement: this.createList(cash_flow_columns),
            balanceSheetHeader: this.createHeader(balance_sheet_columns),
            cashFlowHeader: this.createHeader(income_statement_columns),
            incomeStatementHeader: this.createHeader(cash_flow_columns),
        })
    }

    setStockAndTicker() {
        this.setState({
            stockNameAndTicker: this.props.company
        })
    }

    renderDropdown(dropDownYear, index) {
        return (
            <Dropdown.Item onClick={this.setState({currentYear:dropDownYear})} class="dropdown-item">
                {dropDownYear}
            </Dropdown.Item>
        )
    }

    renderRow(new_list_row, index) {
        if(new_list_row.key.includes("<b>")){
            var replaced = new_list_row.key.replace("<b>","")
            return (
                <tr key={index}>
                    <td><strong>{replaced}</strong></td>
                    <td>{new_list_row.value}</td>
                </tr>
            )
        }
        return (
            <tr key={index}>
                <td>{new_list_row.key}</td>
                <td>{new_list_row.value}</td>
            </tr>
        )
    }

    createList (columns) {
        var new_list = []
        for (var i = 1; i < columns.one.length; i++) {
            var new_item = {"key" : columns.one[i], "value" : columns.two[i]}
            new_list.push(new_item)
        }
        return new_list
    }

    createHeader (columns) {
        var header = {"key" : columns.one[0], "value" : columns.two[0]}
        return header
    }

    render() {
        const {
          state: {
            tenKLink,
            yearList,
            currentYear,
            simplify,
            balanceSheet,
            cashFlow,
            incomeStatement,
            balanceSheetHeader,
            cashFlowHeader,
            incomeStatementHeader
          }
        } = this;
    
    if(typeof this.props.company == "undefined"){
        return (
            <Card>
                <h1>No data to display...</h1>
            </Card> 
        )
    }else{
        return (
            <Card>
                <Container>
                    <Row>
                        <Col sm={4}>
                        <Dropdown class="dropdown">
                            <Dropdown.Toggle id="dropdown-button" variant="secondary">
                            {currentYear}
                            </Dropdown.Toggle>
                            <Dropdown.Menu id="dropdown-menu" variant="dark">
                                {yearList.map(this.renderDropdown)}
                            </Dropdown.Menu>
                        </Dropdown>
                        </Col>
                        <Col sm={4}>
                            <h3>{this.props.company}</h3>
                        </Col>
                        <Col sm={4}>
                        <Form.Check 
                            type="switch"
                            label="Simplify Statements"
                            id="disabled-custom-switch"
                            onChange={(checked) => {
                                this.setState({ simplify: checked })
                            }}
                        />
                        </Col>
                    </Row>
                    <ul class="nav nav-tabs justify-content-center" id="myTab" role="tablist">
                        <li class="nav-item" role="presentation">
                            <button class="nav-link active" id="balance-tab" data-bs-toggle="tab" data-bs-target="#balance" type="button" role="tab" aria-controls="balance" aria-selected="true">Balance Sheet</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="income-tab" data-bs-toggle="tab" data-bs-target="#income" type="button" role="tab" aria-controls="income" aria-selected="false">Income Statement</button>
                        </li>
                        <li class="nav-item" role="presentation">
                            <button class="nav-link" id="cash-flow-tab" data-bs-toggle="tab" data-bs-target="#cash-flow" type="button" role="tab" aria-controls="cash-flow" aria-selected="false">Cash Flow</button>
                        </li>
                    </ul>
                    <div class="tab-content" id="myTabContent">
                        <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="balance-tab">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>{balanceSheetHeader.key}</th>
                                        <th>{balanceSheetHeader.value}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {balanceSheet.map(this.renderRow)}
                                </tbody>
                            </Table>
                        </div>
                        <div class="tab-pane fade" id="income" role="tabpanel" aria-labelledby="income-tab">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>{incomeStatementHeader.key}</th>
                                        <th>{incomeStatementHeader.value}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {incomeStatement.map(this.renderRow)}
                                </tbody>
                            </Table>
                        </div>
                        <div class="tab-pane fade" id="cash-flow" role="tabpanel" aria-labelledby="cash-flow-tab">
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>{cashFlowHeader.key}</th>
                                        <th>{cashFlowHeader.value}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {cashFlow.map(this.renderRow)}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <Row>
                        <Col sm={8}>
                        <div>For more info about the company in this year, read the 10-K here:</div>
                        </Col>
                        <Col sm={4}>
                        <button href={tenKLink} type="button" class="btn btn-primary">10-K</button>
                        </Col>
                    </Row>            
                </Container>
            </Card> 
        )
    }
    // return (
    //     <Card>
    //         <Container>
    //             <Row>
    //                 <Col sm={4}>
    //                 <Dropdown class="dropdown">
    //                     <Dropdown.Toggle id="dropdown-button" variant="secondary">
    //                     {currentYear}
    //                     </Dropdown.Toggle>
    //                     <Dropdown.Menu id="dropdown-menu" variant="dark">
    //                         {yearList.map(this.renderDropdown)}
    //                     </Dropdown.Menu>
    //                 </Dropdown>
    //                 </Col>
    //                 <Col sm={4}>
    //                     <h3>{stockNameAndTicker}</h3>
    //                 </Col>
    //                 <Col sm={4}>
    //                 <Form.Check 
    //                     type="switch"
    //                     label="Simplify Statements"
    //                     id="disabled-custom-switch"
    //                     onChange={(checked) => {
    //                         this.setState({ simplify: checked })
    //                     }}
    //                 />
    //                 </Col>
    //             </Row>
    //             <ul class="nav nav-tabs justify-content-center" id="myTab" role="tablist">
    //                 <li class="nav-item" role="presentation">
    //                     <button class="nav-link active" id="balance-tab" data-bs-toggle="tab" data-bs-target="#balance" type="button" role="tab" aria-controls="balance" aria-selected="true">Balance Sheet</button>
    //                 </li>
    //                 <li class="nav-item" role="presentation">
    //                     <button class="nav-link" id="income-tab" data-bs-toggle="tab" data-bs-target="#income" type="button" role="tab" aria-controls="income" aria-selected="false">Income Statement</button>
    //                 </li>
    //                 <li class="nav-item" role="presentation">
    //                     <button class="nav-link" id="cash-flow-tab" data-bs-toggle="tab" data-bs-target="#cash-flow" type="button" role="tab" aria-controls="cash-flow" aria-selected="false">Cash Flow</button>
    //                 </li>
    //             </ul>
    //             <div class="tab-content" id="myTabContent">
    //                 <div class="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="balance-tab">
    //                     <Table striped bordered hover>
    //                         <thead>
    //                             <tr>
    //                                 <th>{balanceSheetHeader.key}</th>
    //                                 <th>{balanceSheetHeader.value}</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody>
    //                             {balanceSheet.map(this.renderRow)}
    //                         </tbody>
    //                     </Table>
    //                 </div>
    //                 <div class="tab-pane fade" id="income" role="tabpanel" aria-labelledby="income-tab">
    //                     <Table striped bordered hover>
    //                         <thead>
    //                             <tr>
    //                                 <th>{incomeStatementHeader.key}</th>
    //                                 <th>{incomeStatementHeader.value}</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody>
    //                             {incomeStatement.map(this.renderRow)}
    //                         </tbody>
    //                     </Table>
    //                 </div>
    //                 <div class="tab-pane fade" id="cash-flow" role="tabpanel" aria-labelledby="cash-flow-tab">
    //                     <Table striped bordered hover>
    //                         <thead>
    //                             <tr>
    //                                 <th>{cashFlowHeader.key}</th>
    //                                 <th>{cashFlowHeader.value}</th>
    //                             </tr>
    //                         </thead>
    //                         <tbody>
    //                             {cashFlow.map(this.renderRow)}
    //                         </tbody>
    //                     </Table>
    //                 </div>
    //             </div>
    //             <Row>
    //                 <Col sm={8}>
    //                 <div>For more info about the company in this year, read the 10-K here:</div>
    //                 </Col>
    //                 <Col sm={4}>
    //                 <button href={tenKLink} type="button" class="btn btn-primary">10-K</button>
    //                 </Col>
    //             </Row>            
    //         </Container>
    //     </Card> 
    // )
    }
}

export default SuperTable;