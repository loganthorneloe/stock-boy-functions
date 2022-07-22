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
        <div className="container-fluid" style={{"marginTop":"4em"}}>
          <div className="row justify-content-center">
            <div className= "col-sm-10" align="center">
              <Card className="border-0">
                <Card.Body style={{"marginBottom":"-1.5em"}}>
                  <h3 className="roboto title" style={{"marginBottom":".5em"}}><strong>How do the greatest investors get super rich?</strong></h3>
                  <p>They only buy companies with the best fundamentals. Stock Boy helps you find these companies!</p>
                  <p>
                    <p>Stock Boy scans 24 fundamentals for over 8,000 companies and rates them as follows: </p> 
                    <Card style={{"border":"0px", "marginBottom":"1em"}}>
                      <Card.Body>
                        <Card.Text>
                          <FontAwesomeIcon icon="fa-solid fa-check" size="xl" style ={{color: 'green'}}/> - a factor that indicates growth.
                        </Card.Text>
                        <Card.Text>
                          <FontAwesomeIcon icon="fa-solid fa-x" size="xl" style ={{color: 'red'}}/> - a factor that can hurt growth.
                        </Card.Text>
                        <Card.Text>
                          <FontAwesomeIcon icon="fa-solid fa-o" size="xl" style ={{color: 'grey' }}/> - a factor that is growth-neutral.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <p>Start by searching for a company above or check out a company below.</p>
                  </p>
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
                  <h3 className="roboto title" style={{"marginBottom":".5em"}}><strong>How do the greatest investors get super rich?</strong></h3>
                  <p>They only buy companies with the best fundamentals. Stock Boy helps you find these companies!</p>
                  <p>
                    <p>Stock Boy scans 24 fundamentals for over 8,000 companies and rates them as follows: </p> 
                    <Card style={{"border":"0px", "marginBottom":"1em"}}>
                      <Card.Body>
                        <Card.Text>
                          <FontAwesomeIcon icon="fa-solid fa-check" size="xl" style ={{color: 'green'}}/> - a factor that indicates growth.
                        </Card.Text>
                        <Card.Text>
                          <FontAwesomeIcon icon="fa-solid fa-x" size="xl" style ={{color: 'red'}}/> - a factor that can hurt growth.
                        </Card.Text>
                        <Card.Text>
                          <FontAwesomeIcon icon="fa-solid fa-o" size="xl" style ={{color: 'grey' }}/> - a factor that is growth-neutral.
                        </Card.Text>
                      </Card.Body>
                    </Card>
                    <p>Start by searching for a company above or check out a company below.</p>
                  </p>
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