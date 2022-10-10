import React, { Component } from "react"
import Card from 'react-bootstrap/Card'
import Button from 'react-bootstrap/Button'
import './BottomPage.css'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPatreon } from '@fortawesome/free-brands-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faO, faX } from "@fortawesome/free-solid-svg-icons";

library.add(faPatreon, faCheck, faX, faO)

export class FrontCards extends Component {

    render() {
      return (
        <div className="container-fluid">
          <Card className="border-0">
            <Card.Body style={{"marginBottom":"-1.5em"}}>
              <h3 className="roboto title" style={{"fontSize":"60px"}}><strong>1,699,680</strong></h3>
              <h5 className="roboto title" style={{"marginBottom":".5em"}}><strong>fundamentals analyzed and counting.</strong></h5>
              <h3>Stock Boy studies the stock market for you.</h3>
              <p style={{"fontSize":"16px"}}>Stock boy searches 24 fundamentals per company to find positive or negative indicators of long-term stock growth. These indicators are scored to determine how likely a company is to have a lasting competitive advantage.*</p>
              <p><strong>Search above or check out the companies below to get started!</strong></p>
            </Card.Body>
          </Card>
        </div>
    );
    }
}

export default FrontCards;