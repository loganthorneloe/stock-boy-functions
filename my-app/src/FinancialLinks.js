import './SuperTable.css';
import React, { Component } from "react";
import Table from 'react-bootstrap/Table'
import Accordion from 'react-bootstrap/Accordion'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Nav from 'react-bootstrap/Nav'

class FinancialLinks extends Component {
    constructor(props) { // props will be dict for certain stock
      super(props);

      this.yearList1 = []
      this.yearList2 = []

      this.organizeYears()
    }

    componentDidUpdate(prevProps) {
        if (prevProps.company !== this.props.company) {

            this.organizeYears()
            this.forceUpdate()
        }
    }

    organizeYears = () => {
        if(typeof this.props.companyDict == "undefined" || this.props.companyDict == null){
            return
        }

        var years = Object.keys(this.props.companyDict).sort().reverse()

        var years_split = years.length/2
        if (years.length%2 !== 0){
          years_split += .5
        }
        this.yearList1 = years.slice(0, years_split)
        this.yearList2 = years.slice(years_split, years.length)
    }

    openURL = (url) => {
        if(typeof url !== 'undefined'){
            window.open(url, '_blank');
        }
    }

    renderYearRow = (year) => {
        if(typeof this.props.companyDict == "undefined" || this.props.companyDict == null){
          return
        }
        return(
          <Accordion key={year} defaultActiveKey="0" flush style={{"margin":"-10px", "padding":"-10px"}}>
            <Accordion.Item key={year}>
              <Accordion.Header align="center">
                {year}
              </Accordion.Header>
              <Accordion.Body style={{"margin":"-10px", "padding":"-10px"}}>
                <Nav variant="pills" className="flex-column" align="center">
                  <Nav.Item key="key1">
                    <Nav.Link onClick={() => this.openURL(this.props.companyDict[year]["ten_k"])}>10-K</Nav.Link>
                  </Nav.Item>
                  <Nav.Item key="key2">
                    <Nav.Link onClick={() => this.openURL(this.props.companyDict[year]["balance_sheet"])}>Balance Sheet</Nav.Link>
                  </Nav.Item>
                  <Nav.Item key="key3">
                    <Nav.Link onClick={() => this.openURL(this.props.companyDict[year]["income_statement"])}>Income</Nav.Link>
                  </Nav.Item>
                  <Nav.Item key="key4">
                    <Nav.Link onClick={() => this.openURL(this.props.companyDict[year]["cash_flow"])}>Cash Flow</Nav.Link>
                  </Nav.Item>
                </Nav>   
              </Accordion.Body>
            </Accordion.Item> 
          </Accordion>
        )
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
            <div>
              <Table bordered hover>
                  <Row>
                    <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.yearList1.map(this.renderYearRow)}</Col>
                    <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.yearList2.map(this.renderYearRow)}</Col>
                  </Row>
              </Table>
            </div>
        )
        }   
    }
}

export default FinancialLinks;