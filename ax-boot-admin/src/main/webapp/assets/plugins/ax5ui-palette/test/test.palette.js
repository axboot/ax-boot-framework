/* 
 test.calendar.js
 TODO event test
 */

/* ax5.calendar.setConfig */
describe('ax5.palette TEST', function () {
    var myPalette;
    var tmpl = '<div data-ax5palette="01" style="' +
        'width:300px;"></div>';

    $(document.body).append(tmpl);

    it('check palette type', function (done) {
        done(typeof new ax5.ui.palette() == "object" ? "" : "check type error");
    });

    it('palette setConfig', function (done) {
        myPalette = new ax5.ui.palette();
        myPalette.setConfig({
            target: $('[data-ax5palette="01"]'),
            onClick: function () {
                alert('success');
            }
        });

            done();
    });
});