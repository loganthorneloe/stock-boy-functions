import React, { Component } from "react";
import Spinner from 'react-bootstrap/Spinner';


export class Loading extends Component {

    componentDidUpdate(prevProps) {
      if (prevProps.loading !== this.props.loading) {
        this.forceUpdate()
      }
    }

    render() {
        return(
          <div style={{"marginTop":"2em"}}>
            <Spinner variant="primary" animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        );
    }
}

export default Loading;