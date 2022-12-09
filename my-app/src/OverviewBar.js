import React, { Component } from "react";
import { Row, Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faO, faX, faBan } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faCheck, faO, faX, faBan)

export class OverviewBar extends Component {

    constructor(props) {
      super(props);
      this.green = ""
      this.red = ""
      this.neutral = ""
      this.n_a = ""

      this.generateColors()
    }

    componentDidUpdate(prevProps) {
      if (prevProps.companyDataDict !== this.props.companyDataDict) {
        this.generateColors()
        this.forceUpdate()
      }
    }

    generateColors(){
      if(typeof this.props.companyDataDict == 'undefined' || this.props.companyDataDict == null || this.props.companyDataDict === "undefined"){
        this.green = ""
        return
      }
      if ("analyzed" in this.props.companyDataDict){
        var analyzed = this.props.companyDataDict["analyzed"]
        this.green = analyzed["green"]
        this.red = analyzed["red"]
        this.neutral = analyzed["neutral"]
        this.n_a = analyzed["N/A"]
      }else{
        this.green = ""
        this.red = ""
        this.neutral = ""
        this.n_a = ""
      }
    }

    render() {
      if(this.green !== ""){
        return (
          <div>
            <Row>
              <Col style ={{color: 'green', "marginTop":".5em", "marginBottom":".5em"}}>
                <FontAwesomeIcon icon="fa-solid fa-check fa-xl" style ={{color: 'green', "marginRight":".5em" }}/>
                {this.green} Positive
              </Col>
              <Col style ={{color: 'red', "marginTop":".5em", "marginBottom":".5em"}}>
                <FontAwesomeIcon icon="fa-solid fa-x fa-xl" style ={{color: 'red', "marginRight":".5em" }}/>
                {this.red} Negative
              </Col>
              <Col style ={{color: 'grey', "marginTop":".5em", "marginBottom":".5em"}}>
              <FontAwesomeIcon icon="fa-solid fa-o fa-xl" style ={{color: 'grey', "marginRight":".5em" }}/>
                {this.neutral} Neutral
              </Col>
              <Col style ={{color: 'black',"marginTop":".5em", "marginBottom":".5em"}}>
                <FontAwesomeIcon icon="fa-solid fa-ban fa-xl" style ={{color: 'black', "marginRight":".5em" }}/>
                {this.n_a} Unknown
              </Col>
            </Row>
          </div>
        );
      }else{
        return (
          <div>
            <Row>
              <Col style ={{color: 'green', "marginTop":".5em", "marginBottom":".5em"}}>
                <FontAwesomeIcon icon="fa-solid fa-check fa-xl" style ={{color: 'green', "marginRight":"1em" }}/>
                ?
              </Col>
              <Col style ={{color: 'red', "marginTop":".5em", "marginBottom":".5em"}}>
                <FontAwesomeIcon icon="fa-solid fa-x fa-xl" style ={{color: 'red', "marginRight":"1em" }}/>
                ?
              </Col>
              <Col style ={{color: 'grey', "marginTop":".5em", "marginBottom":".5em"}}>
              <FontAwesomeIcon icon="fa-solid fa-o fa-xl" style ={{color: 'grey', "marginRight":"1em" }}/>
                ?
              </Col>
              <Col style ={{color: 'black',"marginTop":".5em", "marginBottom":".5em"}}>
                <FontAwesomeIcon icon="fa-solid fa-ban fa-xl" style ={{color: 'black', "marginRight":"1em" }}/>
                ?
              </Col>
            </Row>
          </div>
        );
      }
    }
}

export default OverviewBar;