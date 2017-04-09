/* 
 test.calendar.js
 TODO event test
 */

/* ax5.calendar.setConfig */
describe('ax5.calendar TEST', function () {
    var myCalendar;
    var myDate = new Date();
    var _c_date = ax5.util.date;
    var myArr = [
        _c_date(myDate, {'add': {d: -1}, return: 'yyyy-MM-dd'}),
        _c_date(myDate, {'add': {d: 0}, return: 'yyyy-MM-dd'}),
        _c_date(myDate, {'add': {d: 1}, return: 'yyyy-MM-dd'})
    ];

    var tmpl = '<div id="calendar-target" style="' +
        'width:300px;border:1px solid #ccc;border-radius: 5px;padding: 5px;overflow: hidden;"></div>';

    $(document.body).append(tmpl);

    it('check calendar type', function (done) {
        done(typeof new ax5.ui.calendar() == "object" ? "" : "check type error");
    });

    it('calendar setConfig', function (done) {
        myCalendar = new ax5.ui.calendar();
        myCalendar.setConfig({
            target: document.getElementById("calendar-target"),
            theme: 'info',
            displayDate: myDate,
            control: {},
            mode: 'day',
            selectMode: 'day',
            dateFormat: 'yyyy-MM-dd',
            dimensions: {},
            animateTime: 250,
            lang: {
                yearHeading: '2016',
                monthHeading: '09',
                yearTmpl: '%s',
                months: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                dayTmpl: '%s'
            },
            selectable: '',
            marker: {},
            multipleSelect: false,
            onClick: function () {
                alert('success');
            },
            onStateChanged: function () {
                console.log('onStateChanged');
            }
        });

        if (
            (myCalendar.config.theme == 'info') &&
            (myCalendar.config.animateTime == 250) &&
            (myCalendar.config.dateFormat == 'yyyy-MM-dd') &&
            (myCalendar.config.selectMode == 'day') &&
            (myCalendar.config.displayDate == myDate) &&
            (myCalendar.config.lang.months[0] == 'January') &&
            (typeof myCalendar.config.onClick == 'function') &&
            (typeof myCalendar.config.onStateChanged == 'function') &&
            (myCalendar.config.multipleSelect == false)
        ) {
            done();
        } else {
            done("error setConfig");
        }
    });

    it('calendar changeMode', function (done) {
        myCalendar.changeMode("month");

        setTimeout(function () {
            done(myCalendar.config.mode == 'month' ? "" : "error changeMode");
        }, myCalendar.config.animateTime + 50);
    });

    it('calendar getSelection', function (done) {
        var select = myCalendar.getSelection();
        done(ax5.util.isArray(select) && select.length == 0 ? "" : "error getSelection");
    });

    it('calendar setSelection', function (done) {
        var today = ax5.util.date(myDate, {return: "yyyy-MM-dd"});
        myCalendar.setSelection([today]);
        var select = myCalendar.getSelection();
        done(ax5.util.isArray(select) && select[0] == today ? "" : "error setSelection");
    });

    it('calendar setSelectable[arr]', function (done) {
        myCalendar.setSelectable(myArr);
        done(ae.equalAll(myArr, Object.keys(myCalendar.selectableMap)));
    });

    it('calendar setSelectable[obj]', function (done) {
        var mySelectable = {};
        myArr.forEach(function (key) {
            mySelectable[key] = true;
        });
        myCalendar.setSelectable(mySelectable);
        done(ae.equalAll(mySelectable, myCalendar.selectableMap));
    });

    it('calendar setSelectable[range]', function (done) {
        myCalendar.setSelectable({
            range: [
                {from: _c_date(myDate, {'add': {d: -1}}), to: _c_date(myDate, {'add': {d: 1}})}
            ]
        });
        done(ae.equalAll(myArr, Object.keys(myCalendar.selectableMap)));
    });

    it('calendar setMarker[obj]', function (done) {
        var myMarker = {};
        myArr.forEach(function (key) {
            myMarker[key] = {theme: "holiday"};
        });
        myCalendar.setMarker(myMarker);
        done(ae.equalAll(myMarker, myCalendar.markerMap));
    });

    it('calendar setMarker[range]', function (done) {
        myCalendar.setMarker({
            range: [
                {from: _c_date(myDate, {'add': {d: -1}}), to: _c_date(myDate, {'add': {d: 1}}), theme: "holiday"}
            ]
        });
        done(ae.equalAll(myArr, Object.keys(myCalendar.markerMap)));
    });

    it('calendar setPeriod[range]', function (done) {
        myCalendar.changeMode("day");

        myCalendar.setPeriod({
            range: [
                {from: _c_date(myDate, {'add': {d: -1}}), to: _c_date(myDate, {'add': {d: 1}}), fromLabel: 'S', toLabel: 'E'}
            ]
        });
        done(
            ae.equalAll(myArr, Object.keys(myCalendar.periodMap))
            || ae.equalAll("S", myCalendar.periodMap[myArr[0]].label)
            || ae.equalAll("E", myCalendar.periodMap[myArr[2]].label)
        );
    });
        after(function () {
            $("#calendar-target").remove();
        });
});