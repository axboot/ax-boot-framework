/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5menu TEST', function () {
    var myUI;

    var tmpl = '';

    $(document.body).append(tmpl);


    ///
    it('new ax5menu', function (done) {
        try {
            myUI = new ax5.ui.menu({
                position: "absolute", // default position is "fixed"
                icons: {
                    'arrow': '▸'
                },
                items: [
                    {
                        label: "Menu A",
                        items: [
                            {label: "Menu A-0"},
                            {label: "Menu A-1"},
                            {label: "Menu A-2"}
                        ]
                    },
                    {
                        label: "Menu B",
                        items: [
                            {label: "Menu B-0"},
                            {label: "Menu B-1"},
                            {label: "Menu B-2"}
                        ]
                    }
                ]
            });

            done();
        } catch (e) {
            done(e);
        }
    });


    it('popup menu', function (done) {
        myUI.popup({top: 0, left: 0});
        done(jQuery(".ax5-ui-menu").get(0) ? "" : "error popup");
    });


    it('close menu', function (done) {
        myUI.close();
        done(jQuery(".ax5-ui-menu").get(0) ? "error close" : "");
    });

});