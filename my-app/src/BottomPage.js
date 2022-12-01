import React, { Component } from "react";
import Card from 'react-bootstrap/Card'

import { faPatreon } from '@fortawesome/free-brands-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faPatreon)

export class FrontPage extends Component {

    render() {
      return (
        <div className="container-fluid">
          <div className="row">
            <div className= "col-sm-1"></div>
            <div className= "col-sm-10" align="center">
            <Card className="border-0" style={{"marginBottom":"1em"}}>
              <Card.Body>
                <font size="1" className="roboto">
                  *The information on this page is not financial advice. Please seek a licensed professional for investment advice. This app may contain affiliate links.
                </font>
              </Card.Body>
            </Card>
            </div>
            <div className= "col-sm-1"></div>
          </div>
        </div>
    );
    }
}

export default FrontPage;