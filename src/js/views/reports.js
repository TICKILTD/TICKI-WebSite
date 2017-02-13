import $ from 'jquery'
import moment from 'moment'
import ko from 'knockout'
import axios from 'axios'

import "az-styles";
import "bootstrap";

import "../functions.js";

var SubmisisionReportLineViewModel = function(clientId, submission) {
    var self = this;

    self.firstName = ko.observable(submission.person.firstName);
    self.lastName = ko.observable(submission.person.lastname);
    self.email = ko.observable(submission.person.email);
    self.accountId = ko.observable(submission.person.externId);
    self.submissionId = ko.observable(submission.token);
    self.clientId = ko.observable(clientId);
    
    self.hostedPageUrl = ko.computed(function() {
        return 'http://localhost:3000/submission?cid=' + self.clientId() + "&sid=" + self.submissionId();
    })
}

var SubmissionsReportViewModel = function(clientId) {
    
    var self = this;

    self.clientId = ko.observable(clientId);
    self.results = ko.observableArray([]);

    self.init = function() {
        axios
            .get('http://localhost:8080/api/tenants/' + self.clientId() + '/submissions')
            .then(function (response) {
                
                for (var submission of response.data) {
                    self.results.push(new SubmisisionReportLineViewModel(self.clientId(), submission));
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    }

    self.init();
}

$(document).ready(function () {
    console.log("initialise with " + user.client_id);
    ko.applyBindings(new SubmissionsReportViewModel(user.client_id), document.getElementById("submissions"));
});
