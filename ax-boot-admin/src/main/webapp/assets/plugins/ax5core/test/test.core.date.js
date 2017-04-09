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
        should.deepEqual(ax5.util.date("1919-03-01", {add: {d: 10}, return: "yyyy/MM/dd hh:mm:ss"}), '1919/03/11 12:00:00');
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
        }
        should.deepEqual(ax5.util.weeksOfMonth("2015-10-01"), obj);
    });

    //Usage02
    it('ax5.util.weeksOfMonth("2015-09-19")', function () {
        var obj = {
            year: 2015,
            month: 9,
            count: 3
        }
        should.deepEqual(ax5.util.weeksOfMonth("2015-09-19"), obj);
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
    /* end ax5.util.daysOfMonth*/
});