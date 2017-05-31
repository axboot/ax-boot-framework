describe('ax5.util.each TEST', function () {
    /* ax5.util.each */
    //example 01
    it('ax5.util.each [object]', function () {
        var obj = {a_1: 1, b_2: 2, c_3: 3, d_4: 4, e_5: 5};
        var result = 0;
        ax5.util.each(obj, function (i, o) {
            result += Number(i.replace(/\D/g, ''));
            result += o;
        });
        _.isEqual(result, 30).should.equal(true);
    });

    //example 02
    it('ax5.util.each [array]', function () {
        var obj = [1, 2, 3, 4, 5];
        var result = 0;
        ax5.util.each(obj, function (i, o) {
            result += i;
            result += o;
        });
        _.isEqual(result, 25).should.equal(true);
    });

    //example 03
    it('ax5.util.each [function]', function () {
        var obj = function () {
            return 0;
        };
        var result = ax5.util.each(obj, function (i, o) {
        });
        _.isEqual(result, obj).should.equal(true);
    });

    //example 04
    it('ax5.util.each [string]', function () {
        var obj = "12345";
        var result = 0;
        ax5.util.each(obj, function (i, o) {
            result += i;
            result += Number(o);
        });
        _.isEqual(result, 25).should.equal(true);
    });

    //example 05
    it('ax5.util.each [!isObj return false]', function () {
        var arr = [0, 0, 0, 1, 1, 1, 1, 0, 0, 1];
        var result = 0;
        ax5.util.each(arr, function (i, o) {
            ++result;
            return o === 0;
        });
        _.isEqual(result, 4).should.equal(true);
    });

    //example 06
    it('ax5.util.each [isNothing]', function () {
        var arr;
        _.isEqual(ax5.util.each(arr, function (i, o) {
            ++result;
            return o === 0;
        }), []).should.equal(true);
    });

    /* end ax5.util.each */
});

describe('ax5.util.filter TEST', function () {
    /* ax5.util.filter */
    //example 01
    var array = [5, 4, 3, 2, 1];
    it('ax5.util.filter([5,4,3,2,1],function(){return this%2;})', function () {
        var result = ax5.util.filter(array, function () {
            return this % 2;
        });

        _.isEqual(result, [5, 3, 1]).should.equal(true);
    });

    //example 02
    var list = [
        {isdel: 1, name: "ax5-1"},
        {name: "ax5-2"},
        {isdel: 1, name: "ax5-3"},
        {name: "ax5-4"},
        {name: "ax5-5"}
    ];

    it('ax5.util.filter([{isdel : 1 , name : "ax5-1"},{name : "ax5-2"},{isdel : 1 , name : "ax5-3"},{name : "ax5-4"},{name : "ax5-5"}] , function(){return (this.isdel !=1)})', function () {
        var result = ax5.util.filter(list, function () {
            return (this.isdel != 1);
        });

        _.isEqual(result, [{name: "ax5-2"}, {name: "ax5-4"}, {name: "ax5-5"}]).should.equal(true);
    });

    //example03
    var filObject = {
        a: 1,
        s: "string",
        oa: {pickup: true, name: "AXISJ"},
        os: {pickup: true, name: "AX5"}
    };

    it('ax5.util.filter( {a : 1, s : "string", oa : {pickup:true, name:"AXISJ"}, os : {pickup:true, name:"AX5"}}, function(){return this.pickup;})', function () {
        var result = ax5.util.filter(filObject, function () {
            return this.pickup;
        });
        should(result).be.deepEqual([{"pickup": true, "name": "AXISJ"}, {"pickup": true, "name": "AX5"}]);
    });

    //example04
    var filString = "BANANABANANA";

    it('ax5.util.filter( "BANANABANANA", function(){return this.pickup;})', function () {
        var result = ax5.util.filter(filString, function () {
            return this == "A";
        });
        should(result).be.deepEqual(["A", "A", "A", "A", "A", "A"]);
    });

    //example 05
    it('ax5.util.filter("", function (i, o){}) ', function () {
        var arr = [null, null, null];
        _.isEqual(ax5.util.filter(arr, function (i, o) {
            return o === null;
        }), arr).should.equal(true);
    });

    /* end ax5.util.filter */
});

describe('ax5.util.search TEST', function () {
    /*ax5.util.search */
    //example01
    var a = ["A", "X", "5"];

    it('ax5.util.search(["A" , "X" , "5"], function(){return this == "X"})', function () {
        var idx = ax5.util.search(a, function () {
            return this == "X";
        });

        _.isEqual(a[idx], "X").should.equal(true);
    });

    //example02
    var a = ["A", "X", "5"];

    it('["A" , "X" ,"5"][ax5.util.search(["A" , "X" ,"5"] , function(idx){return idx == 2;})]', function () {
        var result = a[ax5.util.search(a, function (idx) {
            return idx == 2;
        })
            ];

        _.isEqual(result, "5").should.equal(true);
    });

    //example03
    var b = {a: "AX5-0", x: "AX5-1", 5: "AX5-2"};

    it('{a:"AX5-0" , x:"AX5-1" , 5:"AX5-2"}[ax5.util.search(b , function(k){return k == "x"})]', function () {
        var result = b[ax5.util.search(b, function (k) {
            return k == "x";
        })];

        _.isEqual(result, "AX5-1").should.equal(true);
    });

    //example04
    var c = "example";

    it('ax5.util.search("example" , function(k, v){return v == "x"})', function () {
        var result = ax5.util.search(c, function (k, v) {
            return v == "x";
        });
        _.isEqual(result, 1).should.equal(true);
    });

    //example05
    var c = "example";

    it('ax5.util.search("example" , "a")', function () {
        var result = ax5.util.search(c, "a");
        _.isEqual(result, 2).should.equal(true);
    });

    //example06
    var d = "";

    it('ax5.util.search("" , "")', function () {
        var result = ax5.util.search("", "");
        _.isEqual(result, -1).should.equal(true);
    });
    /*end ax5.util.search */
});

describe('ax5.util.map TEST', function () {
    /*ax5.util.map*/
    // Usage 01
    var map_a = [1, 2, 3, 4, 5];

    it('[1,2,3,4,5] = ax5.util.map([1,2,3,4,5] , function(){return {id : this}})', function () {
        map_a = ax5.util.map(map_a, function () {
            return {id: this}
        });

        _.isEqual(map_a, [{"id": 1}, {"id": 2}, {"id": 3}, {"id": 4}, {"id": 5}]).should.equal(true);
    });

    // Usage 02
    it('ax5.util.map({a: 1, b: 2}, function (k, v) {return {id: k, value: v};})', function () {

        _.isEqual(ax5.util.map({a: 1, b: 2}, function (k, v) {
            return {id: k, value: v};
        }), [{"id": "a", "value": 1}, {"id": "b", "value": 2}]).should.equal(true);
    });
    /*end ax5.util.map*/

    // Usage 03
    it('ax5.util.map("987", function (k, v) {return k + Number(v);})', function () {
        _.isEqual(ax5.util.map("987", function (k, v) {
            return k + Number(v);
        }), [9, 9, 9]).should.equal(true);
    });

    // Usage 04
    it('ax5.util.map({a: temp, b: temp, c:temp}, function (k, v) {return v;})', function () {
        var temp = void 0;
        _.isEqual(ax5.util.map({a: temp, b: temp, c: temp}, function (k, v) {
            return v;
        }), []).should.equal(true);
    });

    // Usage 05
    it('ax5.util.map({a: (function(){return 1;})(), b: (function(){return 2;})(), c:(function(){return 3;})()}, ...)', function () {
        _.isEqual(ax5.util.map({
            a: (function () {
                return 1;
            })(), b: (function () {
                return 2;
            })(), c: (function () {
                return 3;
            })()
        }, function (k) {
            var obj = {};
            obj[this] = k;
            return obj;
        }), [{"1": "a"}, {"2": "b"}, {"3": "c"}]).should.equal(true);
    });
    /*end ax5.util.map*/
});

describe('ax5.util.merge TEST', function () {
    /*ax5.util.merge*/
    // Usage 01
    it('ax5.util.merge([1,2,3],[7,8,9])', function () {
        _.isEqual(ax5.util.merge([1, 2, 3], [7, 8, 9]), [1, 2, 3, 7, 8, 9]).should.equal(true);
    });

    // Usage 02
    it('ax5.util.merge([{i: "apple"}, {i: "banana"}], [{i: "cherry"}, {i: "damson"}])', function () {
        _.isEqual(ax5.util.merge([{i: "apple"}, {i: "banana"}], [{i: "cherry"}, {i: "damson"}]), [{i: "apple"}, {i: "banana"}, {i: "cherry"}, {i: "damson"}]).should.equal(true);
    });
    /*end ax5.util.merge*/
});

describe('ax5.util.reduce TEST', function () {
    /*ax5.util.reduce*/
    //Example01
    it('ax5.util.reduce([5,4,3,2,1]) , function(p , n){return p*n;}', function () {
        should.deepEqual(ax5.util.reduce([5, 4, 3, 2, 1], function (p, n) {
            return p * n;
        }), 120);
    });
    //Example02
    it('ax5.util.reduce({a:1,b:2} , function(p,n){ return parseInt(p || 0) + parseInt(n);})', function () {
        should.deepEqual(ax5.util.reduce({a: 1, b: 2}, function (p, n) {
            return parseInt(p || 0) + parseInt(n);
        }), 3);
    });

    //Example03
    it('ax5.util.reduce({a: 1, b: 2, c: 3} , function(){ return ++count; })', function () {
        var count = 0;
        ax5.util.reduce({a: 1, b: 2, c: 3}, function () {
            return ++count;
        });
        should.deepEqual(count, 3);
    });

    //Example04
    it('ax5.util.reduce([5, 4, 3, 2, 1] , function(){ return ++count; })', function () {
        var count = 0;
        ax5.util.reduce([5, 4, 3, 2, 1], function () {
            return ++count;
        });
        should.deepEqual(count, 4);
    });

    //Example05
    it('ax5.util.reduce([false, true, false, true, false], function (p, n) {return p == n;})', function () {
        should.deepEqual(ax5.util.reduce([false, true, false, true, false], function (p, n) {
            return p == n;
        }), false);
    });
    /*end ax5.util.reduce*/
});

describe('ax5.util.reduceRight TEST', function () {
    /*ax5.util.reduceRight*/
    //Usage 01
    it('ax5.util.reduceRight([5,4,3,2,1] , function(p,n){return p-n;})', function () {
        should.deepEqual(ax5.util.reduceRight([5, 4, 3, 2, 1], function (p, n) {
            return p - n;
        }), -13);
    });

    //Usage 02
    it('ax5.util.reduceRight("ymmuy_os_si_maerc-eci" , function(){return return p + n;})', function () {
        should.deepEqual(ax5.util.reduceRight("ymmuy_os_si_maerc-eci", function (p, n) {
            return p + n;
        }), "ice-cream_is_so_yummy");
    });

    //Example03
    it('ax5.util.reduceRight("avocado" , function(){ return ++count; })', function () {
        var count = 0;
        ax5.util.reduceRight("avocado", function () {
            return ++count;
        });
        should.deepEqual(count, 6);
    });

    //Example04
    it('ax5.util.reduceRight([0, 1, 1, 2, 3, 5, 8, 13, 21] , function(p,n){ return ++count; })', function () {
        var count = 0;
        ax5.util.reduceRight([0, 1, 1, 2, 3, 5, 8, 13, 21], function () {
            return ++count;
        });
        should.deepEqual(count, 8);
    });
    /*end ax5.util.reduceRight*/
});

describe('ax5.util.sum TEST', function () {
    /*ax.util.Sum */
    //Usage 01
    it('ax5.util.sum([{name: "122", value: 9},{name: "122", value: 10},{name: "123", value: 11}] , function(){if(this.name == "122"){return this.value;}})', function () {
        var arr = [
            {name: "122", value: 9},
            {name: "122", value: 10},
            {name: "123", value: 11}
        ];

        var rs = ax5.util.sum(arr, function () {
            if (this.name == "122") {
                return this.value;
            }
        });

        should.deepEqual(rs, 19);
    });

    //Usage 02
    it('ax5.util.sum([{name: "122", value: 9},{name: "122", value: 10},{name: "123", value: 11}] , 10 , function(){return this.value;})', function () {
        var arr = [
            {name: "122", value: 9},
            {name: "122", value: 10},
            {name: "123", value: 11}
        ];

        var test = ax5.util.sum(arr, 10, function () {
            return this.value;
        });

        should.deepEqual(test, 40);
    });

    //Usage 03
    it('ax5.util.sum("123", function(){return this;})', function () {

        var test = ax5.util.sum("123", function () {
            return this;
        });

        should.deepEqual(test, 0);
        // print: console.error("argument error : ax5.util.sum - use Array or Object");
    });

    //Usage 04
    it('ax5.util.sum(["H", "A", "P", "P"], "Y", function () { return this; })', function () {
        var test = ax5.util.sum(["A", "P", "P", "Y"], "H", function () {
            return this;
        });
        should.deepEqual(test, "HAPPY");
    });

    //Usage 05
    it('ax5.util.sum([true, false, true, false], true, function () { return this; })', function () {
        var test = ax5.util.sum([true, false, true, false], true, function () {
            return this;
        });
        should.deepEqual(test, 3);
    });

    //Usage 06
    it('ax5.util.sum([true, false, true, false], true, function () { return this; })', function () {
        var test = ax5.util.sum([1, true, "0", false], true, function () {
            return this;
        });
        should.deepEqual(test, "30false");
    });
    /*end ax.util.Sum */
});

describe('ax5.util.avg TEST', function () {
    /* ax.util.avg */
    //Example 01
    it('ax5.util.avg(arr , function(){return this.value;})', function () {
        var arr = [7, 70, 700, 7000, 70000, 700000, 7000000];

        var rs = ax5.util.avg(arr, function () {
            return this
        });

        should.deepEqual(rs, 1111111);
    });
    //Example 02
    it('ax5.util.avg(arr , function(){return this.value;})', function () {
        var arr = [
            {name: "122", value: 9},
            {name: "122", value: 10},
            {name: "123", value: 11}
        ];

        var rs = ax5.util.avg(arr, function () {
            return this.value;
        });

        should.deepEqual(rs, 10);
    });

    //Example 03
    it('ax5.util.avg(arr , function(){return this;})', function () {
        var arr = [true, false, true, false, true, false];

        var rs = ax5.util.avg(arr, function () {
            return this;
        });

        should.deepEqual(rs, 0.5);
    });

    //Example 04
    it('ax5.util.avg(obj , function(){return this;})', function () {
        var obj = { "a": 3, "b": 30, "c": 300 };

        var rs = ax5.util.avg(obj, function () {
            return this;
        });

        should.deepEqual(rs, 111);
    });

    //Example 05
    it('ax5.util.avg(obj , function(){return this;})', function () {
        var obj = { "0": true, "1": true, "2": true, "3": false, "4": false, "5": false};

        var rs = ax5.util.avg(obj, function () {
            return this;
        });

        should.deepEqual(rs, 0.5);
    });
    /* end ax.util.avg */
});

describe('ax5.util.first TEST', function () {
    /* ax.util.first */
    //Example 01
    it('ax5.util.first(["ax5", "axisj"])', function () {
        var _arr = ["ax5", "axisj"];
        var str = ax5.util.first(_arr);

        should.deepEqual(str, "ax5");
    });

    //Example 02
    //confirm 필요 (ax5.util.toJson을 넣으면 에러)
    it('ax5.util.first({k: "ax5", z: "axisj"})', function () {
        var _obj = {k: "ax5", z: "axisj"};

        should.deepEqual(ax5.util.first(_obj), {"k": "ax5"});
    });

    //Example 03
    it('ax5.util.first("axisj")', function () {
        should.deepEqual(ax5.util.first("axisj"), undefined);
    });

    //Example 04
    it('ax5.util.first([{a: "axisj", b: "best"}])', function () {
        should.deepEqual(ax5.util.first([{a: "axisj", b: "best"}, {a: "abc", b:"bcd"}]), {a: "axisj", b: "best"});
    });
    /* end ax.util.first */
});

describe('ax5.util.last TEST', function () {
    /* ax5.util.last */
    //Example01
    it('ax5.util.last(["ax5", "axisj"])', function () {
        var _arr = ["ax5", "axisj"];

        should.deepEqual(ax5.util.last(_arr), "axisj");
    });

    //Example 02
    //confirm 필요 (ax5.util.toJson을 넣으면 에러)
    it('ax5.util.last({k: "ax5", z: "axisj"})', function () {
        var _obj = {k: "ax5", z: "axisj"};

        should.deepEqual(ax5.util.last(_obj), {"z": "axisj"});
    });

    //Example 03
    it('ax5.util.last("axisj")', function () {
        should.deepEqual(ax5.util.last("axisj"), undefined);
    });

    //Example 04
    it('ax5.util.last([{a: "axisj", b: "best"}])', function () {
        should.deepEqual(ax5.util.last([{a: "axisj", b: "best"}, {a: "abc", b:"bcd"}]), {a: "abc", b:"bcd"});
    });
    /* end ax5.util.last */
});

describe('ax5.util.deepCopy TEST', function () {
    /* ax5.util.deepCopy */
    //Example01
    it('ax5.util.deepCopy(obj)', function () {
        var obj = [
            {name: "A", child: [{name: "a-1"}]},
            {
                name: "B", child: [{name: "b-1"}],
                callBack: function () {
                    console.log('callBack');
                }
            }
        ];
        should.deepEqual(ax5.util.deepCopy(obj), obj);
    });
    /* end ax5.util.deepCopy */
});

describe('ax5.util.param TEST', function () {
    /* ax5.util.param */
    //Example01
    it('ax5.util.param("a=1&b=1232")', function () {
        var result = {a: "1", b: "1232"};
        should.deepEqual(ax5.util.param("a=1&b=1232"), result);
    });

    //Example02
    it('ax5.util.param({a: "1", b: "1232"}', function () {
        var result = "a=1&b=1232";
        should.deepEqual(ax5.util.param({a: "1", b: "1232"}), result);
    });

    //Example03
    it('ax5.util.param("a=1&b=1232", "param")', function () {
        var result = "a=1&b=1232";
        should.deepEqual(ax5.util.param(result, "param"), result);
    });

    //Example04
    it('ax5.util.param("a=1&b=1232", "object")', function () {
        var result = {a: "1", b: "1232"};
        should.deepEqual(ax5.util.param("a=1&b=1232", "object"), result);
    });

    //Example05
    it('ax5.util.param({a: "1", b: "1232"}, "object")', function () {
        var result = "a=1&b=1232";
        should.deepEqual(ax5.util.param({a: "1", b: "1232"}, "object"), result);
    });
    /* ax5.util.param */
});