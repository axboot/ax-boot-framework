describe('dialog Alert TEST', function(){
    var dialog;
    var that;
    beforeEach(function(){
        dialog = new ax5.ui.dialog({
            title: "AX5 Dialog",
            animateTime: 10,
            onStateChanged: function () {
                that = this;
            }
        });
    });

    var shouldClosed = function(dialog, assertMessage, done){
        setTimeout(function(){
            var dialogDom = $('#' + dialog.config.id).get(0);
            // close check
            should(dialogDom).Undefined(assertMessage);
            that.state.should.equal('close');
            done();
        }, dialog.config.animateTime + 10);
    }

    it('Basic Alert expect open, close', function(done){
        dialog.alert('Alert message', function(){
            shouldClosed(dialog, 'dialog close fail.', done);
        });

        console.log(that);
        // open check
        //dialog.activeDialog.attr('data-ax5-ui').should.equal('dialog', 'dialog open fail.');
        that.state.should.equal('open');
        dialog.close();
    });

    it('Basic Alert expect open, close by click event', function(done){
        dialog.alert('Alert message', function(){
            shouldClosed(dialog, 'dialog close by click event fail.', done);
        });

        // open check
        //dialog.activeDialog.attr('data-ax5-ui').should.equal('dialog', 'dialog open fail.');
        that.state.should.equal('open');

        // close click event fire
        dialog.activeDialog.find('[data-dialog-btn="ok"]').click();
    });
});


describe('dialog Confirm TEST', function(){
    var dialog;
    var that;
    beforeEach(function(){
        dialog = new ax5.ui.dialog({
            title: "AX5 Confirm",
            animateTime: 10,
            onStateChanged: function () {
                that = this;
            }
        });
    });

    var shouldClosed = function(dialog, assertMessage, done){
        setTimeout(function(){
            var dialogDom = $('#' + dialog.config.id).get(0);
            // close check
            should(dialogDom).Undefined(assertMessage);

            that.state.should.equal('close');
            done();
        }, dialog.config.animateTime + 10);
    }

    describe('dialog Confirm Basic Usages TEST', function(){
        it('ok button click expect "ok"', function(done){
            dialog.confirm('confirm ok', function(){
                should(this.key).equal("ok");
                shouldClosed(dialog, 'dialog close fail.', done);
            });

            // open check
            //dialog.activeDialog.attr('data-ax5-ui').should.equal('dialog', 'dialog open fail.');
            that.state.should.equal('open');
            dialog.activeDialog.find('[data-dialog-btn="ok"]').click(); // ok click event fire
        });

        it('cancel button click expect "cancel"', function(done){
            dialog.confirm('Confirm cancel', function(){
                should(this.key).equal("cancel");
                shouldClosed(dialog, 'dialog close fail.', done);
            });

            // open check
            //dialog.activeDialog.attr('data-ax5-ui').should.equal('dialog', 'dialog open fail.');
            that.state.should.equal('open');
            dialog.activeDialog.find('[data-dialog-btn="cancel"]').click(); // cancel click event fire
        });
    });

    describe('dialog Confirm Custom Buttons TEST', function(){
        it('Custom Buttons expect Delete, Cancel, Other', function(done){
            dialog.confirm({
                msg: 'Confirm message',
                btns: {
                    del: {
                        label:'Delete', theme:'warning', onClick: function(key){
                            should(key).equal('del');
                            dialog.close();
                        }
                    },
                    cancel: {
                        label:'Cancel', onClick: function(key){
                            should(key).equal('cancel');
                            dialog.close();
                        }
                    },
                    other: {
                        label:'Other', onClick: function(key){
                            should(key).equal('other');
                            dialog.close();
                        }
                    }
                }
            }, function(key){
                shouldClosed(dialog, 'dialog close fail.', done);
            });

            // open check
            //dialog.activeDialog.attr('data-ax5-ui').should.equal('dialog', 'dialog open fail.');
            that.state.should.equal('open');
            dialog.activeDialog.find('[data-dialog-btn="del"]').click(); // del click event fire
        });
    });
});


describe('dialog Prompt TEST', function() {
    it('Prompt Basic Usages value expect test1', function(done) {
        var data1 = 'test1';
        var dialog = new ax5.ui.dialog();
        dialog.setConfig({
            title: "XXX",
            theme: "danger"
        });

        dialog.prompt({
            title: "Confirm Title",
            msg: 'Confirm message'
        }, function(){
            should.equal(this.value, data1);

            done();
        });

        dialog.activeDialog.find('input[data-dialog-prompt="value"]').val(data1);

        dialog.activeDialog.find('button[data-dialog-btn="ok"]').trigger('click');
    });

    it('Prompt Custom Input value expect test2, test3', function(done) {
        var data1 = "test2";
        var data2 = "test3";
        var dialog = new ax5.ui.dialog();

        dialog.prompt({
            theme: 'info',
            title: 'Custom Prompt test',
            msg: 'data1, data2',
            input: {
                data1: {label: "data1의 라벨"},
                data2: {label: "data2의 라벨"}
            }
        }, function () {
            var inputValue1 = this.data1;
            var inputValue2 = this.data2;

            inputValue1.should.equal(data1);
            inputValue2.should.equal(data2);

            done();
        });

        dialog.activeDialog.find('input[data-dialog-prompt="data1"]').val(data1);
        dialog.activeDialog.find('input[data-dialog-prompt="data2"]').val(data2);

        dialog.activeDialog.find('button[data-dialog-btn="ok"]').trigger('click');
    });
});
