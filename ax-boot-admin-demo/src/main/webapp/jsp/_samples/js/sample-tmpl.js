var RESIZE_ELEMENTS = [

];

/**
 * ACTIONS
 */
var ACTIONS = $.extend(app.ACTIONS, {
    PAGE_SEARCH: 'PAGE_SEARCH'
});

/**
 * CODE
 */
var CODE = app.CODE({
    "etc3": [
        {CD: '1', NM: "코드"},
        {CD: '2', NM: "CODE"},
        {CD: '4', NM: "VA"}
    ]
});

var fnObj = {
    dispatch: function (caller, act, data) {
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                app.net.ajax({type: "GET", url: "/api/v1/samples/parent", data: data}, function (res) {
                    ACTIONS.dispatch(null, ACTIONS.RECEIVE_LIST, res);
                });
                break;

            case ACTIONS.RECEIVE_LIST:
                data = {"summary":{"totalAmt":1290665400,"saleAmt":1163579335,"vatAmt":116347105,"saleTot":1279926440,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"amtCleanO":1280488250,"amtCleanX":1164089895,"monCnt":0},"detailOfEachPayMethod":{"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"tranHeaderSum":1290665400,"tranHeaderCnt":159140,"tranCashSum":602112750,"tranCashCnt":86423,"tranCardSum":638267510,"tranCardCnt":72507,"tranEtcSum":39546180,"tranEtcCnt":5586,"tranDcSum":10882572,"tranDcCnt":13554},"detailOfCreditCard":[{"aproAmt":154043120,"cardNm":"외환","cnt":17614,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"buyCardCd":"08"},{"aproAmt":162543018,"cardNm":"비씨","cnt":17549,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"buyCardCd":"01"},{"aproAmt":99641762,"cardNm":"신한","cnt":12222,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"buyCardCd":"02"},{"aproAmt":81493150,"cardNm":"KB국민","cnt":9970,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"buyCardCd":"07"},{"aproAmt":51606640,"cardNm":"삼성","cnt":5690,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"buyCardCd":"03"},{"aproAmt":38996330,"cardNm":"현대","cnt":4237,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"buyCardCd":"04"},{"aproAmt":29459400,"cardNm":"롯데","cnt":3041,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"buyCardCd":"05"},{"aproAmt":20497120,"cardNm":"농협","cnt":2180,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"buyCardCd":"12"}],"detailOfForeignCurrency":[{"cnt":7087,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"excCd":"01","excNm":"USD","excEamt":42495.7,"excWamt":48388788,"excInEamt":54911,"excInWamt":62526100,"monCnt":0},{"cnt":127,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"excCd":"02","excNm":"EUR","excEamt":964,"excWamt":1201100,"excInEamt":1502,"excInWamt":1870700,"monCnt":0},{"cnt":1030,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"excCd":"03","excNm":"JPY","excEamt":835852.39,"excWamt":7846820,"excInEamt":1320961,"excInWamt":12399330,"monCnt":0},{"cnt":1059,"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"excCd":"04","excNm":"CNY","excEamt":43851.48,"excWamt":7860760,"excInEamt":56376,"excInWamt":10106030,"monCnt":0}],"detailOfDiscount":{"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"rateDcCnt":698,"rateDcSum":558390,"notRateDcSum":10346492,"notRateDcCnt":12866,"monCnt":0},"detailOfChanges":{"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"excRefundWamt":21604690,"etcRefundamt":709760,"monCnt":0},"detailOfTranCloseCash":{"compSortOrder":0,"monSortOrder":0,"compMonSortOrder":0,"yearSortOrder":0,"compYearSortOrder":0,"compCnt":0,"compMonCnt":0,"yearCnt":0,"compYearCnt":0,"monCnt":0,"closeCashAmt":315001,"computeCashAmt":321980,"excessAmt":-6979}};
                this.tmplView0.setData(data);

                var data1 = [{"deleted":false,"created":false,"modified":false,"userCd":"cardiokwh@eulji.ac.kr","firstName":"Won Ho","lastName":"Kim","nameInKorea":"김원호","programList":[{"deleted":false,"created":false,"modified":false,"progDate":"2016-02-16","progStTime":"08:10","progEndTime":"09:55","subTitle":"심지어 저장이 잘 되다니.","delYn":"N","useYn":"Y","roles":"MODERATOR","dataStatus":"ORIGIN"}],"id":"cardiokwh@eulji.ac.kr","dataStatus":"ORIGIN"},{"deleted":false,"created":false,"modified":false,"userCd":"yongseongs@paran.com","firstName":"Jae Bin","lastName":"Seo","nameInKorea":"서재빈","programList":[{"deleted":false,"created":false,"modified":false,"progDate":"2016-02-16","progStTime":"08:10","progEndTime":"09:55","subTitle":"심지어 저장이 잘 되다니.","delYn":"N","useYn":"Y","roles":"SPEAKER, OPERATOR","dataStatus":"ORIGIN"}],"id":"yongseongs@paran.com","dataStatus":"ORIGIN"},{"deleted":false,"created":false,"modified":false,"userCd":"yumtong001@hanmail.net","firstName":"Dae Kyoung","lastName":"Cho","nameInKorea":"조대경","programList":[{"deleted":false,"created":false,"modified":false,"progDate":"2016-02-16","progStTime":"08:10","progEndTime":"09:55","subTitle":"심지어 저장이 잘 되다니.","delYn":"N","useYn":"Y","roles":"OPERATOR","dataStatus":"ORIGIN"}],"id":"yumtong001@hanmail.net","dataStatus":"ORIGIN"},{"deleted":false,"created":false,"modified":false,"userCd":"95650@snubh.org","firstName":"Kyung Kwon","lastName":"Lee","nameInKorea":"이경권 (변호사)","programList":[{"deleted":false,"created":false,"modified":false,"progDate":"2016-02-16","progStTime":"08:10","progEndTime":"09:55","subTitle":"심지어 저장이 잘 되다니.","delYn":"N","useYn":"Y","roles":"MODERATOR","dataStatus":"ORIGIN"}],"id":"95650@snubh.org","dataStatus":"ORIGIN"},{"deleted":false,"created":false,"modified":false,"userCd":"yangthmd@naver.com","firstName":"Tae Hyun","lastName":"Yang","nameInKorea":"양태현","programList":[{"deleted":false,"created":false,"modified":false,"progDate":"2016-02-16","progStTime":"08:10","progEndTime":"09:55","subTitle":"심지어 저장이 잘 되다니.","delYn":"N","useYn":"Y","roles":"OPERATOR","dataStatus":"ORIGIN"}],"id":"yangthmd@naver.com","dataStatus":"ORIGIN"},{"deleted":false,"created":false,"modified":false,"userCd":"bovio@naver.com","firstName":"Sang Yong","lastName":"Yoo","nameInKorea":"유상용","programList":[{"deleted":false,"created":false,"modified":false,"progDate":"2016-02-16","progStTime":"08:10","progEndTime":"09:55","subTitle":"심지어 저장이 잘 되다니.","delYn":"N","useYn":"Y","roles":"MODERATOR","dataStatus":"ORIGIN"}],"id":"bovio@naver.com","dataStatus":"ORIGIN"},{"deleted":false,"created":false,"modified":false,"userCd":"alpha10000@yuhs.ac","firstName":"Yong-Joon","lastName":"Lee","nameInKorea":"이용준","programList":[{"deleted":false,"created":false,"modified":false,"progDate":"2016-02-16","progStTime":"08:10","progEndTime":"09:55","subTitle":"심지어 저장이 잘 되다니.","delYn":"N","useYn":"Y","roles":"MODERATOR","dataStatus":"ORIGIN"}],"id":"alpha10000@yuhs.ac","dataStatus":"ORIGIN"},{"deleted":false,"created":false,"modified":false,"userCd":"angio2000@anmail.net","firstName":"Yonh Hui","lastName":"Park","nameInKorea":"박용휘","programList":[{"deleted":false,"created":false,"modified":false,"progDate":"2016-02-16","progStTime":"08:10","progEndTime":"09:55","subTitle":"심지어 저장이 잘 되다니.","delYn":"N","useYn":"Y","roles":"MODERATOR","dataStatus":"ORIGIN"}],"id":"angio2000@anmail.net","dataStatus":"ORIGIN"}];
                this.tmplView1.setData(data1);
                break;

            default:

                return false;
        }
        // 만약 원한다면 this.stores 를 순환 하면서 일괄 액션을 처리 하자.
    }
};

/**
 * pageStart
 */
fnObj.pageStart = function () {
    this.toolbarView.initView();
    this.searchView0.initView();
    this.tmplView0.initView();
    this.tmplView1.initView();

    ACTIONS.dispatch(this, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());

    return false;
};

/**
 * toolbarView
 */
fnObj.toolbarView = {
    initView: function () {

        $("#ax-page-btn-search").bind("click", function () {
            ACTIONS.dispatch(this, ACTIONS.PAGE_SEARCH, fnObj.searchView0.getData());
        });

        $("#ax-page-btn-save").bind("click", function () {
            // 저장
            ACTIONS.dispatch(this, ACTIONS.PAGE_SAVE, fnObj.gridView0.getData());
        });

        $("#ax-page-btn-excel").bind("click", function () {
            // 엑셀
        });

        $("#ax-page-btn-fn1").bind("click", function () {
            // 삭제
        });
    }
};

/**
 * searchView#0
 */
fnObj.searchView0 = {
    startDate: $('#startDate'),
    endDate: $('#endDate'),
    radioBox: $('[data-ax-id="radioBox"]'),
    checkBox: $('[data-ax-id="checkBox"]'),
    comboBox: $('#comboBox'),
    searchParams: $('#searchParams'),
    singleDate: $('#singleDate'),
    autoCompleteCode: $('#autoCompleteCode'),
    autoComplete: $('#autoComplete'),

    initView: function () {
        $("#page-search-view").attr("onsubmit", '$("#ax-page-btn-search").trigger("click");return false;');

        var
            today = new Date(),
            _this = this
            ;

        // bind script;
        this.endDate.bindTwinDate({
            startTargetID: "startDate"
        });

        this.startDate.val(today.print());
        this.endDate.val(today.print());

        this.singleDate
            .bindDate()
            .val(today.print());

        this.comboBox
            .bindSelect();

        this.autoComplete
            .bindSelector({
                appendable: true,
                options: [
                    {optionValue: 1, optionText: "Seoul"},
                    {optionValue: 2, optionText: "대구"},
                    {optionValue: 3, optionText: "대전"},
                    {optionValue: 4, optionText: "(창원"},
                    {optionValue: 5, optionText: "[마산"},
                    {optionValue: 6, optionText: "구례"},
                    {optionValue: 7, optionText: "제주도"},
                    {optionValue: 8, optionText: "전주"},
                    {optionValue: 4, optionText: "창원"},
                    {optionValue: 5, optionText: "마산"},
                    {optionValue: 6, optionText: "구례"},
                    {optionValue: 7, optionText: "제주도"},
                    {optionValue: 8, optionText: "전주"},
                    {optionValue: 9, optionText: "Gwangju"}
                ],
                onchange: function () {
                    if (this.selectedOption) {
                        _this.autoCompleteCode.val(this.selectedOption.optionValue);
                    }
                }
            });

        // ACTIONS.registStore([this, this.onChange]);
    },
    getData: function () {
        return {
            startDate: this.startDate.val(),
            endDate: this.endDate.val(),
            radioBox: this.radioBox.filter(":checked").val(),
            checkBox: (function () {
                var vals = [];
                this.checkBox.filter(":checked").each(function () {
                    vals.push(this.value);
                });
                return vals.join(',');
            }).call(this),
            comboBox: this.comboBox.val(),
            searchParams: this.searchParams.val(),
            singleDate: this.singleDate.val(),
            autoCompleteCode: this.autoCompleteCode.val(),
            autoComplete: this.autoComplete.val()
        };
    },
    onChange: function () {

    }
};

/**
 * tmplView0
 */
fnObj.tmplView0 = {
    initView: function(){
        this.tmpl = $('[data-tmpl="report-tmpl"]').html();
        this.target = $('#page-tmpl-view0');
    },
    setData: function(data){

        data.compNM_storNm = "테스트 데이터";
        data.toDayTime = (new Date()).print("yyyy-mm-dd hh:mi");

        data._f_date = function () {
            return function (text, render) {
                return render(text).date().print("yyyy년 mm월 dd일");
            }
        };

        data._f_money = function () {
            return function (text, render) {
                return (render(text) || 0).number().money();
            }
        };

        if (data.detailOfTranCloseCash) {
            data.detailOfTranCloseCash.__computeCashAmt = data.detailOfTranCloseCash.closeCashAmt - (((data.detailOfChanges) ? data.detailOfChanges.etcRefundamt : 0) || 0);
        }

        this.target.html(Mustache.render(this.tmpl, data));

    }
};


/**
 * tmplView1
 */
fnObj.tmplView1 = {
    initView: function(){
        this.tmpl = $('[data-tmpl="role-table"]').html();
        this.target = $('#page-tmpl-view1');
        this.timeset = (function () {
            var array = [];
            var time = new Date(2016, 2, 15, 7, 0);
            var stDtTime = (new Date(2016, 2, 15, 7, 0)).getTime();
            var endDtTime = (new Date(2016, 2, 15, 21, 0)).getTime();
            for (var _d = stDtTime; _d <= endDtTime; _d = _d + (1000 * 60 * 10)) {
                var __d = new Date(_d),
                    hour = __d.getHours().setDigit(2) + ":" + __d.getMinutes().setDigit(2),
                    display = hour;
                array.push({hour: hour, display: display});
            }
            return array;
        })();
    },
    setData: function(data){
        var _this = this;
        var obj = {
            timeset: this.timeset,
            list: data,
            '@printTime': function () {
                var returns = [];
                var programList = this.programList;
                _this.timeset.forEach(function (t) {
                    var i = programList.length,
                        pn, timeMark = false;
                    while (i--) {
                        pn = programList[i];
                        if (pn.progStTime <= t.hour && pn.progEndTime >= t.hour) {
                            timeMark = {
                                progStTime: pn.progStTime,
                                progEndTime: pn.progEndTime,
                                label: (function () {
                                    var ds = (pn.progStTime.number() - t.hour.number()), de = (pn.progEndTime.number() - t.hour.number());
                                    if (ds >= 0 && ds < 10) {
                                        return pn.progStTime;
                                    }
                                    else if (de >= 0 && de < 10) {
                                        return pn.progEndTime;
                                    }
                                    else{
                                        return "~";
                                    }
                                })()
                            };
                            break;
                        }
                    }

                    returns.push({
                        '@val': timeMark
                    });
                });

                return returns;
            }
        };
        this.target.html(Mustache.render(this.tmpl, app.tmpl.extendFn(obj)));
    }
};