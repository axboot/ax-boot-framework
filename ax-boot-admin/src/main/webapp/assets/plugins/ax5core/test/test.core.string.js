describe('ax5.util.left TEST', function() {
  var testCases = [
      {
          args: [ 'ab.da', '.' ],
          expect: 'ab',
          explanation: 'ab.da, "."'
      },
      {
          args: [ 'abc"', "\""],
          expect: 'abc',
          explanation: 'abc", "\""'
      },
      {
          args: [ 'abc4', 4 ],
          expect: 'abc4',
          explanation: 'abc4, 4'
      },
      {
          args: [ 'abc4efg', 4.0 ],
          expect: 'abc4',
          explanation: 'abc4efg, 4.0'
      },
      {
          args: [ 'abc4e', 100 ],
          expect: 'abc4e',
          explanation: 'abc4e, 100'
      },
      {
          args: [ 'abc4', '4' ],
          expect: 'abc',
          explanation: 'abc4, "4"'
      },
      {
          args: [ 'abc', '4' ],
          expect: '',
          explanation: 'abc, "4"'
      },
      {
          args: [ 'abc', 0],
          expect: '',
          explanation: 'abc", 0'
      },
      {
          args: [ 'abc', '0'],
          expect: '',
          explanation: 'abc", "0"'
      },
      {
          args: [ 'abc'],
          expect: '',
          explanation: 'abc'
      },
      {
          args: [ 'abc', '' ],
          expect: '',
          explanation: 'abc, ""'
      },
      {
          args: [ 'abc', null ],
          expect: '',
          explanation: 'abc, null'
      },
      {
          args: [ 'abc', undefined],
          expect: '',
          explanation: 'abc", undefined'
      },
      {
          args: [ 'abc', true],
          expect: '',
          explanation: 'abc", true'
      },
      {
          args: [ 'abc', false],
          expect: '',
          explanation: 'abc", false'
      },
      {
          args: [ 'abc', new Object],
          expect: '',
          explanation: 'abc", new Object'
      },
      {
          args: [ 'abc', new Function],
          expect: '',
          explanation: 'abc", new Function]'
      },
      {
          args: [ 'abc', []],
          expect: '',
          explanation: 'abc", []]'
      },
      {
          args: [ 'abc', {}],
          expect: '',
          explanation: 'abc", {}]'
      }
  ];

  testCases.forEach(function(testCase){
      it('ax5.util.left(' + testCase.explanation + ') expect ' + JSON.stringify(testCase.expect), function() {
          var actual = ax5.util.left.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });

});

describe('ax5.util.right TEST', function() {
  var testCases = [
      {
          args: [ 'abcd.efd', 3 ],
          expect: 'efd'
      },
      {
          args: [ 'abcd.efd', '.' ],
          expect: 'efd'
      }
    ];

  testCases.forEach(function(testCase){
      it('ax5.util.right(' + testCase.args + ') expect ' + testCase.expect, function() {
          var actual = ax5.util.right.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });
});

describe('ax5.util.camelCase Test', function() {
  var testCases = [
    {
      args: [ 'inner-width' ],
      expect: 'innerWidth'
    },
    {
      args: [ 'innerWidth' ],
      expect: 'innerWidth'
    }
  ];
  testCases.forEach(function(testCase){
      it('ax5.util.camelCase(' + testCase.args + ') expect ' + testCase.expect, function() {
          var actual = ax5.util.camelCase.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });
});

describe('ax5.util.snakeCase Test', function() {
  var testCases = [
    {
      args: [ 'inner-width' ],
      expect: 'inner-width'
    },
    {
      args: [ 'camelCase' ],
      expect: 'camel-case'
    }
  ];
  testCases.forEach(function(testCase){
      it('ax5.util.snakeCase(' + testCase.args + ') expect ' + testCase.expect, function() {
          var actual = ax5.util.snakeCase.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });
});

describe('ax5.util.setDigit Test', function() {
  var testCases = [
    {
      args: [ 1, 2 ],
      expect: '01'
    }
  ];
  testCases.forEach(function(testCase){
      it('ax5.util.setDigit(' + testCase.args + ') expect ' + testCase.expect, function() {
          var actual = ax5.util.setDigit.apply(this, testCase.args);

          actual.should.deepEqual(testCase.expect);
      });
  });
});

describe('ax5.util.escape Test', function() {
    it('ax5.util.escapeHtml("HTML <span>string</span> & "escape"") expect "HTML &lt;span&gt;string&lt;/span&gt; &amp; &quot;escape&quot;"', function() {
        var actual = ax5.util.escapeHtml('HTML <span>string</span> & "escape"');
        should(actual).be.equal('HTML &lt;span&gt;string&lt;/span&gt; &amp; &quot;escape&quot;');
    });

    it('ax5.util.escapeHtml(undefined) expect undefined', function() {
        var actual = ax5.util.escapeHtml(undefined);
        should(actual).be.equal(undefined);
    });

    it('ax5.util.escapeHtml({ "foo": 1 }) expect { "foo": 1 }', function() {
        var actual = ax5.util.escapeHtml({ "foo": 1 });
        should(actual).be.deepEqual({ "foo": 1 });
    });

    it('ax5.util.unescapeHtml("HTML &lt;span&gt;string&lt;/span&gt; &amp; &quot;escape&quot;") expect "HTML <span>string</span> & "escape""', function() {
        var actual = ax5.util.unescapeHtml('HTML &lt;span&gt;string&lt;/span&gt; &amp; &quot;escape&quot;');
        should(actual).be.equal('HTML <span>string</span> & "escape"');
    });

    it('ax5.util.unescapeHtml(undefined) expect undefined', function() {
        var actual = ax5.util.unescapeHtml(undefined);
        should(actual).be.equal(undefined);
    });

    it('ax5.util.unescapeHtml({ "foo": 1 }) expect { "foo": 1 }', function() {
        var actual = ax5.util.unescapeHtml({ "foo": 1 });
        should(actual).be.deepEqual({ "foo": 1 });
    });
});


describe('ax5.util.string Test', function() {
    it('ax5.util.string("{0} is dead, but {1} is alive! {0} {2}").format("ASP", "ASP.NET", 99); expect "ASP is dead, but ASP.NET is alive! ASP 99"', function() {
        var actual = ax5.util.string("{0} is dead, but {1} is alive! {0} {2}").format("ASP", "ASP.NET", 99);
        should(actual).be.equal("ASP is dead, but ASP.NET is alive! ASP 99");
    });
    it('ax5.util.string("{0} is dead, but {1} is alive! {0} {2}").format(["ASP", "ASP.NET", 99]); expect "ASP is dead, but ASP.NET is alive! ASP 99"', function() {
        var actual = ax5.util.string("{0} is dead, but {1} is alive! {0} {2}").format(["ASP", "ASP.NET", 99]);
        should(actual).be.equal("ASP is dead, but ASP.NET is alive! ASP 99");
    });
});
