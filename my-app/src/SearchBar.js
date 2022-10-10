import React, { Component } from "react";
import Autocomplete from './Autocomplete';
import { Col } from "react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleQuestion, faHouse } from "@fortawesome/free-solid-svg-icons";

library.add(faCircleQuestion, faHouse)

export class SearchBar extends Component {

    render() {
      return (
        <div className="container-fluid d-flex align-items-center justify-content-center new-nav"> 
          <Col xs={2}></Col>
          <Col xs={1} align="right">
            <FontAwesomeIcon onClick={()=>this.props.reset()} icon="fa-solid fa-house" size="xl" style={{"marginRight":"10px"}}/>
          </Col>
          <form className="form-inline">
            <Autocomplete id="autocomplete" suggestions={this.props.suggestions} func={this.props.func}/>
          </form>
          <Col xs={3}></Col>
        </div>
      );
    }
}

export default SearchBar;