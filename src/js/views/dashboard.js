import $ from 'jquery'
import moment from 'moment'
import CalHeatMap from 'cal-heatmap'

import "az-styles";
import "bootstrap";
import 'cal-heatmap/cal-heatmap.css'

import "../functions.js";

$(document).ready(function () {
	var cal = new CalHeatMap();
	cal.init({
		itemSelector: "#heat-map",
		domain: "month",
		subDomain: "day",
		data: "http://cal-heatmap.com/datas-years.json",
		start: new Date(2000, 0, 5),
		cellSize: 10,
		domainGutter: 20,
		range: 12,
		domainLabelFormat: function(date) {
			moment.lang("en");
			return moment(date).format("MMM");
		},
		legend: [20, 40, 60, 80]
	});
});

