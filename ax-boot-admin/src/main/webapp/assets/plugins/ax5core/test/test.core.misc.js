describe('ax5.util.param TEST', function() {
    it('ax5.util.param({a: 1, b: \'123\'"2&\'}, "param") expect "a=1&b=123%27%222%26"', function() {
        var actual = ax5.util.param({a: 1, b: '123\'"2&'}, 'param');

        actual.should.equal('a=1&b=123%27%222%26');
    });
    it('ax5.util.param("a=1&b=12\'"32", "param") expect "a=1&b=12\'"32"', function() {
        var actual = ax5.util.param("a=1&b=12'\"32", 'param');

        actual.should.equal('a=1&b=12\'"32');
    });
    it('ax5.util.param("a=1&b=1232") expect {"a":"1","b":"1232"}', function() {
        var actual = ax5.util.param("a=1&b=1232");

        should.deepEqual(actual, {"a":"1","b":"1232"});
    });
});

describe('ax5.util.parseJson TEST', function() {
    it('ax5.util.util.parseJson("[{"a":"99"},"2","3"]") expect [{"a":"99"},"2","3"]', function() {
        var actual = ax5.util.parseJson('[{"a":"99"},"2","3"]');

        actual.should.deepEqual([{"a":"99"},"2","3"]);
    });
    it('ax5.util.parseJson("{"a":1, "b":function(){return 1;}}", false) expect {"error": 500, "msg": "syntax error"}', function() {
        var actual = ax5.util.parseJson('{"a":1, "b":function(){return 1;}}', false);

        actual.should.deepEqual({"error": 500, "msg": "syntax error"});
    });
    it('ax5.util.parseJson("{"a":1, "b":function(){return 1;}}", true) expect {"a": 1, "b": "{Function}"}', function() {
        var actual = ax5.util.parseJson('{"a":1, "b":function(){return 1;}}', true);

        actual.a.should.equal(1);
        actual.b.should.Function();
    });

    it('ax5.util.parseJson("{"key": [true, false, true, false], "fn": function(){return "fn";}}", true);', function() {
        var actual = ax5.util.parseJson('{"key": [true, false, true, false], "fn": function(){return "fn";}}', true);

        actual.key.should.deepEqual([true, false, true, false]);
        actual.fn.should.Function();
    });
});

describe('ax5.util.toJson TEST', function() {
    var testCases = [
        {
            args: 1,
            expect: 1
        },
        {
            args: "A",
            expect: '"A"'
        },
        {
            args: [1, 2, 3, "A"],
            expect: '[1,2,3,"A"]'
        },
        {
            args: {a: "a", x: "x"},
            expect: '{"a": "a", "x": "x"}'
        },
        {
            args: [1,{"a": "a", "x": "x"}],
            expect: '[1,{"a": "a", "x": "x"}]'
        },
        {
            args: {"a": "a", "x": "x", "list": [1,2,3]},
            expect: '{"a": "a", "x": "x", "list": [1,2,3]}'
        },
        {
            args: function func() {},
            expect: '"{Function}"'
        },
        {
            args: [true, false, true],
            expect: '[true,false,true]'
        }
    ];

    _.each(testCases, function(testCase){
        it('ax5.util.toJson(' + (JSON.stringify(testCase.args) || testCase.args.toString()) + ') expect ' + testCase.expect, function() {
            var actual = ax5.util.toJson(testCase.args);

            actual.should.deepEqual(testCase.expect);
        });
    });
});

describe('ax5.util.alert TEST', function(){
    // TODO 대략 난감... HJ.Park 2016-09-26
});

describe('ax5.util.toArray TEST', function() {
    it('ax5.util.toArray converts [Array-like objects] to [Array]', function() {
        function something() {
            return ax5.util.toArray(arguments);
        }
        var actual = something("A", "X", "I", "S", "J");

        actual.should.deepEqual(["A", "X", "I", "S", "J"]);
    });
});

describe('ax5.util.xxxCookie TEST', function() {

    describe('ax5.util.setCookie TEST', function() {
        it('ax5.util.setCookie("ax5-cookie", "eng+한글")', function() {
            ax5.util.setCookie('ax5-cookie', 'eng+한글');

            document.cookie.indexOf('ax5-cookie=eng+%uD55C%uAE00').should.above(-1);
        });
    });

    describe('ax5.util.getCookie TEST', function() {
        it('ax5.util.getCookie("ax5-cookie") expect "eng+한글"', function() {
            var actual = ax5.util.getCookie('ax5-cookie');

            actual.should.equal('eng+한글');
        });
    });

});

describe('ax5.util.findParentNode TEST', function() {
    it('ax5.util.findParentNode($(".first").get(0), { tagname: "div", clazz: "test-mockup-1" }) expect $("div.test-mockup-1").get(0)', function() {
        var actual = ax5.util.findParentNode($('.first').get(0), { tagname: 'div', clazz: 'test-mockup-1' });
        var expect = $('div.test-mockup-1').get(0);

        should.equal(actual, expect);
    });
});

describe('ax5.util.cssNumber TEST', function() {
    var testCases = [
        {
            args: '100px',
            expect: '100px'
        },
        {
            args: 100,
            expect: '100px'
        },
        {
            args: '100%',
            expect: '100%'
        },
        {
            args: '##100@',
            expect: '100px'
        }
    ];

    _.each(testCases, function(testCase){
        it('ax5.util.toJson(' + JSON.stringify(testCase.args) + ') expect ' + testCase.expect, function() {
            var actual = ax5.util.cssNumber(testCase.args);

            should.equal(actual, testCase.expect);
        });
    });
});

describe('ax5.util.css TEST', function() {

    it('ax5.util.css({background:"#ccc",padding:"50px",width:"100px" }) expect background:#ccc;padding:50px;width:100px;', function() {
        var actual = ax5.util.css({background:"#ccc",padding:"50px",width:"100px" });

        should.equal(actual, 'background:#ccc;padding:50px;width:100px;');
    });

    it('ax5.util.css("width:100px;padding: 50px; background: #ccc") expect {width: "100px", padding: "50px", background: "#ccc"}', function() {
        var actual = ax5.util.css('width:100px;padding: 50px; background: #ccc');

        should.deepEqual(actual, {width: "100px", padding: "50px", background: "#ccc"});
    });

});

describe('ax5.util.stopEvent TEST', function(){
    // TODO 대략 난감... HJ.Park 2016-09-26
});

describe('ax5.util.selectRange TEST', function() {
    // TODO 대략 난감... HJ.Park 2016-09-26
});

describe('ax5.util.debounce TEST', function() {
    // TODO 대략 난감... HJ.Park 2016-09-26
});
