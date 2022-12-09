import React, { Component } from "react"
import Loading from "./Loading";
import Table from 'react-bootstrap/Table'

export class Scoreboard extends Component {     
  
  renderTableRow (func, tableRow) {
    return (
      <tr onClick={()=>func(tableRow[1])}>
        <td>{tableRow[1].split("?")[0]} ({tableRow[1].split("?")[1]})</td>
        <td align="center">{tableRow[0]}%</td>
      </tr>
    )
  }

  render() {
    if (this.props.list === undefined){
      return(
      <div>
          <Loading/>
      </div>
      );
    }else{
      return (
      <div>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>Company Name</th>
              <th>Confidence</th>
            </tr>
          </thead>
          <tbody>
            {this.props.list.map(this.renderTableRow.bind(this, this.props.func))}
          </tbody>
        </Table>
      </div>
      );
    }
  }
}

export default Scoreboard;