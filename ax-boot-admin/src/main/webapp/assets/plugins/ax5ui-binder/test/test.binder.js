/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5binder TEST', function () {
    var myUI;

    var tmpl = '<form class name="binder-form" onsubmit="return false;" style="border: 1px solid #ccc;padding: 10px;border-radius: 10px;">' +
        '<div class="form-group">' +
        '<label>Email address</label>' +
        '<input type="email" class="form-control" data-ax-path="email">' +
        '</div>' +
        '<div class="form-group">' +
        '<label>Password</label>' +
        '<input type="password" class="form-control" data-ax-path="password"></div>' +
        '<div class="form-group">' +
        '<label>Select</label>' +
        '<select class="form-control" data-ax-path="select"><option value></option><option value="A">A</option><option value="B">B</option></select></div>' +
        '<div class="checkbox"><label><input type="checkbox" data-ax-path="useYn" value="Y">Y/N</label></div>' +
        '<div class="radio"><label><input type="radio" name="radio" data-ax-path="sex" value="M">M</label>' +
        '<label><input type="radio" name="radio" data-ax-path="sex" value="F">F</label>' +
        '</div>' +
        '</form>';

    $(document.body).append(tmpl);

    ///
    it('new ax5binder', function (done) {
        try {
            myUI = new ax5.ui.binder();
            done();
        } catch (e) {
            done(e);
        }
    });

    it('setModel ax5binder', function (done) {
        myUI.setModel({
            email: "tom@axisj.com",
            password: "12345",
            select: "B",
            useYn: "Y",
            sex: "F"
        }, jQuery(document["binder-form"]));

        done(myUI.get("email") == "tom@axisj.com" ? "" : "setModel error");
    });

    it('set[select] ax5binder', function (done) {
        myUI.set("select", "A");
        done(myUI.get("select") == "A" ? "" : "set error");
    });

    it('set[checkbox] ax5binder', function (done) {
        myUI.set("useYn", "N");
        done(myUI.get("useYn") == "N" ? "" : "set error");
    });

    it('set[radio] ax5binder', function (done) {
        myUI.set("sex", "M");
        done(myUI.get("sex") == "M" ? "" : "set error");
    });

    it('onchange input value ax5binder', function (done) {
        jQuery('[data-ax-path="email"]')
            .val("brant")
            .trigger("change");

        done(myUI.get("email") == "brant" ? "" : "onchange input value");
    });

    it('focus ax5binder', function (done) {
        myUI.focus("email");
        done(document.querySelector('[data-ax-path="email"]') === document.activeElement ? "" : "focus error");
    });

    it('validate[required] ax5binder', function (done) {
        jQuery('[data-ax-path="email"]')
            .attr("data-ax-validate", "required")
            .val("")
            .trigger("change");

        done(myUI.validate().error[0].type == "required" ? "" : "validate error");
    });

    it('validate[pattern] ax5binder', function (done) {
        jQuery('[data-ax-path="email"]')
            .attr("data-ax-validate", "pattern")
            .attr("pattern", "[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
            .val("test@mail.")
            .trigger("change");

        done(myUI.validate().error[0].type == "pattern" ? "" : "validate error");
    });

    it('validate[email] ax5binder', function (done) {
        jQuery('[data-ax-path="email"]')
            .attr("data-ax-validate", "email")
            .val("test@mail.")
            .trigger("change");

        done(myUI.validate().error[0].type == "email" ? "" : "validate error");
    });
});

describe('Manipulate list item TEST', function () {
    var myUI;
    var tmpl = '<form class name="binder-list-form" onsubmit="return false;" style="border: 1px solid #ccc;padding: 10px;border-radius: 10px;">' +
        '<div data-ax-repeat="list">' +
        '<script type="text/html">' +
        '<input type="text" name="input-text" data-ax-item-path="A" />' +
        '</script>' +
        '</div>' +
        '</form>';

    $(document.body).append(tmpl);
    myUI = new ax5.ui.binder();
    myUI.setModel({
        "list": [{A: 1}, {A: 2}, {A: [{a: 1}, {a: 2}, {a: 3}]}]
    }, jQuery(document["binder-list-form"]));

    it('add ax5binder', function (done) {
        myUI.add("list", {A: 3});
        done(myUI.get("list[3][A]") === 3 && myUI.get("list[3]" + "__ADDED__") === true ? "" : "add error");
    });

    it('remove ax5binder', function (done) {
        myUI.remove("list", 1);
        done(myUI.get("list[1]" + "__DELETED__") === true ? "" : "remove error");
    });

    it('remove added item ax5binder', function (done) {
        myUI.add("list", {A: 3});
        myUI.remove("list", 3);
        done(myUI.get("list").length === 4 && myUI.get("list[3][A]") === 3 ? "" : "remove added item error");
    });

    it('update ax5binder', function (done) {
        myUI.update("list", 1, {A: 3});
        done(myUI.get("list[1][A]") === 3 ? "" : "update error");
    });

    it('childAdd ax5binder', function (done) {
        myUI.childAdd("list", 2, "A", {d: 4});
        done(myUI.get("list[2][A][3][d]") === 4 ? "" : "childAdd error");
    });

    it('childAdd ax5binder', function (done) {
        myUI.childAdd("list", 2, "A", {d: 4});
        done(myUI.get("list[2][A][3][d]") === 4 ? "" : "childAdd error");
    });

    it('childRemove ax5binder', function (done) {
        myUI.childRemove("list", 2, "A", 3);
        done(myUI.get("list[2][A]").length === 4 ? "" : "childRemove error");
    });

    it('childUpdate ax5binder', function (done) {
        myUI.childUpdate("list", 2, "A", 3, {d: 5});
        done(myUI.get("list[2][A][3][d]") === 5 ? "" : "childUpdate error");
    });

    it('childSet ax5ui', function (done) {
        myUI.childSet("list", 2, "A", [{a: 10}, {b: 20}]);
        done(myUI.get("list[2][A]").length === 2 && myUI.get("list[2][A][0][a]") === 10 ? "" : "childSet error");
    });
});