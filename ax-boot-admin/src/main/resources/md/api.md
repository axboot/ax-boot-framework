## Members

<dl>
<dt><a href="#axboot">axboot</a> : <code>Object</code></dt>
<dd></dd>
<dt><a href="#axMask">axMask</a> : <code>ax5ui</code></dt>
<dd><p>기본 마스크</p>
</dd>
<dt><a href="#axDialogMask">axDialogMask</a> : <code>ax5ui</code></dt>
<dd><p>다이얼로그용 마스크</p>
</dd>
<dt><a href="#axAJAXMask">axAJAXMask</a> : <code>ax5ui</code></dt>
<dd><p>ajax용 마스크</p>
</dd>
<dt><a href="#axModal">axModal</a> : <code>ax5ui</code></dt>
<dd><p>기본 모달</p>
</dd>
<dt><a href="#axDialog">axDialog</a> : <code>ax5ui</code></dt>
<dd></dd>
<dt><a href="#axWarningDialog">axWarningDialog</a> : <code>ax5ui</code></dt>
<dd></dd>
<dt><a href="#axToast">axToast</a> : <code>ax5ui</code></dt>
<dd></dd>
<dt><a href="#axWarningToast">axWarningToast</a> : <code>ax5ui</code></dt>
<dd></dd>
</dl>

<a name="axboot"></a>

## axboot : <code>Object</code>
**Kind**: global variable  

* [axboot](#axboot) : <code>Object</code>
    * [.def](#axboot.def) : <code>Object</code>
    * [.pageAutoHeight](#axboot.pageAutoHeight) : <code>Object</code>
    * [.modal](#axboot.modal)
        * [.open(modalConfig)](#axboot.modal.open)
        * [.css(modalCss)](#axboot.modal.css)
        * [.align(modalAlign)](#axboot.modal.align)
        * [.close()](#axboot.modal.close)
        * [.minimize()](#axboot.modal.minimize)
        * [.callback(data)](#axboot.modal.callback)
    * [.preparePlugin](#axboot.preparePlugin)
        * [.define()](#axboot.preparePlugin.define)
        * [.pageStart()](#axboot.preparePlugin.pageStart)
    * [.commonView](#axboot.commonView) : <code>Object</code>
    * [.init()](#axboot.init)
    * [.pageStart()](#axboot.pageStart)
    * [.pageResize()](#axboot.pageResize)
    * [.layoutResize()](#axboot.layoutResize)
    * [.ajax(http)](#axboot.ajax)
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
<a name="axboot.modal"></a>

### axboot.modal
**Kind**: static property of <code>[axboot](#axboot)</code>  
**Object**: <code>Object</code> axboot.modal  

* [.modal](#axboot.modal)
    * [.open(modalConfig)](#axboot.modal.open)
    * [.css(modalCss)](#axboot.modal.css)
    * [.align(modalAlign)](#axboot.modal.align)
    * [.close()](#axboot.modal.close)
    * [.minimize()](#axboot.modal.minimize)
    * [.callback(data)](#axboot.modal.callback)

<a name="axboot.modal.open"></a>

#### modal.open(modalConfig)
지정한 조건으로 ax5 modal을 엽니다. modalConfig 를 넘기지 않으면 지정된 기본값으로 엽니다.

**Kind**: static method of <code>[modal](#axboot.modal)</code>  

| Param | Type | Description |
| --- | --- | --- |
| modalConfig | <code>Object</code> |  |
| modalConfig.width | <code>Number</code> |  |
| modalConfig.height | <code>Number</code> |  |
| modalConfig.position | <code>Object</code> |  |
| modalConfig.position.left | <code>String</code> |  |
| modalConfig.position.top | <code>String</code> |  |
| modalConfig.iframeLoadingMsg | <code>String</code> |  |
| modalConfig.iframe.method | <code>String</code> |  |
| modalConfig.iframe.url | <code>String</code> |  |
| modalConfig.closeToEsc | <code>Boolean</code> |  |
| modalConfig.animateTime | <code>Number</code> |  |
| modalConfig.zIndex | <code>Number</code> |  |
| modalConfig.fullScreen | <code>Boolean</code> |  |
| modalConfig.header | <code>Object</code> |  |
| modalConfig.header.title | <code>String</code> |  |
| modalConfig.sendData | <code>function</code> | 모달창에서 parent.axboot.modal.getData() 하여 호출합니다. 전달하고 싶은 변수를 return 하면 됩니다 |
| modalConfig.callback | <code>function</code> | 모달창에서 parant.axboot.modal.callback() 으로 호출합니다. |

**Example**  
```js
 axboot.modal.open({
     width: 400,
     height: 400,
     header: false,
     iframe: {
         url: "open url"
         param: "param"
     },
     sendData: function(){

     },
     callback: function(){
         axboot.modal.close();
     }
 });
```
<a name="axboot.modal.css"></a>

#### modal.css(modalCss)
ax5 modal css 를 적용합니다.

**Kind**: static method of <code>[modal](#axboot.modal)</code>  

| Param |
| --- |
| modalCss | 

<a name="axboot.modal.align"></a>

#### modal.align(modalAlign)
ax5 modal을 정렬합니다.

**Kind**: static method of <code>[modal](#axboot.modal)</code>  

| Param |
| --- |
| modalAlign | 

<a name="axboot.modal.close"></a>

#### modal.close()
ax5 modal을 닫습니다.

**Kind**: static method of <code>[modal](#axboot.modal)</code>  
<a name="axboot.modal.minimize"></a>

#### modal.minimize()
ax5 modal을 최소화 합니다.

**Kind**: static method of <code>[modal](#axboot.modal)</code>  
<a name="axboot.modal.callback"></a>

#### modal.callback(data)
callback 으로 정의된 함수에 전달된 파라메터를 넘겨줍니다.

**Kind**: static method of <code>[modal](#axboot.modal)</code>  

| Param | Type |
| --- | --- |
| data | <code>Object</code> &#124; <code>String</code> | 

<a name="axboot.preparePlugin"></a>

### axboot.preparePlugin
**Kind**: static property of <code>[axboot](#axboot)</code>  
**Object**: <code>Object</code> axboot.preparePlugin  

* [.preparePlugin](#axboot.preparePlugin)
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

### axboot.ajax(http)
**Kind**: static method of <code>[axboot](#axboot)</code>  

| Param | Type |
| --- | --- |
| http | <code>Object</code> | 
| http.type | <code>String</code> | 
| http.url | <code>String</code> | 
| http.data | <code>Object</code> &#124; <code>String</code> | 
| http.callback | <code>function</code> | 
| [http.options] | <code>Object</code> | 
| [http.options.onError] | <code>function</code> | 
| [http.options.contentType] | <code>String</code> | 
| [http.options.apiType] | <code>String</code> | 

**Example**  
```js
 // 기본 에러가 나면 알어서 처리 함.
 axboot.ajax({
     type: "GET",
     url: "/api/v1/users",
     data : {},
     callback: function(response){
         // do something
     }
 });

 // onError 지정
 axboot.ajax({
     type: "GET",
     url: "/api/v1/users",
     data : {},
     callback: function(response){
         // do something
     },
     options: {
         onError: function(err){
             // console.log(err);
         }
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

## axMask : <code>ax5ui</code>
기본 마스크

**Kind**: global variable  
**Example**  
```js
appMask.open();
appMask.close();
appMask.close(1000); // 1초 지연 후 마스크 닫기
```
<a name="axDialogMask"></a>

## axDialogMask : <code>ax5ui</code>
다이얼로그용 마스크

**Kind**: global variable  
<a name="axAJAXMask"></a>

## axAJAXMask : <code>ax5ui</code>
ajax용 마스크

**Kind**: global variable  
<a name="axModal"></a>

## axModal : <code>ax5ui</code>
기본 모달

**Kind**: global variable  
<a name="axDialog"></a>

## axDialog : <code>ax5ui</code>
**Kind**: global variable  
<a name="axWarningDialog"></a>

## axWarningDialog : <code>ax5ui</code>
**Kind**: global variable  
<a name="axToast"></a>

## axToast : <code>ax5ui</code>
**Kind**: global variable  
**Example**  
```js
toast.push('Toast message', function () {
 // closed toast
 console.log(this);
});
```
<a name="axWarningToast"></a>

## axWarningToast : <code>ax5ui</code>
**Kind**: global variable  
