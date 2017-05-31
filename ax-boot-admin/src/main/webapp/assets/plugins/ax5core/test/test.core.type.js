describe('ax5.util.getType TEST', function() {
    var testCases = [
        {
            args: [ 1 ],
            expect: 'number'
        },
        {
            args: [ '1' ],
            expect: 'string'
        },
        {
            args: [ [0, 1, 2] ],
            expect: 'array'
        },
        {
            args: [ {a: 1} ],
            expect: 'object'
        },
        {
            args: [ function(){} ],
            expect: 'function'
        },
        {
            args: [ document.querySelectorAll("div") ],
            expect: 'nodelist'
        },
        {
            args: [ document.querySelector("body") ],
            expect: 'element'
        },
        {
            args: [ document.createDocumentFragment() ],
            expect: 'fragment'
        },
        {
            args: [ null ],
            expect: 'null'
        },
        {
            args: [ undefined ],
            expect: 'undefined'
        },
        {
            args: [ window ],
            expect: 'window'
        }
    ];

    testCases.forEach(function(testCase){
        it('ax5.util.getType(' + testCase.expect + ') expect ' + testCase.expect, function() {
            var actual = ax5.util.getType.apply(this, testCase.args);

            should.equal(actual, testCase.expect);
        });
    });

});


describe('ax5.util.is{Type}', function() {
    var getTypes = function(typeNames, isExclude) {
        var types = [
            { name: 'Window', value: window },
            { name: 'DOMElement', value: document.createElement('div') },
            { name: 'Object', value: {} },
            { name: 'Array', value: [] },
            { name: 'Function', value: new Function() },
            { name: 'String', value: 'ax5ui' },
            { name: 'Number', value: 5 },
            { name: 'DOMNodelist', value: document.querySelectorAll('.content') },
            { name: 'undefined', value: undefined },
            { name: 'Null', value: null },
            { name: 'EmptyString', value: '' },
            { name: 'Date', value: new Date() }
        ];

        var matchedTypes = _.map(typeNames, function(typeName){
            return _.find(types, { 'name': typeName });
        });

        if (isExclude === true) {
            return _.reject(types, function(type){
                return _.findIndex(matchedTypes, { 'name': type.name }) > -1;
            });
        } else {
            return matchedTypes;
        }
    }

    var getTestCases = function(typeNames){
        var testCases = [];
        var trueExpectedTypes = getTypes(typeNames);
        var falseExpectedTypes = getTypes(typeNames, true);

        _.each(trueExpectedTypes, function(type){
            testCases.push({
                args: [ type ],
                expect: true
            });
        });

        _.each(falseExpectedTypes, function(type){
            testCases.push({
                args: [ type ],
                expect: false
            });
        });

        return testCases;
    }

    var testTargets = [
        {
            testMethod: 'isWindow',
            testCases: getTestCases(['Window'])
        },
        {
            testMethod: 'isElement',
            testCases: getTestCases(['DOMElement'])
        },
        {
            testMethod: 'isObject',
            testCases: getTestCases(['Object'])
        },
        {
            testMethod: 'isArray',
            testCases: getTestCases(['Array'])
        },
        {
            testMethod: 'isFunction',
            testCases: getTestCases(['Function'])
        },
        {
            testMethod: 'isString',
            testCases: getTestCases(['String', 'EmptyString'])
        },
        {
            testMethod: 'isNumber',
            testCases: getTestCases(['Number'])
        },
        {
            testMethod: 'isNodelist',
            testCases: getTestCases(['DOMNodelist'])
        },
        {
            testMethod: 'isUndefined',
            testCases: getTestCases(['undefined'])
        },
        {
            testMethod: 'isNothing',
            testCases: getTestCases(['undefined', 'Null', 'EmptyString'])
        },
        {
            testMethod: 'isDate',
            testCases: getTestCases(['Date'])
        }
    ];

    _.each(testTargets, function(testTarget){
        describe('ax5.util.' + testTarget.testMethod + ' TEST', function() {
            _.each(testTarget.testCases, function(testCase){
                _.each(testCase.args, function(args){
                    it('ax5.util.' + testTarget.testMethod + '(' + args.name + ') expect ' + testCase.expect, function() {
                        var actual = ax5.util[testTarget.testMethod].call(this, args.value);

                        should.equal(actual, testCase.expect);
                    });
                });
            });
        });
    });
});


describe('ax5.util.isDateFormat TEST', function() {
    var testCases = [
        {
            args: [ '20160101' ],
            expect: true
        },
        {
            args: [ '2016-01-01' ],
            expect: true
        },
        {
            args: [ '2016/01/01' ],
            expect: true
        },
        {
            args: [ '2016*01*01' ],
            expect: true
        },
        {
            args: [ '01/01/2016' ],
            expect: true
        },
        {
            args: [ '2016010' ],
            expect: false
        },
        {
            args: [ '201601011200' ],
            expect: true
        },
        {
            args: [ '2016-01-01T12:00' ],
            expect: true
        },
        {
            args: [ '2016-01-01T12:00+09:00' ],
            expect: true
        },
        {
            args: [ '' ],
            expect: false
        },
        {
            args: [ null ],
            expect: false
        },
        {
            args: [ undefined ],
            expect: false
        }
    ];

    testCases.forEach(function(testCase){
        it('ax5.util.isDateFormat(' + JSON.stringify(testCase.args[0]) + ') expect ' + testCase.expect, function() {
            var actual = ax5.util.isDateFormat.apply(this, testCase.args);

            actual.should.equal(testCase.expect);
        });
    });

});
