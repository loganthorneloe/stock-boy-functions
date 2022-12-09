import React, { Component } from "react";
import './FrontPage.css'

import { faSpinner, faCircleRight } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import FrontCards from "./FrontCards";

library.add(faSpinner, faCircleRight)

export class FrontPage extends Component {

  render() {
    return (
      <div align="center" style={{"marginTop":"3.5em"}}>
        <div className= "col-sm-3"></div>
        <div className= "col-sm-6">
          <FrontCards tenCompaniesList={this.props.tenCompaniesList} func={this.props.func} numFundamentals={this.props.numFundamentals} top={this.props.top} marketOverview={this.props.marketOverview}/>
        </div>
        <div className= "col-sm-3"></div>
      </div>
    );
  }
}

export default FrontPage;