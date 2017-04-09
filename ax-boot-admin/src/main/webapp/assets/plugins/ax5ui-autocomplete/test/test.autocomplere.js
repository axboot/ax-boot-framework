describe('ax5autocomplete TEST', function () {
    var myUI;

    var tmpl = '<div class="form-group">' +
        '<div data-ax5autocomplete="ui1" data-ax5autocomplete-config="{}"></div>' +
        '</div>';

    var options = [];
    options.push({value: "1", text: "string"});
    options.push({value: "2", text: "number"});
    options.push({value: "3", text: "substr"});
    options.push({value: "4", text: "substring"});
    options.push({value: "5", text: "search"});
    options.push({value: "6", text: "parseInt"});
    options.push({value: "7", text: "toFixed"});
    options.push({value: "8", text: "min"});
    options.push({value: "9", text: "max"});
    options.push({value: "10", text: "장기영"});
    options.push({value: "11", text: "장서우"});
    options.push({value: "12", text: "이영희"});
    options.push({value: "13", text: "황인서"});
    options.push({value: "14", text: "황세진"});
    options.push({value: "15", text: "이서연"});
    options.push({value: "16", text: "액시스제이"});
    options.push({value: "17", text: "ax5"});
    options.push({value: "18", text: "ax5grid"});
    options.push({value: "19", text: "ax5combobox"});
    options.push({value: "20", text: "ax5autocomplete"});
    options.push({value: "21", text: "ax5binder"});
    options.push({value: "22", text: "ax5select"});
    options.push({value: "23", text: "ax5mask"});
    options.push({value: "24", text: "ax5toast"});
    options.push({value: "25", text: "ax5dialog"});
    options.push({value: "26", text: "ax5modal"});

    $(document.body).append(tmpl);


    ///
    it('new autocomplete', function (done) {
        try {
            myUI = new ax5.ui.autocomplete({
                theme: "danger"
            });
            done();
        } catch (e) {
            done(e);
        }
    });

    it('bind autocomplete', function (done) {
        myUI.bind({
            target: $('[data-ax5autocomplete="ui1"]'),
            options: options,
            onStateChanged: function () {
                //console.log(this);
            }
        });

        done(
            myUI.queue.length == 1 ? "" : "error bind"
        );
    });

    it('setValue & getSelectedOption autocomplete', function (done) {
        myUI.setValue($('[data-ax5autocomplete="ui1"]'), {value: "25", text: "ax5dialog"});
        var values = myUI.getSelectedOption($('[data-ax5autocomplete="ui1"]'));

        done(
            values[0].value == "25" ? "" : "error setValue"
        );
    });

    it('setText & getSelectedOption autocomplete', function (done) {
        myUI.setText($('[data-ax5autocomplete="ui1"]'), "ax5select");
        var values = myUI.getSelectedOption($('[data-ax5autocomplete="ui1"]'));

        done(
            values[0].value == "ax5select" ? "" : "error setValue"
        );
    });

    it('disable autocomplete', function (done) {
        myUI.disable($('[data-ax5autocomplete="ui1"]'));
        done(myUI.queue[0].$display.attr("disabled") === "disabled" ? "" : "error disable");
    });

    it('enable autocomplete', function (done) {
        myUI.enable($('[data-ax5autocomplete="ui1"]'));
        done(typeof myUI.queue[0].$display.attr("disabled") === "undefined" ? "" : "error enable");
    });

    it('open autocomplete', function (done) {
        myUI.open($('[data-ax5autocomplete="ui1"]'));
        done(myUI.queue[0].$display.attr("data-autocomplete-option-group-opened") === "true" ? "" : "error open");
    });

    it('close autocomplete', function (done) {
        myUI.close($('[data-ax5autocomplete="ui1"]'));
        done(typeof myUI.queue[0].$display.attr("data-autocomplete-option-group-opened") === "undefined" ? "" : "error close");
    });
});