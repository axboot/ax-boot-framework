/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5picker TEST', function () {
    var myUI;
    var tmpl;

    beforeEach(function () {
        tmpl = '<div class="input-group" data-ax5picker="basic">' +
            '<input type="text" class="form-control" placeholder>' +
            '<span class="input-group-addon"><i class="fa fa-calculator"></i></span>' +
            '</div>';
        $(document.body).append(tmpl);
    });

    afterEach(function () {
        $('[data-ax5picker="basic"]').remove();
    });

    ///
    it('new ax5picker', function (done) {
        try {
            myUI = new ax5.ui.picker();
            done();
        } catch (e) {
            done(e);
        }
    });

    it('bind select', function (done) {
        myUI.bind({
            target: $('[data-ax5picker="basic"]'),
            direction: "top",
            contentWidth: 280,
            content: function (callBack) {
                var html = ''
                        + '<form style="padding:0 5px;">'
                        + '<div class="form-group">'
                        + '<label for="exampleInputWidth">Width</label>'
                        + '<input type="number" class="form-control" id="exampleInputWidth" placeholder="width" value="10">'
                        + '</div>'
                        + '<div class="form-group">'
                        + '<label for="exampleInputHeight">Height</label>'
                        + '<input type="number" class="form-control" id="exampleInputHeight" placeholder="height" value="10">'
                        + '</div>'
                        + '</form>'
                    ;
                callBack(html);
            },
            onStateChanged: function () {
                if (this.state == "open") {
                    // ..
                    console.log(this);
                }
            },
            btns: {
                ok: {
                    label: "Calculate", theme: "btn-primary", onClick: function () {
                        //console.log(this);
                        var w = this.item.pickerContent.find("#exampleInputWidth").val() || 1;
                        var h = this.item.pickerContent.find("#exampleInputHeight").val() || 1;
                        this.self.setContentValue(this.item.id, 0, w * h);
                        this.self.close();

                    }
                }
            }
        });
        done();
    });

    it('bind select type [date]', function (done) {
        myUI.bind({
            target: $('[data-ax5picker="basic"]'),
            direction: "top",
            content: {
                width: 270,
                margin: 10,
                type: 'date',
                config: {
                    control: {
                        left: '<i class="fa fa-chevron-left"></i>',
                        yearTmpl: '%s',
                        monthTmpl: '%s',
                        right: '<i class="fa fa-chevron-right"></i>'
                    },
                    lang: {
                        yearTmpl: "%s년",
                        months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
                        dayTmpl: "%s"
                    }
                },
                formatter: {
                    pattern: 'date'
                }
            },
            onStateChanged: function () {

            }
        });
        done(ae.equalAll("date", myUI.queue[1].content.type));
    });

    it('bind select type [secure-num]', function (done) {
        myUI.bind({
            target: $('[data-ax5picker="basic"]'),
            direction: "top",
            content: {
                width: 200,
                margin: 10,
                type: 'secure-num',
                config: {
                    btnWrapStyle: "padding:3px;width:25%;",
                    btnStyle: "width:100%",
                    btnTheme: "info btn-sm",
                    specialBtnTheme: " btn-sm"
                },
                formatter: {
                    pattern: 'number'
                }
            },
            onStateChanged: function () {
                if (this.state == "open") {
                    this.item.target.val('');
                }
                else {
                    if (this.value && this.value.length > 3) {
                        picker.close();
                    }
                }
            }
        });
        done(ae.equalAll("secure-num", myUI.queue[2].content.type));
    });

    it('bind select type [keyboard]', function (done) {
        myUI.bind({
            target: $('[data-ax5picker="basic"]'),
            direction: "auto",
            content: {
                width: 550,
                margin: 10,
                type: 'keyboard',
                config: {
                    btnWrapStyle: "padding:2px;",
                    btnStyle: "width: 35px;",
                    btnTheme: "primary",
                    specialBtnWrapStyle: "padding:2px;",
                    specialBtnStyle: "",
                    specialBtnTheme: " "
                }
            },
            onStateChanged: function () {
            }
        });
        done(ae.equalAll('keyboard', myUI.queue[3].content.type));
    });

    it('bind select type [numpad]', function (done) {
        myUI.bind({
            target: $('[data-ax5picker="basic"]'),
            direction: "auto",
            content: {
                width: 200,
                margin: 10,
                type: 'numpad',
                config: {
                    btnWrapStyle: "padding:3px;width:25%;",
                    btnStyle: "width:100%",
                    btnTheme: "primary",
                    specialBtnWrapStyle: "padding:3px;width:25%;",
                    specialBtnStyle: "width:100%;padding-left:0px;padding-right:0px;",
                    specialBtnTheme: ""
                },
                formatter: {
                    pattern: 'number'
                }
            },
            onStateChanged: function () {
            }
        });
        done(ae.equalAll('numpad', myUI.queue[4].content.type));
    });
});

describe('ax5picker method TEST', function () {
    var myUI;
    var tmpl;
    var that;

    before(function () {
        myUI = new ax5.ui.picker();
        tmpl = '<div class="input-group" data-ax5picker="basic2">' +
            '<input type="text" class="form-control" placeholder>' +
            '<span class="input-group-addon"><i class="fa fa-calculator"></i></span>' +
            '</div>';

        $(document.body).append(tmpl);

        myUI.bind({
            target: $('[data-ax5picker="basic2"]'),
            theme: 'default',
            direction: "auto",
            content: {
                width: 200,
                margin: 10,
                type: 'numpad',
                config: {
                    btnWrapStyle: "padding:3px;width:25%;",
                    btnStyle: "width:100%",
                    btnTheme: "primary",
                    specialBtnWrapStyle: "padding:3px;width:25%;",
                    specialBtnStyle: "width:100%;padding-left:0px;padding-right:0px;",
                    specialBtnTheme: ""
                },
                formatter: {
                    pattern: 'number'
                }
            },
            onStateChanged: function () {
                that = this;
            }
        });
    });

    it('picker open test', function (done) {
        myUI.open($('[data-ax5picker="basic2"]'));
        done(ae.equalAll("open", that.state));
    });

    it('picker close test', function (done) {
        myUI.close($('[data-ax5picker="basic2"]'));
        setTimeout(function () {
            done(ae.equalAll("close", that.state));
        }, myUI.config.animateTime);
    });

    it('picker setContentValue', function (done) {
        myUI.setContentValue($('[data-ax5picker="basic2"]'), 0, 10);
        done(
            ae.equalAll("changeValue", that.state)
            || ae.equalAll(10, that.value)
            || ae.equalAll(0, that.inputIndex)
        );
    });

    after(function () {
        $('[data-ax5picker="basic2"]').remove();
    });
});