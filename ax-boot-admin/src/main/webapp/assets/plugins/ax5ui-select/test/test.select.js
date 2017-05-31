/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5select TEST', function () {
    var myUI;
    var options = [];
    options.push({value: "1", text: "string"});
    options.push({value: "2", text: "number"});
    options.push({value: "3", text: "substr"});
    options.push({value: "4", text: "substring"});
    options.push({value: "search", text: "search"});
    options.push({value: "parseInt", text: "parseInt"});
    options.push({value: "toFixed", text: "toFixed"});
    options.push({value: "min", text: "min"});
    options.push({value: "max", text: "max"});

    var tmpl = '<div class="form-group">' +
        '<div data-ax5select="select1" data-ax5select-config="{}"></div>' +
        '</div>';

    $(document.body).append(tmpl);

    ///
    it('new ax5select', function (done) {
        try {
            myUI = new ax5.ui.select();
            done();
        } catch (e) {
            done(e);
        }
    });

    it('bind select', function (done) {
        myUI.bind({
            target: $('[data-ax5select="select1"]'),
            options: options,
            onChange: function () {

            },
            onStateChanged: function () {
            }
        });
        done();
    });

    after(function () {
        $('[data-ax5select="select1"]').remove();
    });
});

/* ax5.select.method... */
describe('ax5.ui.select method TEST', function () {
    var myUI = new ax5.ui.select();
    var that;

    before(function () {
        var options = [];
        options.push({value: "1", text: "string"});
        options.push({value: "2", text: "number"});
        options.push({value: "3", text: "substr"});
        options.push({value: "4", text: "substring"});
        options.push({value: "search", text: "search"});
        options.push({value: "parseInt", text: "parseInt"});
        options.push({value: "toFixed", text: "toFixed"});
        options.push({value: "min", text: "min"});
        options.push({value: "max", text: "max"});

        var tmpl = '<div class="form-group">' +
            '<div data-ax5select="select2" data-ax5select-config="{}"></div>' +
            '</div>';

        $(document.body).append(tmpl);

        myUI.bind({
            target: $('[data-ax5select="select2"]'),
            options: options,
            onChange: function () {

            },
            onStateChanged: function () {
                that = this;
            }
        });
    });

    it('select open test', function (done) {
        myUI.open($('[data-ax5select="select2"]'));
        done(ae.equalAll("open", that.state));
    });

    it('select close test', function (done) {
        myUI.close($('[data-ax5select="select2"]'));
        setTimeout(function () {
            done(ae.equalAll("close", that.state));
        }, myUI.config.animateTime);
    });

    it('select setValue / getValue', function (done) {
        myUI.val($('[data-ax5select="select2"]'), "3");
        var val = myUI.val($('[data-ax5select="select2"]'))[0];
        done(
            ae.equalAll("3", val.value)
            || ae.equalAll("substr", val.text)
        );
    });

    it('select update test', function (done) {
        myUI.update({
            target: $('[data-ax5select="select2"]'),
            theme: "danger",
            animateTime: 200,
            options:[
                {value: "A", text: "AMAZING"},
                {value: "B", text: "BEAUTIFUL"},
                {value: "C", text: "CREATIVE"}
            ]
        });
        done(
            ae.equalAll("danger", myUI.queue[0].theme)
            || ae.equalAll(200, myUI.queue[0].animateTime)
        );
    });

    it('select disable test', function (done) {
        myUI.disable($('[data-ax5select="select2"]'));
        done(
            ae.equalAll("disabled", myUI.queue[0].$display.attr("disabled"))
            || ae.equalAll("disabled", myUI.queue[0].$select.attr("disabled"))
        );
    });

    it('select enable test', function (done) {
        myUI.enable($('[data-ax5select="select2"]'));
        done(
            ae.equalAll("undefined", typeof myUI.queue[0].$display.attr("disabled"))
            || ae.equalAll("undefined", typeof myUI.queue[0].$select.attr("disabled"))
        );
    });

    it('select setOptions test', function (done) {
        var myOptions = [
            {value: "+", text: "addition"},
            {value: "-", text: "subtraction"},
            {value: "*", text: "multiplication"},
            {value: "/", text: "division"}
        ];
       myUI.setOptions($('[data-ax5select="select2"]'), myOptions);
       done(ae.equalAll(myOptions, myUI.queue[0].options));
    });

    after(function () {
        $('[data-ax5select="select2"]').remove();
    });
});

describe('multiple ax5.ui.select method TEST', function () {
    var myUI = new ax5.ui.select();

    before(function () {
        var options = [];
        options.push({value: "1", text: "string"});
        options.push({value: "2", text: "number"});
        options.push({value: "3", text: "substr"});
        options.push({value: "4", text: "substring"});
        options.push({value: "search", text: "search"});
        options.push({value: "parseInt", text: "parseInt"});
        options.push({value: "toFixed", text: "toFixed"});
        options.push({value: "min", text: "min"});
        options.push({value: "max", text: "max"});

        var tmpl = '<form name="select-form">' +
            '<div class="form-group">' +
            '<div data-ax5select="select3" data-ax5select-config="{}"></div>' +
            '</div>' +
            '</form>';

        $(document.body).append(tmpl);

        myUI.bind({
            target: $('[data-ax5select="select3"]'),
            multiple: true,
            options: options
        });
    });

    it('select multiple setValue / getValue', function (done) {
        myUI.val($('[data-ax5select="select3"]'), ["3", "4"], true);
        var val = myUI.val($('[data-ax5select="select3"]'));

        done(
            ae.equalAll("select3=3&select3=4", $(document["select-form"]).serialize())
            || ae.equalAll("3", val[0].value)
            || ae.equalAll("substr", val[0].text)
            || ae.equalAll("4", val[1].value)
            || ae.equalAll("substring", val[1].text)
        );
    });

    after(function () {
        $(document["select-form"]).remove();
    });
});