import React, { Component, Fragment } from "react";
import axios from 'axios'
import './coronaReport.css'
import CovidStateChart from '../coronaReportGraph/coronaReportStateGraph'

export default class coronaReport extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalStateWiseCase: '',
      totalCityWiseCase: {},
      loader: true
    };
  }

  componentDidMount() {
    axios.all([
      axios.get('/data.json'),
      axios.get('/state_district_wise.json')
    ]).then(axios.spread((stateData, cityWiseData) => {
      this.setState({
        loader: false,
        totalStateWiseCase: stateData.data.statewise,
        totalCityWiseCase: cityWiseData.data
      })
    }));
  }

  showCitiwiseDetails(event) {
    const getClosest = event.currentTarget.closest('.corona-item')
    if (getClosest.classList.contains('show-details')) {
      getClosest.classList.remove('show-details')
    } else {
      getClosest.classList.add('show-details')
    }
  }

  render() {
    const totalCases = this.state.totalStateWiseCase && this.state.totalStateWiseCase.slice(0, 1).map((item, index) => {
      return (
        <div className="total-cases" key={index}>
          <div>
            <p className="active"><span>Active Cases</span>{parseInt(item.active, 10).toLocaleString()}</p> <span>+</span>
            <p className="recovered"><span>Recovered</span>{parseInt(item.recovered, 10).toLocaleString()}<sub className="new-cases">{parseInt(item.deltarecovered, 10).toLocaleString()}</sub></p> <span>+</span>
          </div>
          <div>
            <p className="deceased"><span>Deceased</span>{parseInt(item.deaths, 10).toLocaleString()}<sub className="new-cases">{parseInt(item.deltadeaths, 10).toLocaleString()}</sub></p> <span>=</span>
            <p className="confirmed"><span>Confirmed cases</span>{parseInt(item.confirmed, 10).toLocaleString()}<sub className="new-cases">{parseInt(item.deltaconfirmed, 10).toLocaleString()}</sub></p></div>
          <div className="latest-update">Latest update: {item.lastupdatedtime}</div>
        </div>
      )
    })

    const coronaData = this.state.totalStateWiseCase && this.state.totalStateWiseCase.map((item, index) => {
      const latestConfirmedCases = item.deltaconfirmed
      return (
        <Fragment>
          {item.state === 'Total' || item.state === 'State Unassigned' ? null :
            <div className="corona-item" key={index}>
              <div className="corona-cases-statewise">
                <h2 className="corona-cases-statename" onClick={(e) => this.showCitiwiseDetails(e)}>{item.state}</h2>
                <p className="corona-cases-active">{parseInt(item.active, 10).toLocaleString()}</p>
                <p className="corona-cases-confirmed">{parseInt(item.confirmed, 10).toLocaleString()} {item.deltaconfirmed > 0 ? <sub className="new-cases">{parseInt(item.deltaconfirmed, 10).toLocaleString()}</sub> : ''}</p>
                <p className="corona-cases-recovered">{parseInt(item.recovered, 10).toLocaleString()}{item.deltarecovered > 0 ? <sub className="new-cases">{parseInt(item.deltarecovered, 10).toLocaleString()}</sub> : ''}</p>
                <p className="corona-cases-deceased">{parseInt(item.deaths, 10).toLocaleString()} {item.deltadeaths > 0 ? <sub className="new-cases">{item.deltadeaths}</sub> : ''}</p>
                <p className="show-citiwise-list" onClick={(e) => this.showCitiwiseDetails(e)}></p>
              </div>
              {Object.values(this.state.totalCityWiseCase).map((itemdata, index) => {
                return (
                  <React.Fragment key={index}>
                    {item.statecode === itemdata.statecode ?
                      <div className="corona-cases-citywise-list">
                        <div className="corona-cases-citywise">
                          <p className="corona-cases-cityname">City</p>
                          {latestConfirmedCases > 0 ? <p className="corona-cases-confirmed">Positives <br />last 24 Hrs</p> : ''}
                          <p className="corona-cases-active">Active</p>
                          <p className="corona-cases-confirmed">Confirmed</p>
                          <p className="corona-cases-recovered">Recovered</p>
                          <p className="corona-cases-deceased">Deceased</p>
                        </div>
                        {Object.entries(itemdata.districtData).map((state, index) => {
                          // console.log(state[1], 'state[1]');
                          return (
                            <div className="corona-cases-citywise" key={index}>
                              <p className="corona-cases-cityname">{state[0]}</p>
                              {latestConfirmedCases > 0 ? state[1].delta.confirmed > 0 ?
                                <p className="corona-cases-confirmed-last">{state[1].delta.confirmed.toLocaleString()}</p> : <p></p> : ''}
                              <p className="corona-cases-confirmed">{state[1].active.toLocaleString()}</p>
                              <p className="corona-cases-confirmed">{state[1].confirmed.toLocaleString()}</p>
                              <p className="corona-cases-recovered">{state[1].recovered.toLocaleString()}</p>
                              <p className="corona-cases-deceased">{state[1].deceased.toLocaleString()}</p>
                            </div>
                          )
                        })}
                      </div>
                      : ''}
                  </React.Fragment>
                )
              })}
            </div>
          }
        </Fragment>
      )
    })

    return (
      this.state.loader ?
        <div className="loader">
          <p> Loading Covid19 webapp....</p>
          <div className="rect1"></div>
          <div className="rect2"></div>
          <div className="rect3"></div>
          <div className="rect4"></div>
          <div className="rect5"></div>
        </div> :
        <React.Fragment>
          <div className="corona-wrapper" >
            <div className="corona-container">
              <h1>COVID19 Stats in India</h1>
              {totalCases}
              <CovidStateChart />
              <div className="corona-items-list">
                <div className="corona-item corona-items-heading">
                  <div className="corona-cases-statewise">
                    <h2>State</h2>
                    <p className="corona-cases-active">Active</p>
                    <p className="corona-cases-confirmed">Confirmed</p>
                    <p className="corona-cases-recovered">Recovered</p>
                    <p className="corona-cases-deceased">Deceased</p>
                  </div>
                </div>
                {coronaData}
              </div>
            </div>
          </div>
          <footer>
            <span className="author"><a href="https://voletiswaroop.github.io/">&copy; Swaroop Gupta Voleti</a></span>
            <span className="source"><a href="https://www.covid19india.org/" target="_blank">Source</a></span>
          </footer>
        </React.Fragment >
    )
  }
}
