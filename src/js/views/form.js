import $ from 'jquery'
import moment from 'moment'

import "az-styles";
import "bootstrap";

import "../functions.js"

import dpa from "dpa-it";

$(document).ready(function () {

	var dpaIt = new dpa('GHYT-32423432-KJHKJHK-123123123-JHG');

	dpaIt.init('#dpa-container', {
		form_group			: "form-group form-group-lg", 
		form_check_label	: "control-label"
	});

	$('#submit').click(function(){

		var submission = {
			customerId	: moment().format('YYYYDDMMHHms'),
			firstName 	: document.getElementById('first-name').value, 
			lastName 	: document.getElementById('last-name').value, 
			email 		: document.getElementById('email').value, 
			mobNumber  	: document.getElementById('mob-tel').value
		};

		dpaIt.save(submission, 
			function(submission_id) {
				console.log("saved submission " + submission_id);
			}
		);
	})
});
