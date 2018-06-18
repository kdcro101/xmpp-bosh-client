const Jasmine = require('jasmine')
const jasmineInstance = new Jasmine()

jasmineInstance.loadConfigFile('spec/support/jasmine.json')
jasmineInstance.configureDefaultReporter({
    showColors: true
})
jasmineInstance.execute();
