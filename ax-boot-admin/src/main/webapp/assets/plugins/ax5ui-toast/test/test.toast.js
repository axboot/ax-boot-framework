describe('ax5.ui.toast TEST', function () {
    it('toast.push("message", callback)', function (done) {
        var message = 'Toast message';
        var toast = new ax5.ui.toast({
            containerPosition: 'top-right',
            displayTime: 0,
            animateTime: 0,
            onStateChanged: function () {
                var $toastEl = $('#' + this.toastId);
                if (this.state == 'open') {
                    $toastEl.find('.ax-toast-body').text().should.equal(message);
                } else if (this.state == 'close') {
                    should($toastEl.get(0)).undefined();
                    done();
                }
            }
        });

        toast.push(message, function () {
            should(this.toastId).String();
        });
    });

    it('toast.confirm("message", callback)', function (done) {
        var message = 'Toast message';
        var toast = new ax5.ui.toast({
            containerPosition: 'top-right',
            displayTime: 0,
            animateTime: 0,
            onStateChanged: function () {
                var $toastEl = $('#' + this.toastId);
                if (this.state == 'open') {
                    $toastEl.find('.ax-toast-body').text().should.equal(message);
                } else if (this.state == 'close') {
                    should($toastEl.get(0)).undefined();
                    done();
                }
            }
        });

        toast.confirm(message, function () {
            should(this.toastId).String();
        });

        setTimeout(function () {
            $('[data-ax-toast-btn="ok"]').click();
        }, 20);
    });
});

describe('ax5toast method TEST', function () {
    var that;
    var myUI;

    beforeEach(function () {
        myUI = new ax5.ui.toast({
            displayTime: 100,
            animateTime: 100,
            onStateChanged: function () {
                that = this;
            }
        });
    });

    afterEach(function () {
        myUI = null;
    });

    it('toast push open test', function (done) {
        myUI.push('message');
        done(
            ae.equalAll('message', that.self.queue[0].msg)
            || ae.equalAll('open', that.state)
        );
    });

    it('toast push close test', function (done) {
        myUI.push('message');
        setTimeout(function () {
            done(
                ae.equalAll(0, that.self.queue.length)
                || ae.equalAll('close', that.state)
            );
        }, myUI.config.animateTime + myUI.config.displayTime + 50);
    });

    it('toast confirm open test', function (done) {
        myUI.confirm('message');
        done(
            ae.equalAll('message', that.self.queue[0].msg)
            || ae.equalAll('open', that.state)
        );
    });

    it('toast confirm close test', function (done) {
        myUI.confirm('message');
        $('[data-ax-toast-btn="ok"]').click();
        setTimeout(function () {
            done(
                ae.equalAll(0, that.self.queue.length)
                || ae.equalAll('close', that.state)
            );
        }, myUI.config.animateTime + myUI.config.displayTime + 50);
    });

    it('toast close test', function (done) {
        myUI.confirm('message');
        myUI.close();
        setTimeout(function () {
            done(
                ae.equalAll(0, that.self.queue.length)
                || ae.equalAll('close', that.state)
            );
        }, myUI.config.animateTime + myUI.config.displayTime + 50);
    });
});