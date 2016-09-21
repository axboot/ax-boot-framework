## Members

<dl>
<dt><a href="#axboot">axboot</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#axMask">axMask</a></dt>
<dd><p>기본 마스크</p>
</dd>
<dt><a href="#axDialogMask">axDialogMask</a></dt>
<dd><p>다이얼로그용 마스크</p>
</dd>
<dt><a href="#axAJAXMask">axAJAXMask</a></dt>
<dd><p>ajax용 마스크</p>
</dd>
<dt><a href="#axModal">axModal</a></dt>
<dd><p>기본 모달</p>
</dd>
<dt><a href="#axDialog">axDialog</a></dt>
<dd></dd>
<dt><a href="#axWarningDialog">axWarningDialog</a></dt>
<dd></dd>
<dt><a href="#axToast">axToast</a></dt>
<dd></dd>
<dt><a href="#axWarningToast">axWarningToast</a></dt>
<dd></dd>
</dl>

<a name="axboot"></a>

## axboot : <code>Object</code>
**Kind**: global variable  

* [axboot](#axboot) : <code>Object</code>
    * [.def](#axboot.def) : <code>Object</code>
    * [.pageAutoHeight](#axboot.pageAutoHeight) : <code>Object</code>
    * [.done](#axboot.done) : <code>Object</code>
    * [.preparePlugin](#axboot.preparePlugin) : <code>Object</code>
        * [.define()](#axboot.preparePlugin.define)
        * [.pageStart()](#axboot.preparePlugin.pageStart)
    * [.commonView](#axboot.commonView) : <code>Object</code>
    * [.init()](#axboot.init)
    * [.pageStart()](#axboot.pageStart)
    * [.pageResize()](#axboot.pageResize)
    * [.layoutResize()](#axboot.layoutResize)
    * [.ajax(http, callBack, [options])](#axboot.ajax)
    * [.gridBuilder(_config)](#axboot.gridBuilder)
    * [.extend(_obj1, _obj2)](#axboot.extend)
    * [.actionExtend([_actionThis], _action)](#axboot.actionExtend)

<a name="axboot.def"></a>

### axboot.def : <code>Object</code>
axboot의 환경 변수 저장 공간

**Kind**: static property of <code>[axboot](#axboot)</code>  
**Example**  
```js
axboot.def.menuHeight = 20;
// 와 같이 원하는 속성을 저장 / 사용 할 수 있다.
```
<a name="axboot.pageAutoHeight"></a>

### axboot.pageAutoHeight : <code>Object</code>
**Kind**: static property of <code>[axboot](#axboot)</code>  
<a name="axboot.done"></a>

### axboot.done : <code>Object</code>
axboot.done

**Kind**: static property of <code>[axboot](#axboot)</code>  
**Example**  
```js
axboot
   .done({
       type: "GET", url: "/api/v1/programs", data: "",
       then: function (res) {
           var programList = [];
           res.list.forEach(function (n) {
               programList.push({
                   value: n.progCd, text: n.progNm + "(" + n.progCd + ")",
                   progCd: n.progCd, progNm: n.progNm,
                   data: n
               });
           });
           obj.programList = programList;
       }
   })
   .done({
       type: "GET", url: "/api/v1/commonCodes", data: {groupCd: "AUTH_GROUP", useYn: "Y"},
       then: function (res) {
           var authGroup = [];
           res.list.forEach(function (n) {
               authGroup.push({
                   value: n.code, text: n.name + "(" + n.code + ")",
                   grpAuthCd: n.code, grpAuthNm: n.name,
                   data: n
               });
           });
           obj.authGroup = authGroup;
       }
   })
   .end(function () {
       _this.pageButtonView.initView();
       _this.searchView.initView();
       _this.treeView01.initView();
       _this.formView01.initView(obj);
       _this.gridView01.initView();

       ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
   });
```
<a name="axboot.preparePlugin"></a>

### axboot.preparePlugin : <code>Object</code>
axboot.preparePlugin

**Kind**: static property of <code>[axboot](#axboot)</code>  

* [.preparePlugin](#axboot.preparePlugin) : <code>Object</code>
    * [.define()](#axboot.preparePlugin.define)
    * [.pageStart()](#axboot.preparePlugin.pageStart)

<a name="axboot.preparePlugin.define"></a>

#### preparePlugin.define()
js가 실행되는 타임. 페이지 레디 전에 미리 선언 하는 경우

**Kind**: static method of <code>[preparePlugin](#axboot.preparePlugin)</code>  
<a name="axboot.preparePlugin.pageStart"></a>

#### preparePlugin.pageStart()
페이지가 레디된 다음 선언하는 경우.
경우에 따라 페이지가 준비완료 상태일 때 선언해야하는 플러그인을 위해.

**Kind**: static method of <code>[preparePlugin](#axboot.preparePlugin)</code>  
<a name="axboot.commonView"></a>

### axboot.commonView : <code>Object</code>
각 뷰에 원형

**Kind**: static property of <code>[axboot](#axboot)</code>  
<a name="axboot.init"></a>

### axboot.init()
**Kind**: static method of <code>[axboot](#axboot)</code>  
<a name="axboot.pageStart"></a>

### axboot.pageStart()
**Kind**: static method of <code>[axboot](#axboot)</code>  
<a name="axboot.pageResize"></a>

### axboot.pageResize()
**Kind**: static method of <code>[axboot](#axboot)</code>  
<a name="axboot.layoutResize"></a>

### axboot.layoutResize()
**Kind**: static method of <code>[axboot](#axboot)</code>  
<a name="axboot.ajax"></a>

### axboot.ajax(http, callBack, [options])
**Kind**: static method of <code>[axboot](#axboot)</code>  

| Param | Type |
| --- | --- |
| http | <code>Object</code> | 
| callBack | <code>function</code> | 
| [options] | <code>Object</code> | 
| [options.onError] | <code>Fundtion</code> | 
| [options.contentType] | <code>String</code> | 
| [options.apiType] | <code>String</code> | 

**Example**  
```js
 // 기본 에러가 나면 알어서 처리 함.
 axboot.ajax({
     type: "GET",
     url: "/api/v1/users",
     data : {}
 }, function(response){
     // do something
 });

 // onError 지정
 axboot.ajax({
     type: "GET",
     url: "/api/v1/users",
     data : {}
 }, function(response){
     // do something
 }, {
     onError: function(err){
         // console.log(err);
     }
 });
```
<a name="axboot.gridBuilder"></a>

### axboot.gridBuilder(_config)
**Kind**: static method of <code>[axboot](#axboot)</code>  

| Param | Type |
| --- | --- |
| _config | <code>Object</code> | 

**Example**  
```js
this.target = axboot.gridBuilder({
   showLineNumber: false,
   showRowSelector: false,
   frozenColumnIndex: 0,
   target: $('[data-ax5grid="grid-view-01"]'),
   columns: [
       //menuId
       {key: "grpAuthCd", label: "권한그룹코드", width: 80, align: "center"},
       {key: "grpAuthNm", label: "권한그룹명", width: 160, align: "left"},
       {key: "useYn", label: "권한적용", editor: "checkYn"},
       {key: "schAh", label: "조회", width: 50, align: "center", editor: "menu-program-auth-checkYn"},
       /// --> 이것들을 list로 담아서  [PUT] "/api/v2/menu/auth"
   ],
   body: {
       onClick: function () {
           // this.self.select(this.dindex);
       }
   }
});
```
<a name="axboot.extend"></a>

### axboot.extend(_obj1, _obj2)
1, 2를 믹스한 새로운 오브젝트를 반환

**Kind**: static method of <code>[axboot](#axboot)</code>  

| Param |
| --- |
| _obj1 | 
| _obj2 | 

<a name="axboot.actionExtend"></a>

### axboot.actionExtend([_actionThis], _action)
페이지에서 사용하는

**Kind**: static method of <code>[axboot](#axboot)</code>  

| Param | Type |
| --- | --- |
| [_actionThis] | <code>Object</code> | 
| _action | <code>Object</code> | 

**Example**  
```js
var ACTION = axboot.actionExtend(fnObj, {
 PAGE_SEARCH: "PAGE_SEARCH",
 dispatch: function(caller, act, data){
     switch (act) {
         case ACTIONS.PAGE_SEARCH:
             // call view method
         break;
         default
             return false;
     }
 }
});

// 액션의 실행
fnObj.sampleView = axboot.viewExtend({
 initView: function(){
     ACTIONS.dispatch(ACTIONS.PAGE_SEARCH);
 }
});
```
<a name="axMask"></a>

## axMask
기본 마스크

**Kind**: global variable  
**Example**  
```js
appMask.open();
appMask.close();
appMask.close(1000); // 1초 지연 후 마스크 닫기
```
<a name="axDialogMask"></a>

## axDialogMask
다이얼로그용 마스크

**Kind**: global variable  
<a name="axAJAXMask"></a>

## axAJAXMask
ajax용 마스크

**Kind**: global variable  
<a name="axModal"></a>

## axModal
기본 모달

**Kind**: global variable  
<a name="axDialog"></a>

## axDialog
**Kind**: global variable  
<a name="axWarningDialog"></a>

## axWarningDialog
**Kind**: global variable  
<a name="axToast"></a>

## axToast
**Kind**: global variable  
**Example**  
```js
toast.push('Toast message', function () {
 // closed toast
 console.log(this);
});
```
<a name="axWarningToast"></a>

## axWarningToast
**Kind**: global variable  
