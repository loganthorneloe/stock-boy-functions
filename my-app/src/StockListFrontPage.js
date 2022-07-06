import React, { Component } from "react";
import { Button } from "react-bootstrap";
import Card from 'react-bootstrap/Card'
import './FrontPage.css'

export class StockListFrontPage extends Component {

  

  render() {
    if(this.props.loading){
      return(
        <div>
          <div className="content">
            <FontAwesomeIcon icon="fa-solid fa-spinner fa-xl" style ={{color: '#0d6efd',"marginTop":"5em","marginBottom":"2em"}} pulse/>
          </div>
        </div>
      );
    }else{
      <div className="row justify-content-center">
          <div className= "col-sm-6" align="center">
          </div>
        </div>
    }
  }
}

export default StockListFrontPage;