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
    /*end ax5.util.search */
});

describe('ax5.util.map TEST', function () {
    /*ax5.util.map*/
    //Usage 01
    var map_a = [1, 2, 3, 4, 5];

    it('[1,2,3,4,5] = ax5.util.map([1,2,3,4,5] , function(){return {id : this}})', function () {
        map_a = ax5.util.map(map_a, function () {
            return {id: this}
        });

        _.isEqual(map_a, [{"id": 1}, {"id": 2}, {"id": 3}, {"id": 4}, {"id": 5}]).should.equal(true);
    });

    //Usage 02
    it('ax5.util.map({a: 1, b: 2}, function (k, v) {return {id: k, value: v};})', function () {

        _.isEqual(ax5.util.map({a: 1, b: 2}, function (k, v) {
            return {id: k, value: v};
        }), [{"id": "a", "value": 1}, {"id": "b", "value": 2}]).should.equal(true);
    });
    /*end ax5.util.map*/
});

describe('ax5.util.merge TEST', function () {
    /*ax5.util.merge*/
    it('ax5.util.merge([1,2,3],[7,8,9])', function () {
        _.isEqual(ax5.util.merge([1, 2, 3], [7, 8, 9]), [1, 2, 3, 7, 8, 9]).should.equal(true);
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
    /*end ax5.util.reduce*/
});

describe('ax5.util.reduceRight TEST', function () {
    /*ax5.util.reduceRight*/
    it('ax5.util.reduceRight([5,4,3,2,1] , function(p,n){return p-n;})', function () {
        should.deepEqual(ax5.util.reduceRight([5, 4, 3, 2, 1], function (p, n) {
            return p - n;
        }), -13);
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
    /*end ax.util.Sum */
});

describe('ax5.util.avg TEST', function () {
    /* ax.util.avg */
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
    /* end ax.util.first */
});

describe('ax5.util.first TEST', function () {
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
    /* end ax5.util.last */
});

/* ax5.util.deepCopy */

/* end ax5.util.deepCopy */
