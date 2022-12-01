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
    try{
      var percentage = dataDict["analyzed"]["confidence"]
    }catch(error){
      try{
        var red = dataDict["analyzed"]["red"]
        var green = dataDict["analyzed"]["green"]
        var neutral = dataDict["analyzed"]["neutral"]
        var unknown = dataDict["analyzed"]["N/A"]

        var denom = red + neutral + unknown + green
        var numer = (neutral * .5) + green
        percentage = numer/denom
      }catch(error){
        return 'N/A'
      }
      return 'N/A'
    }
    var truncated = Math.trunc(percentage*100)
    if (isNaN(truncated)){
      return 'N/A'
    }
    return truncated + '%'
  }
  isActive = () => {
    console.log(this.props.open)
    if (this.props.open){
      return "0"
    } else {
      return "1"
    }
  }

    render() {
      return (
        <div>
          <div className= "col-sm-2"></div>
          <div className= "top-accordion col-sm-8" align="center">
            <Accordion defaultActiveKey="0" flush>
              <Accordion.Item key="item1" eventKey={this.isActive()}>
                <Accordion.Header>
                  <Col align="center">
                    <Row>
                      <h3><strong>{this.stripCik(this.props.companyDict["company"])}</strong></h3>
                    </Row>
                    <Row>
                      <h5 style={{"fontSize":"30px"}}>score: <strong>{this.format(this.props.companyDict["data"])}</strong></h5>
                    </Row>
                    <Row style={{"marginTop":".5em"}}>
                      <OverviewBar companyDataDict = {this.props.companyDict["data"]}/>
                    </Row>
                    <Row>
                      <div align="center" style={{"marginTop":"1em", "marginBottom":"-.5em"}}><strong>Show details </strong><FontAwesomeIcon icon="fa-solid fa-xl fa-angle-down"/></div>
                    </Row>
                  </Col>
                </Accordion.Header>
                <CustomAccordionBody companyDict={this.props.companyDict}/>
              </Accordion.Item>
            </Accordion>
          </div>
          <div className= "col-sm-2"></div>
        </div>
      );
    }
}

export default CompanyAccordion;