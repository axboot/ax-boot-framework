/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5layout TEST', function () {
    var tmpl = '<div data-ax5layout="ax1" data-config="{layout:\'dock-panel\'"}" style="height: 500px;border:1px solid #ccc;">' +
        '<div data-dock-panel="{dock:\'top\', split:true, height: 100, maxHeight: 300}" style="text-align: center;"><h4>TOP</h4></div>' +
        '<div data-dock-panel="{dock:\'bottom\', split:"true", height: 100, minHeight: 10, maxHeight: 300}" style="text-align: center;"><h4>BOTTOM</h4></div>' +
        '<div data-dock-panel="{dock:\'left\', split:true, width: 100, minWidth: 10, maxWidth: 300}"><h4>LEFT</h4></div>' +
        '<div data-dock-panel="{dock:\'right\', split:true, width: 100, minWidth: 10, maxWidth: 300}"><h4>RIGHT</h4></div>' +
        '<div data-dock-panel="{dt' +
        'ock:\'center\'}" style="padding: 5px;text-align: center;">' +
        '<h4>CENTER</h4>' +
        '</div>' +
        '</div>';

    $(document.body).append(tmpl);
    ///
    it('bind ax5layout', function (done) {
        jQuery('[data-ax5layout="ax1"]').ax5layout();
        done(ax5.ui.layout_instance.queue.length == 1 ? "" : "bind layout error");
    });

    after(function () {
        jQuery('[data-ax5layout="ax1"]').remove();
    });
});

describe('ax5layout method TEST', function () {
    var myUI;
    var tmpl;
    var that;

    before(function () {
        myUI = new ax5.ui.layout();
        tmpl = '<div data-ax5layout="ax1" data-config="{layout:\'dock-panel\'"}" style="height: 500px;border:1px solid #ccc;">' +
            '<div data-dock-panel="{dock:\'top\', split:true, height: 100, maxHeight: 300}" style="text-align: center;"><h4>TOP</h4></div>' +
            '<div data-dock-panel="{dock:\'bottom\', split:"true", height: 100, minHeight: 10, maxHeight: 300}" style="text-align: center;"><h4>BOTTOM</h4></div>' +
            '<div data-dock-panel="{dock:\'left\', split:true, width: 100, minWidth: 10, maxWidth: 300}"><h4>LEFT</h4></div>' +
            '<div data-dock-panel="{dock:\'right\', split:true, width: 100, minWidth: 10, maxWidth: 300}"><h4>RIGHT</h4></div>' +
            '<div data-dock-panel="{dock:\'center\'}" style="padding: 5px;text-align: center;">' +
            '<h4>CENTER</h4>' +
            '</div>' +
            '</div>';

        $(document.body).append(tmpl);
    });

    it('bind ax5layout', function (done) {
        myUI.bind({
            target: $('[data-ax5layout="ax1"]'),
            layout: "dock-panel",
            onResize: function () {
                that = this;
            }
        });
        done(ax5.ui.layout_instance.queue.length == 1 ? "" : "bind layout error");
    });

    it('resize ax5layout', function (done) {
        myUI.resize($('[data-ax5layout="ax1"]'), {top: 20, bottom: 30, left: 50, right: 70});
        setTimeout(function () {
            done(
                ae.equalAll(20, that.dockPanel.top.__height)
                || ae.equalAll(50, that.dockPanel.left.__width)
                || ae.equalAll(70, that.dockPanel.right.__width)
            );
        }, myUI.config.animateTime);
    });

    it('onResize ax5layout', function (done) {
        myUI.onResize($('[data-ax5layout="ax1"]'), function () { that = "onResize"; })
            .resize($('[data-ax5layout="ax1"]'), {top: 20, bottom: 30, left: 50, right: 70});

        setTimeout(function () {
            done(ae.equalAll("onResize", that));
        }, myUI.config.animateTime);
    });

    it('reset ax5layout', function (done) {
        myUI.reset($('[data-ax5layout="ax1"]'))
            .onResize($('[data-ax5layout="ax1"]'), function () { that = this; });

        setTimeout(function () {
            done(
                ae.equalAll(100, that.dockPanel.top.__height)
                || ae.equalAll(100, that.dockPanel.left.__width)
                || ae.equalAll(100, that.dockPanel.right.__width)
            );
        }, myUI.config.animateTime);
    });

    after(function () {
       jQuery('[data-ax5layout="ax1"]').remove();
    });
});