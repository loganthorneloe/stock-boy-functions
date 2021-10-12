import React from 'react';
import Table from 'react-bootstrap/Table'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import Dropdown from 'react-bootstrap/Dropdown'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

const TablePage = (props) => {

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
