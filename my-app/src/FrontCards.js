import React, { Component } from "react"
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import NumFundamentals from "./NumFundamentals";

export class FrontCards extends Component {

    render() {
      if (this.props.numFundamentals === undefined){
        return(
        <div className="container-fluid">
            <Card className="border-0">
              <Card.Body style={{"marginBottom":"-1.5em"}}>
                <Alert variant='primary'>
                  Stock Boy analyzes company financials into something readable by <strong>real people</strong>. Search above or explore below!
                </Alert>
                <h6><strong>Total fundamentals analyzed so far</strong></h6>
                <NumFundamentals numFundamentals={this.props.numFundamentals}/>
              </Card.Body>
            </Card>
          </div>
        );
      }else{
        return (
          <div className="container-fluid">
            <Card className="border-0">
              <Card.Body style={{"marginBottom":"-1.5em"}}>
                <Alert variant='primary'>
                  Stock Boy analyzes company financials into something readable by <strong>real people</strong>. Search above or explore below!
                </Alert>
                <h6><strong>Total fundamentals analyzed so far</strong></h6>
                <NumFundamentals numFundamentals={this.props.numFundamentals}/>
              </Card.Body>
            </Card>
          </div>
        );
      }
    }
}

export default FrontCards;