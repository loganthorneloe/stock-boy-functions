import React, { Component } from "react"
import Card from 'react-bootstrap/Card'
import Alert from 'react-bootstrap/Alert'
import NumFundamentals from "./NumFundamentals";
import OverviewLineChart from "./OverviewLineChart";
import Scoreboard from "./Scoreboard";
import Loading from "./Loading"

export class FrontCards extends Component {

    render() {
      if(this.props.tenCompaniesList === undefined){
        return (
          <div>
            <Card className="border-0">
              <Card.Body style={{"marginBottom":"-1.5em"}}>
                <Alert variant='primary'>
                  Stock Boy analyzes company financials into something readable by <strong>real people</strong>. Search above or explore below!
                </Alert>
                <Loading/>
              </Card.Body>
            </Card>
          </div>
        );
      } else {
        return (
          <div>
            <Card className="border-0">
              <Card.Body style={{"marginBottom":"-1.5em"}}>
                <Alert variant='primary'>
                  Stock Boy analyzes company financials into something readable by <strong>real people</strong>. Search above or explore below!
                </Alert>
                <h5 style={{"color":"#0d6efd", "padding":".5em"}}>Total fundamentals analyzed</h5>
                <NumFundamentals numFundamentals={this.props.numFundamentals}/>
                <h5 style={{"color":"#0d6efd", "padding":".5em"}}>Market overview</h5>
                <OverviewLineChart marketOverview={this.props.marketOverview}/>
                <h5 style={{"color":"#0d6efd", "padding":".5em"}}>Current high scores</h5>
                <Scoreboard func={this.props.func} list={this.props.top}/>
                <h5 style={{"color":"#0d6efd", "padding":".5em"}}>Companies worth checking out today</h5>
                <Scoreboard func={this.props.func} list={this.props.tenCompaniesList}/>
              </Card.Body>
            </Card>
          </div>
        );
      }
    }
}

export default FrontCards;