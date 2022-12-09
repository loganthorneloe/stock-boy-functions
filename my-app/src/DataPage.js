import React, { Component } from "react";
import Col from 'react-bootstrap/Col'

import { faChevronLeft} from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import CompanyAccordion from "./CompanyAccordion";

library.add(faChevronLeft)

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

  renderDataList(companyDict) {
    return(
      <CompanyAccordion companyDict={companyDict}/>
    )
  }

  render() {
    return (
      <div className="container-fluid" style={{"marginTop":"3.5em"}}>
        <div className= "col-sm-2"></div>
        <div className= "col-sm-8">
          <div style={{"textAlign":"left"}} onClick={()=>this.props.reset()}>
            <FontAwesomeIcon icon="fa-solid fa-chevron-left" style={{"paddingRight":".2em", "paddingLeft":".5em"}}/>
            Home
          </div>
          <Col style={{"paddingTop":"0", "paddingBottom":"0"}}>{this.props.companies.reverse().map(this.renderData)}</Col>
        </div>
        <div className= "col-sm-2"></div>
      </div>
    );
  }
}

export default DataPage;