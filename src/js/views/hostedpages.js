import $ from 'jquery'
import moment from 'moment'
import ko from 'knockout'

import * as ace from 'brace';
import 'brace/mode/css';
import 'brace/theme/pastel_on_dark';

import "az-styles";
import "bootstrap";

import "../functions.js";

var vm = function() {
    
    var self = this;

    var defaultStyle = 
`.cus-banner {
    background-color: #2C3E50;
}

.cus-body {
    background-color: #EFEFEF;
    padding-top:30px;
}

.cus-headerimage {
    border: 1px solid white;
    border-radius: 50%;
    width: 200px;
    height: 200px;
}

.cus-headertext span {
    color:#EFEFEF;
}`;

    self.style = ko.observable(defaultStyle);
    self.companyName = ko.observable('WeBBQCats');
    self.greating = ko.observable('Hi #{firstname}');
    self.text = ko.observable('On #{submissiondate} you gave the following answers while completing one of our online forms.');
    self.returnUrl = ko.observable('http://localhost:3000/');
    self.imageUrl = ko.observable('https://images.pexels.com/photos/33537/cat-animal-cat-portrait-mackerel.jpg?h=350&auto=compress&cs=tinysrgb');

    self.payload = ko.computed(() => {
        
        var payload = {
            style       : self.style(), 
            companyName : self.companyName(), 
            greating    : self.greating(), 
            text        : self.text(), 
            imageUrl    : self.imageUrl(), 
            returnUrl   : self.returnUrl()
        }

        return JSON.stringify(payload);
    })

    self.encoded = ko.computed(() => {
        return btoa(self.payload());
    });
    
    self.setPreview = () => {
        $('#preview iframe').attr('src', '/submission?preview=' + self.encoded());
    }

    self.tab = (tabName) => {
        switch (tabName) {
            case 'settings':
                $('#preview iframe').hide();
                break;

            case 'preview':
                self.setPreview();
                $('#preview iframe').show();
                break;

            case 'instructions':
                $('#preview iframe').hide();
                break;
        }
    }
};

$(document).ready(function () {
    
    var viewModel = new vm(); 

    ko.applyBindings(viewModel);

    var editor = ace.edit("code-editor");

    editor.getSession().setMode('ace/mode/css');
    editor.setTheme('ace/theme/pastel_on_dark');
    editor.setValue(viewModel.style());
    editor.clearSelection();

    editor.getSession().on('change', function(e) {
        viewModel.style(editor.getValue());
    });
});

