/*
 * Copyright (c) 2017. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

describe('ax5mediaViewer TEST', function () {
    var myUI;

    var tmpl = '<div id="media-viewer-target-0" style="width:360px;border:1px solid #eee;"></div>';

    $(document.body).append(tmpl);

    ///
    it('new ax5mediaViewer', function (done) {
        try {
            myUI = new ax5.ui.mediaViewer();

            done();
        } catch (e) {
            done(e);
        }
    });

    it('setConfig menu', function (done) {
        myUI.setConfig({
            target: $("#media-viewer-target-0"),
            loading: {
                icon: '<i class="fa fa-spinner fa-pulse fa-2x fa-fw margin-bottom" aria-hidden="true"></i>',
                text: '<div>Now Loading</div>'
            },
            media: {
                prevHandle: '<i class="fa fa-chevron-left"></i>',
                nextHandle: '<i class="fa fa-chevron-right"></i>',
                width: 50, height: 50,
                poster: '<i class="fa fa-youtube-play" style="line-height: 46px;font-size: 20px;"></i>',
                list: [
                    {
                        video: {
                            html: '<iframe src="https://player.vimeo.com/video/121840700?color=fcfcfc&badge=0" frameborder="0"></iframe>',
                            poster: ''
                        }
                    },
                    {
                        video: {
                            html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/w9Uh2oP88JI" frameborder="0"></iframe>',
                            poster: ''
                        }
                    },
                    {
                        image: {
                            src: 'http://www.improgrammer.net/wp-content/uploads/2015/11/top-20-node-js-Frameworks-1.jpg',
                            poster: 'http://www.improgrammer.net/wp-content/uploads/2015/11/top-20-node-js-Frameworks-1.jpg'
                        }
                    },
                    {
                        image: {
                            src: 'https://www.twilio.com/blog/wp-content/uploads/2013/11/Screen-Shot-2013-11-06-at-12.05.36-PM.png',
                            poster: 'https://www.twilio.com/blog/wp-content/uploads/2013/11/Screen-Shot-2013-11-06-at-12.05.36-PM.png'
                        }
                    },
                    {
                        image: {
                            src: "http://blog.axisj.com/wp-content/uploads/2015/01/603962_624552737612025_1617687293_n.jpg",
                            poster: "http://blog.axisj.com/wp-content/uploads/2015/01/603962_624552737612025_1617687293_n.jpg"
                        }
                    },
                    {
                        image: {
                            src: "http://brantiffy.axisj.com/wp-content/uploads/2015/12/Screen-Shot-2015-12-11-at-2.01.53-AM.png",
                            poster: "http://brantiffy.axisj.com/wp-content/uploads/2015/12/Screen-Shot-2015-12-11-at-2.01.53-AM.png"
                        }
                    }
                ]
            },
            onClick: function () {
                console.log(this);
            }
        });

        done(jQuery('[data-ax5-ui-media-viewer]').get(0) ? "" : "error setConfig");
    });

    it('select ax5mediaViewer', function (done) {
        myUI.select(1);
        done($('[data-media-thumbnail="1"]').hasClass("selected") ? "" : "error select");
    });

    it('setMediaList ax5mediaViewer', function (done) {
        myUI.setMediaList([
            {
                video: {
                    html: '<iframe src="https://player.vimeo.com/video/121840700?color=fcfcfc&badge=0" frameborder="0"></iframe>',
                    poster: ''
                }
            },
            {
                video: {
                    html: '<iframe width="560" height="315" src="https://www.youtube.com/embed/w9Uh2oP88JI" frameborder="0"></iframe>',
                    poster: ''
                }
            }]);
        done(myUI.config.media.list.length == 2 ? "" : "error setMediaList");
    });

    after(function () {
        $("#media-viewer-target-0").remove();
    });

});