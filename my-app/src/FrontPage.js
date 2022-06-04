import React, { Component } from "react";
import Card from 'react-bootstrap/Card'

export class FrontPage extends Component {

    render() {
      return (
        <div className="container-fluid" style={{"marginTop":"5em"}}>
          <div className="row justify-content-center" style={{"marginTop":"10px"}}>
            <div className="col-sm-12 my-auto" align="center">
              <img className="stock-boy-caption" src="title_boy2.png" alt="Welcome to Stock Boy! Search for companies above to find financial statements."></img>
            </div>
          </div>
          <div className="row justify-content-center" style={{"marginTop":"10px"}}>
            <div className= "col-sm-6" align="center">
              <Card className="border-0">
                <Card.Body>
                  <h4 className="roboto title" style={{"marginBottom":".5em"}}><strong>What is Stock Boy?</strong></h4>
                  <p>Stock Boy automates fundamental analysis for retail investors to make great investing easy! Download Stock Boy as an app to have access to financial statements and fundamentals all from your pocket. <strong>Coming soon:</strong> A new, more useful front page.</p>
                 </Card.Body>
              </Card>
            </div>
          </div>
        </div>
    );
    }
}

export default FrontPage;