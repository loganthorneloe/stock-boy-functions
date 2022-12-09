import React, { Component } from "react";
import Autocomplete from './Autocomplete';

import { library } from "@fortawesome/fontawesome-svg-core";
import { faCircleQuestion, faHouse } from "@fortawesome/free-solid-svg-icons";

library.add(faCircleQuestion, faHouse)

export class SearchBar extends Component {

    render() {
      return (
        <div className="container-fluid d-flex align-items-center justify-content-center new-nav">
          <form className="form-inline">
            <Autocomplete id="autocomplete" suggestions={this.props.suggestions} func={this.props.func}/>
          </form>
        </div>
      );
    }
}

export default SearchBar;