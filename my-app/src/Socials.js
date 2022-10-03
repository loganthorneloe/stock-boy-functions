import React, { Component } from "react";
import { Card, Col, Button } from "react-bootstrap";
import './Socials.css'
import { faTwitter} from '@fortawesome/free-brands-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faTwitter)

export class Socials extends Component {

  render() {
    return (
      <div align="center" style={{"paddingTop":".5em"}}>
        <Col sm={2}></Col>
        <Col sm={8}>
          <Card style={{"width":"100%","border":"0px"}}>
            <Card.Body>
              {/* <h3 className="roboto title" style={{"marginBottom":".5em"}}><strong>Stay up-to-date.</strong></h3>
              <Card.Text>
                Subscribe and follow to never miss a fundamentals update.
              </Card.Text> */}
              {/* <form action="https://www.getrevue.co/profile/theStockBoyApp/add_subscriber" method="post" id="revue-form" name="revue-form"  target="_blank">
                <input className="email-field revue-form-field" placeholder="Email" type="email" name="member[email]" id="member_email"/>
                <Button type="submit" variant="primary" className="email-button" value="Subscribe" name="member[subscribe]" id="member_submit">Subscribe</Button>
              </form> */}
              {/* <div className="revue-form-footer" style={{"fontSize":"10px"}}>By subscribing, you agree with Revue’s <a target="_blank" rel="noreferrer" href="https://www.getrevue.co/terms">Terms of Service</a> and <a target="_blank" rel="noreferrer" href="https://www.getrevue.co/privacy">Privacy Policy</a>.</div> */}
              <script src="https://gumroad.com/js/gumroad.js"></script>
              <Button href="https://stockboy.gumroad.com/l/ngaxy">How do I use this information?</Button>
              {/* <Card.Text style={{"marginTop":"1em"}}>
                <a href="https://twitter.com/theStockBoyApp?ref_src=twsrc%5Etfw" className="twitter-follow-button" data-size="large" data-show-count="false">Follow @theStockBoyApp</a><script async src="https://platform.twitter.com/widgets.js" charSet="utf-8"></script>
              </Card.Text> */}
            </Card.Body>
          </Card>
        </Col>
        <Col sm={2}></Col>
      </div>
      );
    }
}

export default Socials;