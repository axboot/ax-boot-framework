describe('formatter Money TEST', function () {
    before(function () {
        $('body').append(
            '<div class="form-group" id="ax5formatter-01">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Money</span>\n' +
            '        <input id="ax5formatter-001" name="1" type="text" class="form-control" placeholder data-ax5formatter="money" value="9999.99">\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="form-group">\n' +
            '    <div class="input-group" id="ax5formatter-01-1">\n' +
            '        <span class="input-group-addon">Money(int)</span>\n' +
            '        <input id="ax5formatter-002" name="2" type="text" class="form-control" placeholder data-ax5formatter="money(int)">\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="form-group">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Money</span>\n' +
            '        <input id="ax5formatter-003" name="2" type="text" class="form-control" placeholder="1,000,000" data-ax5formatter="money" data-ax5="formatter">\n' +
            '    </div>\n' +
            '</div>');
    });

    it('Formatter Money', function (done) {
        $('[data-ax5formatter]').ax5formatter();
        // TODO 값을 set 하면 안될 듯... HJ.Park 2016-09-30
        //$('#ax5formatter-002').val(1.23).blur().should.equal('1');

        var item1 = $('#ax5formatter-001').val() === '9,999.99';
        var item2 = $('#ax5formatter-003').val(3000).blur().val() === '3,000';
        done(item1 && item2 ? "" : "error formatter money");
    });

    after(function () {
        $('div.form-group').remove();
    });
});

describe('formatter Date TEST', function () {
    before(function () {
        $('body').append(
            '<div class="form-group">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Date</span>\n' +
            '        <input id="ax5formatter-004" name="3" type="text" class="form-control" placeholder="yyyy-mm-dd" data-ax5formatter="date">\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="form-group">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Date(time)</span>\n' +
            '        <input id="ax5formatter-005" name="3" type="text" class="form-control" placeholder="yyyy-mm-dd hh:mi:ss" data-ax5formatter="date(time)">\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="form-group">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Time</span>\n' +
            '        <input id="ax5formatter-006" name="3" type="text" class="form-control" placeholder="hh:mi:ss" data-ax5formatter="time">\n' +
            '    </div>\n' +
            '</div>');
    });

    it('Formatter Date', function (done) {
        $('[data-ax5formatter]').ax5formatter(done);
        var item1 = $('#ax5formatter-004').val('20160903').blur().val() === '2016-09-03';
        var item2 = $('#ax5formatter-005').val('20160903101010').blur().val() === '2016-09-03 10:10:10';
        var item3 = $('#ax5formatter-006').val('101010').blur().val() === '10:10:10';
        done(item1 && item2 && item3 ? "" : "error formatter date");
    });

    after(function () {
        $('div.form-group').remove();
    });
});

describe('formatter Time TEST', function () {
    before(function () {
        $('body').append(
            '<div class="form-group" id="ax5formatter-01">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Number</span>\n' +
            '        <input id="ax5formatter-001" name="1" type="text" class="form-control" placeholder data-ax5formatter="time" value="apple1234567890">\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="form-group">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Number</span>\n' +
            '        <input id="ax5formatter-002" name="2" type="text" class="form-control" data-ax5formatter="time" value="1234567890">\n' +
            '    </div>\n' +
            '</div>');
    });

    it('formatter Time', function (done) {
        $('[data-ax5formatter]').ax5formatter(done);
        var item1 = $('#ax5formatter-001').val('112233').blur().val() === '11:22:33';
        var item2 = $('#ax5formatter-002').val('010101').blur().val() === '01:01:01';
        done(item1 && item2 ? "" : "error formatter time");
    });

    after(function () {
        $('div.form-group').remove();
    });
});

describe('formatter Number TEST', function () {
    before(function () {
        $('body').append(
            '<div class="form-group" id="ax5formatter-01">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Number</span>\n' +
            '        <input id="ax5formatter-001" name="1" type="text" class="form-control" placeholder data-ax5formatter="number" value="apple1234567890">\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="form-group">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Number</span>\n' +
            '        <input id="ax5formatter-002" name="2" type="text" class="form-control" data-ax5formatter="number" value="1234567890">\n' +
            '    </div>\n' +
            '</div>');
    });

    it('formatter Number', function (done) {
        $('[data-ax5formatter]').ax5formatter(done);
        var item1 = $('#ax5formatter-001').val('apple20160903').blur().val() === '20160903';
        var item2 = $('#ax5formatter-002').val('orange20160903101010').blur().val() === '20160903101010';
        done(item1 && item2 ? "" : "error formatter number");
    });

    after(function () {
        $('div.form-group').remove();
    });
});

describe('formatter Phone TEST', function () {
    before(function () {
        $('body').append(
            '<div class="form-group" id="ax5formatter-01">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Money</span>\n' +
            '        <input id="ax5formatter-001" name="1" type="text" class="form-control" placeholder data-ax5formatter="phone" value="01012345678">\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="form-group">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Money</span>\n' +
            '        <input id="ax5formatter-002" name="2" type="text" class="form-control" placeholder="02-XXXX-XXXX" data-ax5formatter="phone" value="0212345678">\n' +
            '    </div>\n' +
            '</div>');
    });

    it('Formatter Phone', function (done) {
        $('[data-ax5formatter]').ax5formatter();
        var item1 = $('#ax5formatter-001').val() === '010-1234-5678';
        var item2 = $('#ax5formatter-002').val('0298765432').blur().val() === '02-9876-5432';
        done(item1 && item2 ? "" : "error formatter phone");
    });

    after(function () {
        $('div.form-group').remove();
    });
});

describe('formatter Bizno TEST', function () {
    before(function () {
        $('body').append(
            '<div class="form-group" id="ax5formatter-01">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Money</span>\n' +
            '        <input id="ax5formatter-001" name="1" type="text" class="form-control" placeholder data-ax5formatter="bizno" value="1234567890">\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="form-group">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Money</span>\n' +
            '        <input id="ax5formatter-002" name="2" type="text" class="form-control" placeholder="XXX-XX-XXXXX" data-ax5formatter="bizno" value="1234567890">\n' +
            '    </div>\n' +
            '</div>');
    });

    it('Formatter Bizno', function (done) {
        $('[data-ax5formatter]').ax5formatter();
        var item1 = $('#ax5formatter-001').val() === '123-45-67890';
        var item2 = $('#ax5formatter-002').val('0987654321').blur().val() === '098-76-54321';
        done(item1 && item2 ? "" : "error formatter bizno");
    });

    after(function () {
        $('div.form-group').remove();
    });
});

describe('formatter Credit TEST', function () {
    before(function () {
        $('body').append(
            '<div class="form-group" id="ax5formatter-01">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Money</span>\n' +
            '        <input id="ax5formatter-001" name="1" type="text" class="form-control" placeholder data-ax5formatter="credit" value="1234567891011121">\n' +
            '    </div>\n' +
            '</div>\n' +
            '<div class="form-group">\n' +
            '    <div class="input-group">\n' +
            '        <span class="input-group-addon">Money</span>\n' +
            '        <input id="ax5formatter-002" name="2" type="text" class="form-control" placeholder="XXXX-XXXX-XXXX-XXXX" data-ax5formatter="credit" value="12345678910111">\n' +
            '    </div>\n' +
            '</div>');
    });

    it('Formatter Credit', function (done) {
        $('[data-ax5formatter]').ax5formatter();
        var item1 = $('#ax5formatter-001').val() === '1234-5678-9101-1121';
        var item2 = $('#ax5formatter-002').val('0987654321098765').blur().val() === '0987-6543-2109-8765';
        done(item1 && item2 ? "" : "error formatter credit");
    });

    after(function () {
        $('div.form-group').remove();
    });
});

describe('formatter Custom TEST', function () {
    before(function () {
        $('body').append(
            '<div class="input-group">\n' +
            '<span class="input-group-addon">Custom</span>\n' +
            '<input name="3" type="text" class="form-control" placeholder data-ax5formatter-custom="01" value="a1b2c3d4e5f6">\n' +
            '</div>');
    });

    it('Formatter Custom', function (done) {
        $('[data-ax5formatter-custom="01"]').ax5formatter({
            pattern: "custom",
            getPatternValue: function (obj) {
                return obj.value.replace(/[\d]/g, "");
            }
        });
        var item1 = $('[data-ax5formatter-custom="01"]').val() === 'abcdef';
        var item2 = $('[data-ax5formatter-custom="01"]').val("123ab45c6d7e8f90").blur().val() === 'abcdef';
        done(item1 && item2 ? "" : "error formatter custom");
    });

    after(function () {
        $('div.form-group').remove();
    });
});