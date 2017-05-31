describe('ax5.util.date TEST', function () {
    /* ax5.util.date */
    //Usage 01
    it('ax5.util.date("2013-01-01")', function () {
        var date = new Date(2013, 0, 1);
        date.setHours(12);
        date.setMinutes(0);
        should.deepEqual(ax5.util.date('2013-01-01'), date);
    });

    //Usage 02
    it('ax5.util.date((new Date()) , {add:{d:10} , return:"yyyy/MM/dd"})', function () {
        var date = new Date();
        date.setDate(date.getDate() + 10);
        var str = date.getFullYear() + "/" + ax5.util.setDigit(date.getMonth() + 1, 2) + "/" + ax5.util.setDigit(date.getDate(), 2);

        should.deepEqual(ax5.util.date((new Date()), {add: {d: 10}, return: 'yyyy/MM/dd'}), str);
    });

    //Usage 03
    it('ax5.util.date("1919-03-01", {add:{d:10}, return:"yyyy/MM/dd hh:mm:ss"})', function () {
        should.deepEqual(ax5.util.date("1919-03-01", {
            add: {d: 10},
            return: "yyyy/MM/dd hh:mm:ss"
        }), '1919/03/11 12:00:00');
    });

    //Usage 04
    it('ax5.util.date((new Date()) , {set:"firstDayOfMonth", return:"yyyy/MM/dd"})', function () {
        var date = new Date();
        var str = date.getFullYear() + "/" + ax5.util.setDigit(date.getMonth() + 1, 2) + "/01";
        should.deepEqual(ax5.util.date((new Date()), {set: "firstDayOfMonth", return: 'yyyy/MM/dd'}), str);
    });

    //Usage 05
    it('ax5.util.date((new Date()) , {set:"lastDayOfMonth", return:"yyyy/MM/dd"})', function () {
        var date = new Date();
        var str = date.getFullYear() + "/" + ax5.util.setDigit(date.getMonth() + 1, 2) + "/" + ax5.util.daysOfMonth(date.getFullYear(), date.getMonth());
        should.deepEqual(ax5.util.date((new Date()), {set: "lastDayOfMonth", return: 'yyyy/MM/dd'}), str);
    });

    //Usage 06
    it('ax5.util.date("")', function () {
        var date = new Date();
        should.deepEqual(ax5.util.date(""), date);
    });

    //Usage 07
    it('ax5.util.date("1979-12-16T09:00:00") [string.length > 15]', function () {
        var date = new Date();
        date.setUTCFullYear(1979, 11, 16);
        date.setUTCHours(09, 00, 00, 000);
        should.deepEqual(ax5.util.date("1979-12-16T09:00:00"), date);
    });

    //Usage 08
    it('ax5.util.date("20170411103317") [string.length == 14]', function () {
        var date = new Date(2017, 3, 11);
        date.setHours(10);
        date.setMinutes(33);
        date.setSeconds(17);
        should.deepEqual(ax5.util.date("20170411103317"), date);
    });

    //Usage 09
    it('ax5.util.date("201704") [string.length > 7]', function () {
        var date = new Date(2017, 3, 12);
        date.setHours(12);
        should.deepEqual(ax5.util.date("20170412"), date);
    });

    //Usage 10
    it('ax5.util.date("201704") [string.length > 4]', function () {
        var date = new Date(2017, 3);
        date.setHours(12);
        should.deepEqual(ax5.util.date("201704"), date);
    });

    //Usage 11
    it('ax5.util.date("2017") [string.length > 2]', function () {
        var date = new Date(2017, 0);
        date.setHours(12);
        should.deepEqual(ax5.util.date("2017"), date);
    });

    //Usage 12
    it('ax5.util.date("17") [string.length <= 2]', function () {
        var date = new Date();
        should.deepEqual(ax5.util.date("17"), date);
    });

    //Usage 13
    it('ax5.util.date(date, {return: "yyyy-MM-dd"})', function () {
        var date = new Date(2017, 3, 16);
        should.deepEqual(ax5.util.date(date, {return: "yyyy-MM-dd"}), "2017-04-16");
    });

    //Usage 14
    it('ax5.util.date(date, {return: "yyyy-MM-dd hh:mm:ss"})', function () {
        var date = new Date(2017, 3, 16, 12, 30, 15);
        should.deepEqual(ax5.util.date(date, {return: "yyyy-MM-dd hh:mm:ss"}), "2017-04-16 12:30:15");
    });

    //Usage 15
    it('ax5.util.date(date, {return: "dw"})', function () {
        var date = new Date(2017, 3, 16);
        should.deepEqual(ax5.util.date(date, {return: "dw"}), "SUN");
    });

    //Usage 16
    it('ax5.util.date("2017-04-16", {add: {d: 1}})', function () {
        var date = new Date(2017, 3, 17, 12);
        should.deepEqual(ax5.util.date("2017-04-16", {add: {d: 1}}), date);
    });

    //Usage 17
    it('ax5.util.date("2017-05-16", {add: {m: 1}})', function () {
        var date = new Date(2017, 5, 16, 12);
        should.deepEqual(ax5.util.date("2017-05-16", {add: {m: 1}}), date);
    });

    //Usage 18
    it('ax5.util.date("2017-04-22", {add: {y: 1}})', function () {
        var date = new Date(2018, 3, 22, 12);
        should.deepEqual(ax5.util.date("2017-04-22", {add: {y: 1}}), date);
    });

    //Usage 19
    it('ax5.util.date("2016-04-23", {add: {d: 1.5}, return: "dd"})', function () {
        var str = "25";
        should.deepEqual(ax5.util.date("2016-04-23", {add: {d: 1.5}, return: "dd"}), str);
    });

    /* end ax5.util.date */
});

describe('ax5.util.dday TEST', function () {
    /* ax5.util.dday*/
    //Usage 01
    it('ax5.util.dday(new Date())', function () {
        should.deepEqual(ax5.util.dday(new Date()), 0);
    });

    //Usage 02
    it('ax5.util.dday("2016-01-29" , {today:"2016-01-28"})', function () {
        should.deepEqual(ax5.util.dday("2016-01-29", {today: "2016-01-28"}), 1);
    });

    //Usage 03
    it('ax5.util.dday("1977-03-29" , {today:"2016-01-28" , age:true})', function () {
        should.deepEqual(ax5.util.dday("1977-03-29", {today: "2016-01-28", age: true}), 39);
    });
    /* end ax5.util.dday*/
});

describe('ax5.util.weeksOfMonth TEST', function () {
    /* ax5.util.weeksOfMonth */
    //Usage 01
    it('ax5.util.weeksOfMonth("2015-10-01")', function () {
        var obj = {
            year: 2015,
            month: 10,
            count: 1
        };
        should.deepEqual(ax5.util.weeksOfMonth("2015-10-01"), obj);
    });

    //Usage02
    it('ax5.util.weeksOfMonth("2015-09-19")', function () {
        var obj = {
            year: 2015,
            month: 9,
            count: 3
        };
        should.deepEqual(ax5.util.weeksOfMonth("2015-09-19"), obj);
    });

    //Usage03
    it('ax5.util.weeksOfMonth("2016-04-30")', function () {
        var obj = {
            year: 2016,
            month: 4,
            count: 5
        };
        should.deepEqual(ax5.util.weeksOfMonth("2016-04-30"), obj);
    });

    //Usage04
    it('ax5.util.weeksOfMonth("2017-04-13")', function () {
        var obj = {
            year: 2017,
            month: 4,
            count: 2
        };
        should.deepEqual(ax5.util.weeksOfMonth("2017-04-13"), obj);
    });
    /* end ax5.util.weeksOfMonth */
});

describe('ax5.util.daysOfMonth TEST', function () {
    /* ax5.util.daysOfMonth*/
    //Usage 01
    it('ax5.util.daysOfMonth(2015,11)', function () {
        should.deepEqual(ax5.util.daysOfMonth(2015, 11), 31);
    });

    //Usage 02
    it('ax5.util.daysOfMonth(2015,1)', function () {
        should.deepEqual(ax5.util.daysOfMonth(2015, 1), 28);
    });

    //Usage 03
    it('ax5.util.daysOfMonth(2016,1)', function () {
        should.deepEqual(ax5.util.daysOfMonth(2016, 1), 29);
    });

    //Usage 04
    it('ax5.util.daysOfMonth(2016,3)', function () {
        should.deepEqual(ax5.util.daysOfMonth(2016, 3), 30);
    });
    /* end ax5.util.daysOfMonth*/
});