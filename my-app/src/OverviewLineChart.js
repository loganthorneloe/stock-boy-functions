import React, { Component } from "react"
import Loading from "./Loading";
import { Line } from "react-chartjs-2"
import Card from 'react-bootstrap/Card'
import "./OverviewLineChart.css"

export class OverviewLineChart extends Component {

  renderChart(dict){
    const options = {
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        y: {
          title: {
            display: true,
            text: '# of companies'
          },
          ticks: {
            callback: v => `${v/1000}K`
          },
        },
        x: {
          title: {
            display: true,
            text: '% confidence in competitive advantage'
          }
        }
      }
    }
    
    var labels = Object.keys(dict);
    
    const data = {
      labels,
      datasets: [
        {
          label: "US Companies",
          data: Object.values(dict),
          borderColor: '#0d6efd',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        }
      ],
    }

    return (
      <Line options={options} data={data} />
    )
  };

  render() {
    if (this.props.marketOverview === undefined){
      return(
      <div>
          <Loading/>
      </div>
      );
    }else{
      return (
      <div>
        <Card className="chart" style={{"border":"0px"}}>
          {this.renderChart(this.props.marketOverview)}
        </Card>
      </div>
      );
    }
  }
}

export default OverviewLineChart;