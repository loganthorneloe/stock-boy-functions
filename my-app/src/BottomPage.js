import React, { Component } from "react";
import Card from 'react-bootstrap/Card'
import { Button } from "react-bootstrap";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPatreon } from '@fortawesome/free-brands-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faPatreon)

export class FrontPage extends Component {

    openURL(url){
      if(typeof url !== 'undefined'){
          window.open(url, '_blank');
      }
    }

    render() {
      return (
        <div className="container-fluid" style={{"marginTop":"1em"}}>
          <div className="row justify-content-center">
            <div className= "col-sm-6" align="center">
              <Card.Body>
                <p style={{"marginTop":"-20px"}}><strong>Stock Boy runs on Patron support!</strong> Become a Patron and help keep Stock Boy free. Plus, you'll receive a monthly email update on which stock fundamentals have changed and access to an Ebook detailing Stock Boy's investment strategy.</p> 
              </Card.Body>
            </div>
          </div>
          <div className="row justify-content-center align-items-center" style={{"marginTop":"-26px"}}>
            <div className= "col-sm-4" align="center">
              <Card.Body>
                <Button style={{backgroundColor:"#f96854", border:"#f96854"}} onClick={() => this.openURL("https://www.patreon.com/bePatron?u=58846812")}>
                  <FontAwesomeIcon icon="fa-brands fa-patreon" /> Become a Patron
                </Button>{' '}
              </Card.Body>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className= "col-sm-6" align="center">
              <Card.Body>
                <p style={{"marginTop":"-10px", "marginBottom":"-10px"}}><strong>Can't become a Patron?</strong> Support us with a follow on Twitter :)</p> 
              </Card.Body>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className= "col-sm-6" align="center">
              <Card.Body>
              <a href="https://twitter.com/meetstockboy?ref_src=twsrc%5Etfw" className="twitter-follow-button" data-size="large" data-show-count="false">Follow @meetstockboy</a><script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>                           
              </Card.Body>
            </div>
          </div>
          <div className="row">
            <div className= "col-sm-1"></div>
            <div className= "col-sm-10" align="center">
            <Card className="border-0" style={{"marginBottom":"1em"}}>
              <Card.Body>
                <font size="2" className="roboto">
                None of the information on this page is financial advice. Please seek a licensed professional for any investment advice. Any investment carries risk. The value of your investment may go up or down. Always do your own research before making an investment. This app contains affiliate links. Trademarks are owned by their respective company.
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