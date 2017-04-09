<a name="ax5binder"></a>

## ax5binder
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5binder](#ax5binder)
    * [.setModel(model, [view_target])](#ax5binder.setModel) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.set(dataPath, value)](#ax5binder.set) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.get(dataPath)](#ax5binder.get) ⇒ <code>\*</code>
    * [.onChange(dataPath, callback)](#ax5binder.onChange) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.onClick(dataPath, callback)](#ax5binder.onClick) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.add(dataPath, item)](#ax5binder.add) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.remove(dataPath, index)](#ax5binder.remove) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.update(dataPath, index, item)](#ax5binder.update) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.childAdd(dataPath, index, child_path, child_item)](#ax5binder.childAdd)
    * [.childUpdate(dataPath, index, child_path, child_index, child_item)](#ax5binder.childUpdate)
    * [.childSet(dataPath, index, child_path, value)](#ax5binder.childSet) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.onUpdate(dataPath, callback)](#ax5binder.onUpdate) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.focus(dataPath)](#ax5binder.focus) ⇒ <code>[ax5binder](#ax5binder)</code>
    * [.validate()](#ax5binder.validate) ⇒ <code>\*</code>

<a name="ax5binder.setModel"></a>

### ax5binder.setModel(model, [view_target]) ⇒ <code>[ax5binder](#ax5binder)</code>
바인딩할 자바스크립트 오브젝트로 제이쿼리로 검색된 HTML dom 엘리먼트 에 바인딩합니다. 바인딩된 모델을 반환합니다.

**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param | Type |
| --- | --- |
| model | <code>Object</code> | 
| [view_target] | <code>jQueryObject</code> | 

**Example**  
```js
var myModel = new ax5.ui.binder();
myModel.setModel({}, $("#..."));
```
<a name="ax5binder.set"></a>

### ax5binder.set(dataPath, value) ⇒ <code>[ax5binder](#ax5binder)</code>
data_path에 값을 변경한다. value의 타입은 (String, Number, Array, Object)를 지원.

**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param | Type |
| --- | --- |
| dataPath | <code>String</code> | 
| value | <code>Object</code> | 

**Example**  
```js
myModel.set("name", "Seowoo");
myModel.set("obj.path", {a:1});
```
<a name="ax5binder.get"></a>

### ax5binder.get(dataPath) ⇒ <code>\*</code>
data_path에 값을 반환한다. data_path 가 없으면 전체 Object를 반환한다.

**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 

<a name="ax5binder.onChange"></a>

### ax5binder.onChange(dataPath, callback) ⇒ <code>[ax5binder](#ax5binder)</code>
data_path에 값이 변경되는 이벤트 발생하면 callback을 실행합니다.

**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 
| callback | 

**Example**  
```js
myModel.onChange("name", function () {
      console.log(this);
      // el: domElement - 변경이 발생한 엘리먼트, 엘리먼트로 부터 다양한 속성을 추출할 수 있다.
      // jquery : jQueryObject
      // tagname: "input"
      // value: "changed value"
      console.log(this.el.id);
  });
  myModel.onChange("*", function (n) {
      console.log(n);
      // console.log(this); 와 동일
  });
```
<a name="ax5binder.onClick"></a>

### ax5binder.onClick(dataPath, callback) ⇒ <code>[ax5binder](#ax5binder)</code>
data-ax-repeat="list" 속성이 부여된 엘리먼트 하위에 태그중에 data-ax-repeat-click 속성을 가진 아이템에 대해 클릭 이벤트 발생하면 callback을 실행합니다.

**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 
| callback | 

**Example**  
```js
myModel.onclick("list", function () {
      console.log(this);
      // el: domElement
      // jquery: jQueryObject
      // item: Object - repeat item
      // item_index: "0" - index of item
      // item_path: "list[0]" - repeat data_path
      // repeat_path: "list"
      // tagname: "button"
      // value: "add"
  });
```
<a name="ax5binder.add"></a>

### ax5binder.add(dataPath, item) ⇒ <code>[ax5binder](#ax5binder)</code>
data-ax-repeat="list" 하위아이템을 추가합니다.

**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 
| item | 

**Example**  
```js
myModel.add("list", {a:1});
```
<a name="ax5binder.remove"></a>

### ax5binder.remove(dataPath, index) ⇒ <code>[ax5binder](#ax5binder)</code>
data-ax-repeat="list" 하위 아이템을 제거합니다. 단! 이 때 ADDED 값을 가진 아이템은 제거하고 그렇지 않은 아이템은 DELETED 값을 아이템에 추가합니다.

**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 
| index | 

**Example**  
```js
myModel.remove("list", 0);
```
<a name="ax5binder.update"></a>

### ax5binder.update(dataPath, index, item) ⇒ <code>[ax5binder](#ax5binder)</code>
data-ax-repeat="list" 하위 아이템을 교체합니다.

**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 
| index | 
| item | 

**Example**  
```js
myModel.update("list", 0, {a:1});
```
<a name="ax5binder.childAdd"></a>

### ax5binder.childAdd(dataPath, index, child_path, child_item)
**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 
| index | 
| child_path | 
| child_item | 

<a name="ax5binder.childUpdate"></a>

### ax5binder.childUpdate(dataPath, index, child_path, child_index, child_item)
**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 
| index | 
| child_path | 
| child_index | 
| child_item | 

<a name="ax5binder.childSet"></a>

### ax5binder.childSet(dataPath, index, child_path, value) ⇒ <code>[ax5binder](#ax5binder)</code>
**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 
| index | 
| child_path | 
| value | 

<a name="ax5binder.onUpdate"></a>

### ax5binder.onUpdate(dataPath, callback) ⇒ <code>[ax5binder](#ax5binder)</code>
**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 
| callback | 

**Example**  
```js
 this.model.onupdate("moderator", function () {
     $('#moderator-add').val('');
     $moderator.find('[data-role-user-btn]')
         .unbind("click")
         .bind("click", role_user_btn_onclick);
 });
```
<a name="ax5binder.focus"></a>

### ax5binder.focus(dataPath) ⇒ <code>[ax5binder](#ax5binder)</code>
**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  

| Param |
| --- |
| dataPath | 

<a name="ax5binder.validate"></a>

### ax5binder.validate() ⇒ <code>\*</code>
**Kind**: static method of <code>[ax5binder](#ax5binder)</code>  
**Example**  
```html
<input type="text" data-ax-path="q" data-ax-validate="required" title="이름" maxlength="8" value=""/>
```
```js
var rs = myModel.validate(), _s;
console.log(rs); // 결과를 체크 해보세요
if(rs.error) {
     _s = rs.error[0].jquery.attr("title");
     alert("" + _s + "(은)는 필수 입력사항입니다." + _s + "(을)를 입력하세요");
     rs.error[0].el.focus();
     return;
 }
```
