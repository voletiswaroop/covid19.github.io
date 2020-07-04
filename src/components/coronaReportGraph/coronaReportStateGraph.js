import React, { Component } from 'react';
import CanvasJSReact from './canvasjs.react';
import axios from 'axios'
import logo from './logo.png'

let CanvasJSChart = CanvasJSReact.CanvasJSChart;

export default class coronaReportStateGraph extends Component {
	constructor() {
		super();
		this.state = {
			totalDayWiseCase: '',
			totalStateWiseCase: '',
			totalTested: ''
		};
		this.toggleDataSeries = this.toggleDataSeries.bind(this);
	}

	toggleDataSeries(e) {
		if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
			e.dataSeries.visible = false;
		}
		else {
			e.dataSeries.visible = true;
		}
		this.chart.render();
	}
	componentDidMount() {
		axios.get('https://api.covid19india.org/data.json').then(stateData => {
			this.setState({
				totalDayWiseCase: stateData.data.cases_time_series,
				totalStateWiseCase: stateData.data.statewise,
				totalTested: stateData.data.tested
			})
		})
	}

	render() {
		let dataPointsStateActive = [], dataPointsStateRecovered = [], dataPointsStateDeceased = [], dayWiseConfirm = [], dayWiseRecovered = [], dayWiseDeceased = [], totalTestedCases, testCasesLength = this.state.totalTested.length - 1
		let percentageCases = this.state.totalStateWiseCase && this.state.totalStateWiseCase.slice(0, 1).map((item, index) => {
			return (
				<div className="total-percenage-cases" key={index}>
					<p className="deceased">Deceased: {Number((item.deaths / item.confirmed) * 100).toFixed(2) + '%'}</p>
					<p className="recovered">Recovered: {Number((item.recovered / item.confirmed) * 100).toFixed(2) + '%'}</p>
					<p className="active">Active: {Number((item.active / item.confirmed) * 100).toFixed(2) + '%'}</p>
				</div>
			)
		})
		this.state.totalStateWiseCase && this.state.totalStateWiseCase.slice(1, 16).map(itemdata => {
			dataPointsStateActive.push({
				y: parseInt(itemdata.confirmed),
				label: itemdata.state
			})
			dataPointsStateRecovered.push({
				y: parseInt(itemdata.recovered),
				label: itemdata.state
			})
			dataPointsStateDeceased.push({
				y: parseInt(itemdata.deaths),
				label: itemdata.state
			})
		})
		this.state.totalDayWiseCase && this.state.totalDayWiseCase.slice(60).map(item => {
			dayWiseConfirm.push({
				y: parseInt(item.dailyconfirmed),
				label: item.date
			})
			dayWiseRecovered.push({
				y: parseInt(item.dailyrecovered),
				label: item.date
			})
			dayWiseDeceased.push({
				y: parseInt(item.dailydeceased),
				label: item.date
			})
		})
		totalTestedCases = this.state.totalTested && this.state.totalTested.slice(testCasesLength).map((item, index) => {
			return (<a href={item.source} title="source" target="_blank" className="total-test-cases" key={index}>Total test cases: {item.totalsamplestested}</a>)
		})
		const options = {
			animationEnabled: true,
			colorSet: "colorSet2",
			title: {
				text: "Top 15 COVID19 States",
				fontFamily: "GothamHTF"
			},
			toolTip: {
				shared: true
			},
			legend: {
				cursor: "pointer",
				itemclick: this.toggleDataSeries,
				verticalAlign: "top",
				fontFamily: "GothamHTF"
			},
			data: [{
				type: "spline",
				name: "Confirmed cases",
				showInLegend: true,
				yValueFormatString: "##0",
				fontFamily: "GothamHTF",
				dataPoints: dataPointsStateActive
			}, {
				type: "spline",
				name: "Recovered",
				showInLegend: true,
				yValueFormatString: "###0",
				fontFamily: "GothamHTF",
				dataPoints: dataPointsStateRecovered
			}, {
				type: "splineArea",
				name: "Deceased",
				markerBorderColor: "white",
				markerBorderThickness: 2,
				yValueFormatString: "###0",
				fontFamily: "GothamHTF",
				showInLegend: true,
				dataPoints: dataPointsStateDeceased
			}]
		}
		const confirmCases = {
			animationEnabled: true,
			title: {
				text: "Confirmed cases",
				fontFamily: "GothamHTF"
			},
			legend: {
				verticalAlign: "top",
				fontFamily: "GothamHTF"
			},
			data: [{
				type: "column",
				name: "Confirmed cases",
				showInLegend: true,
				dataPoints: dayWiseConfirm
			}]
		}
		const recoveredCases = {
			animationEnabled: true,
			title: {
				text: "Recovered cases",
				fontFamily: "GothamHTF"
			},
			legend: {
				verticalAlign: "top",
				fontFamily: "GothamHTF"
			},
			data: [{
				type: "spline",
				name: "Recovered cases",
				showInLegend: true,
				dataPoints: dayWiseRecovered
			}]
		}
		const deceasedCases = {
			animationEnabled: true,
			title: {
				text: "Deceased cases",
				fontFamily: "GothamHTF"
			},
			legend: {
				verticalAlign: "top",
				fontFamily: "GothamHTF"
			},
			data: [{
				type: "spline",
				name: "Deceased",
				markerBorderColor: "white",
				markerBorderThickness: 2,
				showInLegend: true,
				dataPoints: dayWiseDeceased
			}]
		}

		return (
			<React.Fragment>
				<header>
					<a href="https://voletiswaroop.github.io/"><img src={logo} alt="Swaroop gupta voleti" /></a>
					<div className="right-section">
						{totalTestedCases}
						{percentageCases}
					</div>
				</header>
				<div className="corona-graph">
					<CanvasJSChart options={options}
						onRef={ref => this.chart = ref}
					/>
					<CanvasJSChart options={confirmCases}
						onRef={ref => this.chart = ref}
					/>
					<CanvasJSChart options={recoveredCases}
						onRef={ref => this.chart = ref}
					/>
					<CanvasJSChart options={deceasedCases}
						onRef={ref => this.chart = ref}
					/>
				</div >
			</React.Fragment >
		);
	}
}
