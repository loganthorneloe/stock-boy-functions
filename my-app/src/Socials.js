import React, { Component } from "react";
import { Card, Col } from "react-bootstrap";
import './Socials.css'
import { faTwitter, faYoutube, faInstagram} from '@fortawesome/free-brands-svg-icons'
import { faEnvelope } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

library.add(faTwitter, faYoutube, faInstagram, faEnvelope)

export class Socials extends Component {

  openURL(url){
    if(typeof url !== 'undefined'){
        window.open(url, '_blank');
    }
  }

  render() {
    return (
      <div align="center">
        <Col sm={2}></Col>
        <Col sm={8}>
          <Card style={{"width":"100%","border":"0px"}}>
            <Card.Body>
              <h5 style={{"color":"#0d6efd", "padding":".5em"}}>Never miss an update</h5>
              <FontAwesomeIcon icon="fa-solid fa-envelope" style={{"padding":".25em", "fontSize": "2em"}} onClick={()=>this.openURL("https://www.getrevue.co/profile/theStockBoyApp")}/>
              <FontAwesomeIcon icon="fa-brands fa-youtube" style={{"padding":".25em", "fontSize": "2em"}} onClick={()=>this.openURL("https://www.youtube.com/@StockBoy")}/>
              <FontAwesomeIcon icon="fa-brands fa-twitter" style={{"padding":".25em", "fontSize": "2em"}} onClick={()=>this.openURL("https://twitter.com/theStockBoyApp?ref_src=twsrc%5Etfw")}/>
              <FontAwesomeIcon icon="fa-brands fa-instagram" style={{"padding":".25em", "fontSize": "2em"}} onClick={()=>this.openURL("https://www.instagram.com/stockboy.app/")}/>
            </Card.Body>
          </Card>
        </Col>
        <Col sm={2}></Col>
      </div>
      );
    }
}

export default Socials;