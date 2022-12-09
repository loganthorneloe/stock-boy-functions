import React, { Component } from "react";
import OverviewBar from "./OverviewBar";
import { Accordion } from "react-bootstrap";
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faX, faAngleDown } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CustomAccordionBody from './CustomAccordionBody';
import "./CompanyAccordion.css";

library.add(faX, faAngleDown)

export class CompanyAccordion extends Component {

  stripCik = (nameAndTicker) => {
    var second = nameAndTicker.split(':')
    if (second.length > 1){
      if(second[1].toLowerCase().includes('cik')){
        return second[0]
      }
    }
    return nameAndTicker
  }

  format = (dataDict) => {
    var percentage;
    try{
      percentage = dataDict["analyzed"]["confidence"] // check into confidence
    }catch(error){
      percentage = undefined
    }
    if(percentage === undefined){
      try{
        var red = dataDict["analyzed"]["red"]
        var green = dataDict["analyzed"]["green"]
        var neutral = dataDict["analyzed"]["neutral"]
        var unknown = dataDict["analyzed"]["N/A"]

        var denom = red + neutral + unknown + green
        var numer = (neutral * .5) + green
        percentage = numer/denom
      }catch(error){
        percentage = undefined
      }
    }
    if(percentage === undefined){
      return 'N/A'
    }
    var truncated = Math.trunc(percentage*100)
    if (isNaN(truncated)){
      return 'N/A'
    }
    return truncated + '%'
  }

    render() {
      return (
        <div>
          <div className="top-accordion" align="center">
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item key="item1" eventKey="1">
                <Accordion.Header>
                  <Col align="center">
                    <Row>
                      <h3><strong>{this.stripCik(this.props.companyDict["company"])}</strong></h3>
                    </Row>
                    <Row>
                      <h5 style={{"fontSize":"30px"}}>score: <strong>{this.format(this.props.companyDict["data"])}</strong></h5>
                    </Row>
                    <Row>
                      <OverviewBar companyDataDict = {this.props.companyDict["data"]}/>
                    </Row>
                    <Row>
                      <div align="center" style={{"marginTop":".5em", "marginBottom":"-.5em"}}><strong>Show details </strong><FontAwesomeIcon icon="fa-solid fa-xl fa-angle-down"/></div>
                    </Row>
                  </Col>
                </Accordion.Header>
                <CustomAccordionBody companyDict={this.props.companyDict}/>
              </Accordion.Item>
            </Accordion>
          </div>
        </div>
      );
    }
}

export default CompanyAccordion;