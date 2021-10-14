import React from 'react';
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'


const TablePage = (props) => {

// var new_dict = props;
// var current_year = '2021' // this should be dict.last by default
// var type_of_sheet = 'complex'
// var new_dict_key = current_year + '_' + type_of_sheet
// var list_to_use = new_dict[new_dict_key]

// function manipulateArray(){
//     if(list_to_use.at(-2) === "source"){
//         // get rid of the source in the array
//         var ten_k_source = list_to_use.at(-1)
//         list_to_use.pop()
//         list_to_use.pop()
//     }
//     var balance_sheet_index = list_to_use.indexOf("balance_sheet")
//     var income_statement_index = list_to_use.indexOf("income_statement")
//     var cash_flow_index = list_to_use.indexOf("cash_flow")

//     var balance_sheet_arr = list_to_use.slice(0, income_statement_index)
//     var income_statement_arr = list_to_use.slice(income_statement_index, cash_flow_index)
//     var cash_flow_arr = list_to_use.slice(cash_flow_index, list_to_use.length)

//     var balance_sheet_columns = {
//         one: balance_sheet_arr.slice(0, (balance_sheet_arr.length/2)),
//         two: balance_sheet_arr.slice((balance_sheet_arr.length/2, balance_sheet_arr.length))
//     }
//     var income_statement_columns = {
//         one: income_statement_arr.slice(0, (income_statement_arr.length/2)),
//         two: income_statement_arr.slice((income_statement_arr.length/2, income_statement_arr.length))
//     }
//     var cash_flow_columns = {
//         one: cash_flow_arr.slice(0, (cash_flow_arr.length/2)),
//         two: cash_flow_arr.slice((cash_flow_arr.length/2, cash_flow_arr.length))
//     }

//     return balance_sheet_columns, income_statement_columns, cash_flow_columns
// }

// function determinePossibleYears(){
//     var keys_to_use = Object.keys(new_dict)
//     var years_arr = []
//     for(var key in keys_to_use){
//         var split_key_array = key.split('_')
//         years_arr.push(split_key_array[0])
//     }
//     return [...new Set(years_arr)];
// }

function renderRow(new_list_row, index) {
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

function renderDropdown(current_years, index) {
    return (
        <Dropdown.Item class="dropdown-item">{current_years}</Dropdown.Item>
    )
}

function createList (columns) {
    var new_list = []
    for (var i = 1; i < columns.one.length; i++) {
        var new_item = {"key" : columns.one[i], "value" : columns.two[i]}
        new_list.push(new_item)
    }
    return new_list
}

function createHeaders(columns){
    var headers = {"key" : columns.one[0], "value" : columns.two[0]}
    return headers
}

const columns = {
    one: [
        "Header",
        "<b>second",
        "third"
    ],
    two: [
        "Header",
        "second_two",
        "third_two"
    ]
}

// var years = determinePossibleYears()
// var balance_sheet_columns, income_statement_columns, cash_flow_columns = manipulateArray()

const years = [
    "2021",
    "2020",
    "2019"
]

var $ = function( id ) { return document.getElementById( id ); };

var k_url = "www.google.com"
var selectedYear = "2021"
var headers = createHeaders(columns);
var display_list = createList(columns);

const players = [
        {position: "Foward", name: "Lebron"},
        {position: "Guard", name: "Harden"}
    ]

return (
    <Card>
        <Container>
            <Row>
                <Col sm={8}>
                <Dropdown class="dropdown">
                    <Dropdown.Toggle id="dropdown-button" variant="secondary">
                    {selectedYear}
                    </Dropdown.Toggle>
                    <Dropdown.Menu id="dropdown-menu" variant="dark">
                        {years.map(renderDropdown)}
                    </Dropdown.Menu>
                </Dropdown>
                </Col>
                <Col sm={4}>
                <Form.Check 
                    disabled
                    type="switch"
                    label="Simplify Statements"
                    id="disabled-custom-switch"
                />
                </Col>
            </Row>
            <ul class="nav nav-tabs">
                <li class="nav-item">
                    <a class="nav-link active" href="#">Balance Sheet</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Income Statement</a>
                </li>
                <li class="nav-item">
                    <a class="nav-link" href="#">Cash Flow Statement</a>
                </li>
            </ul>
            <Row>
                <Col sm={12}>
                
                </Col>
            </Row>
        </Container>
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>{headers.key}</th>
                    <th>{headers.value}</th>
                </tr>
            </thead>
            <tbody>
                {display_list.map(renderRow)}
            </tbody>
        </Table>
        <Container>
            <Row>
                <Col sm={8}>
                <div>For more info about the company in this year, read the 10-K here:</div>
                </Col>
                <Col sm={4}>
                <button type="button" class="btn btn-primary">10-K</button>
                </Col>
            </Row>            
        </Container>
    </Card>
    
)
};

export default TablePage;
