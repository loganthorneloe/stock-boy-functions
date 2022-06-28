import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSpinner, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'
import { library } from "@fortawesome/fontawesome-svg-core";

library.add(faSpinner, faMagnifyingGlass)

export class Loading extends Component {

    componentDidUpdate(prevProps) {
      if (prevProps.loading !== this.props.loading) {
        this.forceUpdate()
      }
    }

    render() {
      if (this.props.loading){
        return(
          <div>
            <FontAwesomeIcon icon="fa-solid fa-spinner" style ={{color: '#0d6efd'}} pulse/>
          </div>
        );
      }
      else {
        return (
          <div>
          </div>
        );
      }
    }
}

export default Loading;