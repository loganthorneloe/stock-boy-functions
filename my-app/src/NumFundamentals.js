import React, { Component } from "react"
import Loading from "./Loading";

export class NumFundamentals extends Component {

    render() {
      if (this.props.numFundamentals === undefined){
        return(
        <div>
            <Loading/>
        </div>
        );
      }else{
        return (
        <div>
            <h1><strong style={{"fontSize":"45px"}}>{parseFloat(this.props.numFundamentals).toLocaleString()}</strong></h1>
        </div>
        );
      }
    }
}

export default NumFundamentals;