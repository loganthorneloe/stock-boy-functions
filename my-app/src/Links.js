import React, { Component } from "react";
import Button from 'react-bootstrap/Button'
import Row from 'react-bootstrap/Row'
import './BottomPage.css'

import { faPatreon } from '@fortawesome/free-brands-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faPatreon)

export class Links extends Component {

  openURL(url){
    if(typeof url !== 'undefined'){
        window.open(url, '_blank');
    }
  }

  render() {
    return (
      <div className="container-fluid">
        <Row style={{"marginTop":".5em", "marginBottom":".5em"}}>
          <h3>Stay in-the-know.</h3>
          Subscribe to the monthly newsletter to be notified every time a company's fundamentals change.
        </Row>
        <Button className="stockCard" bg="primary" text="white" width=".5em" onClick={()=>this.openURL("https://www.getrevue.co/profile/theStockBoyApp")}>
          Subscribe!
        </Button>
        <Row style={{"marginTop":"1em", "marginBottom":".5em"}}>
          <h3>Learn the fundamentals.</h3>
          Learn how the richest investors read financial statements to find a great company.
        </Row>
        <Button className="stockCard" bg="primary" text="white" width=".5em" onClick={()=>this.openURL("https://stockboy.gumroad.com/l/ngaxy")}>
          Get super rich!
        </Button>
      </div>
  );
  }
}

export default Links;