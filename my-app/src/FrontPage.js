import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import Card from 'react-bootstrap/Card'
import './FrontPage.css'

import { faSpinner, faCircleRight } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import OverviewBar from "./OverviewBar";
import FrontCards from "./FrontCards";
import Loading from "./Loading";

library.add(faSpinner, faCircleRight)

export class FrontPage extends Component {

  renderCompanyCard(func, singleCompanyData){
    return(
      <Card key={singleCompanyData[0]} className="stockCard" onClick={()=>func(singleCompanyData[0])}>
        <Card.Body>
          <Card.Header style={{"marginBottom":"1em"}}><strong>{singleCompanyData[0].split("?")[0]}</strong>
          </Card.Header>
          <OverviewBar companyDataDict={singleCompanyData[1]}/>
        </Card.Body>
      </Card>
    );
  }

  render() {
    if(this.props.tenCompaniesList === undefined || this.props.tenCompaniesList.length === 0){
      return (
        <div className="container-fluid"  align="center" style={{"marginTop":"4em"}}>
          <div className= "col-sm-2"></div>
          <div className= "col-sm-8">
            <FrontCards numFundamentals={this.props.numFundamentals}/>
            <h6><strong>Never miss an update.</strong></h6>
            <div className="content" style={{"marginTop":"1em"}}>
              <Loading/>
            </div>
          </div>
          <div className= "col-sm-2"></div>
        </div>
      )
    }else{
      return (
        <div className="container-fluid"  align="center" style={{"marginTop":"3.5em"}}>
          <div className= "col-sm-2"></div>
          <div className= "col-sm-8">
            <FrontCards numFundamentals={this.props.numFundamentals}/>
            <h6 style={{"marginTop":"1em"}}><strong>Some companies to get you started</strong></h6>
            <Row>
              <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.props.tenCompaniesList.map(this.renderCompanyCard.bind(this, this.props.func))}</Col>
            </Row>
          </div>
          <div className= "col-sm-2"></div>
        </div>
        );
    }
    }
}

export default FrontPage;