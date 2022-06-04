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
      if (prevProps.company !== this.props.company) {

          this.generateColors()
          this.forceUpdate()
      }
    }

    generateColors(){
      if(typeof this.props.companyDict == "undefined" || this.props.companyDict == null){
        return
      }
      if ("analyzed" in this.props.companyDict){
        var analyzed = this.props.companyDict["analyzed"]
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
              <Col lg="4"></Col>
              <Col>
                <FontAwesomeIcon icon="fa-solid fa-check fa-xl" style ={{color: 'green', "marginRight":"1em" }}/>
                {this.green}
              </Col>
              <Col>
                <FontAwesomeIcon icon="fa-solid fa-x fa-xl" style ={{color: 'red', "marginRight":"1em" }}/>
                {this.red}
              </Col>
              <Col>
              <FontAwesomeIcon icon="fa-solid fa-o fa-xl" style ={{color: 'grey', "marginRight":"1em" }}/>
                {this.neutral}
              </Col>
              <Col>
                <FontAwesomeIcon icon="fa-solid fa-ban fa-xl" style ={{color: 'black', "marginRight":"1em" }}/>
                {this.n_a}
              </Col>
              <Col lg="4"></Col>
            </Row>
          </div>
        );
      }else{
        return (
          <div>
            <Row>
              <Col>
                <FontAwesomeIcon icon="fa-solid fa-check fa-xl" style ={{color: 'green', "marginRight":"1em" }}/>
                ?
              </Col>
              <Col>
                <FontAwesomeIcon icon="fa-solid fa-x fa-xl" style ={{color: 'red', "marginRight":"1em" }}/>
                ?
              </Col>
              <Col>
              <FontAwesomeIcon icon="fa-solid fa-o fa-xl" style ={{color: 'grey', "marginRight":"1em" }}/>
                ?
              </Col>
              <Col>
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