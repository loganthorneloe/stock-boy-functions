import React, { Component } from "react";
import { Col, Row } from "react-bootstrap";
import Card from 'react-bootstrap/Card'
import './FrontPage.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faCircleRight } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import OverviewBar from "./OverviewBar";

library.add(faSpinner, faCircleRight)

export class FrontPage extends Component {

  renderCompanyCard(func, singleCompanyData){
    return(
      <Card key={singleCompanyData[0]} className="stockCard" onClick={()=>func(singleCompanyData[0])}>
        <Card.Body>
          <Card.Header style={{"marginBottom":"1em"}}><strong>{singleCompanyData[0].split('?')[0].split(':')[0]}</strong>
          </Card.Header>
          <OverviewBar companyDataDict={singleCompanyData[1]["data"]}/>
        </Card.Body>
      </Card>
    );
  }

  render() {
    if(this.props.tenCompaniesList === undefined){
      return (
        <div className="container-fluid" style={{"marginTop":"4em"}}>
          <div className="row justify-content-center">
            <div className= "col-sm-10" align="center">
              <Card className="border-0">
                <Card.Body>
                  <h3 className="roboto title" style={{"marginBottom":".5em"}}><strong>Free, automated fundamental analysis for everyone.</strong></h3>
                  <p>Explore the companies below or search for your own above.</p>
                </Card.Body>
              </Card>
              <div className="content">
                <FontAwesomeIcon icon="fa-solid fa-spinner fa-xl" style ={{color: '#0d6efd',"margin":"2em"}} pulse/>
              </div>
            </div>
          </div>
          
        </div>
      )
    }else{
      return (
        <div className="container-fluid" style={{"marginTop":"3.5em"}}>
          <div className="row justify-content-center">
            <div className= "col-sm-10" align="center">
              <Card className="border-0">
                <Card.Body style={{"marginBottom":"-1.5em"}}>
                  <h3 className="roboto title" style={{"marginBottom":".5em"}}><strong>Free, automated fundamental analysis for everyone.</strong></h3>
                  <p>Explore the companies below or search for one above.</p>
                </Card.Body>
              </Card>
              <Row>
                <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.props.tenCompaniesList.map(this.renderCompanyCard.bind(this, this.props.func))}</Col>
              </Row>
            </div>
          </div>
        </div>
        );
    }
    }
}

export default FrontPage;