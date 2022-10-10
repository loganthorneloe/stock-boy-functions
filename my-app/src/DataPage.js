import React, { Component } from "react";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

import { faCheck, faO, faX, faBan, faCircleQuestion, faChartLine, faSackDollar } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import CompanyAccordion from "./CompanyAccordion";

library.add(faCheck, faO, faX, faBan, faCircleQuestion, faChartLine, faSackDollar)

export class DataPage extends Component {

  openURL = (url) => {
    if(typeof url !== 'undefined'){
        window.open(url, '_blank');
    }
  }

  renderData(companyDict) {
    return(
      <CompanyAccordion companyDict={companyDict}/>
    )
  }

  render() {
    if (this.props.companies.length === 1){
      return (
        <div className="container-fluid" style={{"marginTop":"4.5em","marginBottom":".5em"}}>
          <div className= "col-sm-2"></div>
          <div className= "col-sm-8">
            <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.renderData(this.props.companies[this.props.companies.length-1])}</Col>
            <Row className="justify-content-md-center">
              <font size="2" className="roboto" style={{"marginTop":"1em"}}>
                As you search more stocks, we'll show up to 9 recent searches here to compare fundamentals!
              </font>
            </Row>
          </div>
          <div className= "col-sm-2"></div>
        </div>
      );
    } else {
      return (
        <div className="container-fluid" style={{"marginTop":"4.5em","marginBottom":".5em"}}>
          <div className= "col-sm-2"></div>
          <div className= "col-sm-8"> 
            <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.renderData(this.props.companies[this.props.companies.length-1])}</Col>
            <Row className="justify-content-md-center">
              <h2 style={{"marginTop":"1em","fontSize":"20px"}} align="center">Recents</h2>
            </Row>
            <Row className="justify-content-md-center">
              <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.props.companies.slice(0,this.props.companies.length-1).reverse().map(this.renderData)}</Col>
            </Row>
            </div>
            <div className= "col-sm-2"></div>
        </div>
      );
    }
  }
}

export default DataPage;