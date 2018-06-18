"use strict";
var Jasmine = require('jasmine');
var jasmineInstance = new Jasmine();
jasmineInstance.loadConfigFile('spec/support/jasmine.json');
jasmineInstance.configureDefaultReporter({
    showColors: true
});
jasmineInstance.execute();
