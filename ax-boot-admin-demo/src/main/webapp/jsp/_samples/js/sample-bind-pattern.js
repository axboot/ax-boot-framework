var RESIZE_ELEMENTS = [];

/**
 * ACTIONS
 */
var ACTIONS = $.extend(app.ACTIONS, {
    PAGE_SEARCH: 'PAGE_SEARCH'
});

var fnObj = {
    dispatch: function (caller, act, data) {
        switch (act) {
            case ACTIONS.PAGE_SEARCH:
                fnObj.searchView0.validate();
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
    yyyy: $("#yyyy"),
    yyyymm: $("#yyyymm"),
    yyyymmdd: $("#yyyymmdd"),

    startdd: $("#startdd"),
    enddd: $("#enddd"),
    startmm: $("#startmm"),
    endmm: $("#endmm"),
    startyy: $("#startyy"),
    endyy: $("#endyy"),

    startdd2: $("#startdd2"),
    enddd2: $("#enddd2"),
    startmm2: $("#startmm2"),
    endmm2: $("#endmm2"),
    startyy2: $("#startyy2"),
    endyy2: $("#endyy2"),

    number: $("#number"),
    number2: $("#number2"),
    phone: $("#phone"),
    bizno: $("#bizno"),
    money: $("#money"),
    money2: $("#money2"),

    btnDisabled: $("#btnDisabled"), // 비활성화
    btnDisabled2: $("#btnDisabled2"), // 비활성화2

    validator: new AXValidator(), // AXValidator 선언

    initView: function () {
        $("#page-search-view").attr("onsubmit", '$("#ax-page-btn-search").trigger("click");return false;');

        var
            today = new Date(),
            nextMonth = today.add(1, 'm'); // 1달후
        nextYear = today.add(1, 'y'); // 1년후
        tomorrow = today.add(1); // 내일

        _this = this
        ;

        // 날짜(년도)
        this.yyyy.bindDate({
            selectType: 'y'
        }).val(today.print('yyyy'));

        // 날짜(년월)
        this.yyyymm.bindDate({
            selectType: 'm'
        }).val(today.print('yyyy-mm'));

        // 날짜(년월일)
        this.yyyymmdd.bindDate({
            selectType: 'd',
            separator: '.' // separator로 지정 가능.
        }).val(today.print('yyyy.mm.dd'));
        /*
         bindDate config object
         {
         align            :"right", // {String} ("left"|"center"|"right") 달력에서 input text 의 위치
         valign           :"top",   // {String} ("top"|"middle"|"bottom") 달력에서 input text 의 위치
         separator        : "-",    // {String} 날짜형식 표시 구분 문자열
         selectType       : "d",    // {String} ("y"|"m"|"d") 날짜선택범위 y 를 지정하면 년도만 선택됩니다.
         defaultSelectType: "d",    // {String} ("y"|"m"|"d") 달력컨트롤의 년월일 선택도구 중에 먼저 보이는 도구타입
         defaultDate      : "",     // {String} ("yyyy[separator]mm[separator]dd") 날짜 형식의 문자열로 빈값의 달력 기준일을 설정합니다. 지정하지 않으면 시스템달력의 오늘을 기준으로 합니다.
         minDate          : "",     // {String} ("yyyy[separator]mm[separator]dd") 날짜 형식의 문자열로 선택할 수 있는 최소일을 설정합니다.
         maxDate          : "",     // {String} ("yyyy[separator]mm[separator]dd") 날짜 형식의 문자열로 선택할 수 있는 최대일을 설정합니다.
         onBeforeShowDay  : {}      // {Function} 날짜를 보여주기 전에 호출하는 함수. date를 파라미터로 받으며 다음과 같은 형식의 Object를 반환해야 한다. { isEnable: true|false, title:'성탄절', className: 'holyday', style: 'color:red' }
         onchange: function(){      // {Function} 값이 변경되었을 때 발생하는 이벤트 콜백함수
         trace(this);
         }
         */

        // 기간
        this.startdd.val(today.print('yyyy-mm-dd'));
        this.enddd.val(tomorrow.print('yyyy-mm-dd'));
        this.enddd.bindTwinDate({
            startTargetID: "startdd",
            selectType: 'd', // 기본값
            onChange: function () {
                console.log(this);
            }
        });

        // 기간(월)
        this.startmm.val(today.print('yyyy-mm'));
        this.endmm.val(nextMonth.print('yyyy-mm'));
        this.endmm.bindTwinDate({
            startTargetID: "startyy",
            selectType: 'm' // 월
        });

        // 기간(년도)
        this.startyy.val(today.print('yyyy'));
        this.endyy.val(nextYear.print('yyyy'));
        this.endyy.bindTwinDate({
            startTargetID: "startyy",
            selectType: 'y' // 년도
        });

//
        // 기간2
        this.startdd2.val(today.print('yyyy-mm-dd'));
        this.enddd2.val(tomorrow.print('yyyy-mm-dd'));
        this.startdd2.bindDate({
            onchange: {
                earlierThan: "enddd2", err: "종료일보다 빠른 날짜를 선택하세요"
            }
        });
        this.enddd2.bindDate({
            onchange: {
                laterThan: "startdd2", err: "시작일보다 느린 날짜를 선택하세요"
            }
        });

        // 기간2(월)
        this.startmm2.val(today.print('yyyy-mm'));
        this.endmm2.val(nextMonth.print('yyyy-mm'));
        this.startmm2.bindDate({
            selectType: 'm', // 월
            onchange: {
                earlierThan: "endmm2", err: "종료일보다 빠른 날짜를 선택하세요"
            }
        });
        this.endmm2.bindDate({
            selectType: 'm', // 월
            onchange: {
                laterThan: "startmm2", err: "시작일보다 느린 날짜를 선택하세요"
            }
        });

        // 기간2(년도)
        this.startyy2.val(today.print('yyyy'));
        this.endyy2.val(nextYear.print('yyyy'));
        this.startyy2.bindDate({
            selectType: 'y', // 월
            onchange: {
                earlierThan: "endyy2", err: "종료일보다 빠른 날짜를 선택하세요"
            }
        });
        this.endyy2.bindDate({
            selectType: 'y', // 월
            onchange: {
                laterThan: "startyy2", err: "시작일보다 느린 날짜를 선택하세요"
            }
        });

        this.number.bindNumber(/*config object*/).val(0);
        /*
         bindNumber config object
         { // config object
         min: 1,   // {Number} [min=Number.MIN_VALUE] - 최소값 (optional)
         max: 100, // {Number} [max=Number.MAX_VALUE] - 최대값 (optional)
         onchange: function()   { // {Function} - 값이 변경되었을 때 이벤트 콜백함수 (optional)
         trace(this);
         }
         }
         */

        this.number2.val(123.45);
        this.number2.bindPattern({
            pattern: "number",
            allow_minus: true, // 음수 포함
            max_length: 5, // 최대길이(소수점 포함)
            max_round: 2 // 소수점 최대 길이
        });

        // 전화번호
        this.phone.val("01012341234");
        this.phone.bindPattern({
            pattern: "phone"
        });

        // 사업자번호
        this.bizno.bindPattern({
            pattern: "bizno"
        });

        // 통화
        this.money.val(1000000);
        this.money.bindMoney();
        this.money.bindPattern({
            pattern: "moneyint", // 소수점 포함 안함
            max_length: 7 // 최대길이
        });

        // 통화2
        this.money2.val(100000.123);
        this.money2.bindMoney();
        this.money2.bindPattern({
            pattern: "money",
            allow_minus: true,
            max_length: 9, // 최대길이(소수점 포함)
            max_round: 3 // 소수점 최대 길이
        });

        // disabled // bindNumber, bindDate 등에 사용.
        this.btnDisabled.bind("click", function () {
            _this.money.bindInputDisabled(!_this.money.attr("disabled"));
        });
        // disabled // 일반 Input에 사용.
        this.btnDisabled2.bind("click", function () {
            _this.phone.attr("disabled", !_this.phone.attr("disabled"));
        });

        // 유효성 검사 환경 설정
        this.validator.setConfig({
            "targetFormName": "page-search-view"
            // 이후 각 엘리먼트에 아래 클래스 정의
            // av-required
            // av-bizno
            // av-email
            // av-phone
            // av-isdate
            // av-zip
            // av-number 등.
        });

        // ACTIONS.registStore([this, this.onChange]);
    },
    validate: function () {
        var validateResult = this.validator.validate();
        if (!validateResult) {
            var msg = this.validator.getErrorMessage();
            AXUtil.alert(msg);
            this.validator.getErrorElement().focus();
            return false;
        } else {
            alert(validateResult);
        }
    }
    ,
    getData: function () {
        return {};
    },
    onChange: function () {

    }
};