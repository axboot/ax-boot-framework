# AXBinder

Simple two way binding javascript, jQuery plugin

[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-OpensourceJavascriptUILibrary-green.svg)](https://github.com/axisj) ![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)


## Online Demo
http://axisj.github.io/AXBinder/


## dependencies
- jQuery
- Mustache

# API

## Install
```html
<!DOCTYPE html>
<html lang="en">
<head>

	<meta charset="UTF-8">
	<title></title>
	<script src="plugins/jquery/jquery.min.js"></script>

    <!-- this mustache is imporoved version you must use this version ! -->
	<script src="plugins/mustache/mustache.js"></script>
	<script src="src/AXBinder.js"></script>

	<!-- or use min file -->
	<!-- this file include mustache
    <script src="dist/AXBinder.min.js"></script>
	-->
</head>
```

## Methods

### AXBinder.set_model(Object[, jQueryObject]) : Model
바인딩할 자바스크립트 오브젝트로
제이쿼리로 검색된 HTML dom 엘리먼트 에 바인딩합니다.
바인딩된 모델을 반환합니다.

```html
<div id="form-target">
	<input type="text" data-ax-path="name" class="AXInput"/>
	<input type="text" data-ax-path="email" class="AXInput"/>
</div>
```

```js
var obj = {
	name: "Thomas",
	email: "tom@axisj.com"
}

var myModel = new AXBinder();
myModel.set_model(obj, $("#form-target"));
```


### Model.set(data_path, value) : Model
data_path에 값을 변경한다. value의 타입은 (String, Number, Array, Object)를 지원.

```js
myModel.set("name", "Seowoo");
```

### Model.get([data_path]) : String|Number|Array|Object
data_path에 값을 반환한다. data_path 가 없으면 전체 Object를 반환한다.

```js
var value = myModel.get("name"); // Seowoo
```

### Model.onchange(data_path, callBack) : Model
data_path에 값이 변경되는 이벤트 발생하면 callBack을 실행합니다.

```js
myModel.onchange("name", function () {
    console.log(this);
    // el: domElement - 변경이 발생한 엘리먼트, 엘리먼트로 부터 다양한 속성을 추출할 수 있다.
    // jquery : jQueryObject
    // tagname: "input"
    // value: "changed value"
    console.log(this.el.id);
});
myModel.onchange("*", function (n) {
    console.log(n);
    // console.log(this); 와 동일
});
```

### Model.onclick(data_path, callBack) : Model
data-ax-repeat="list" 속성이 부여된 엘리먼트 하위에 태그중에 data-ax-repeat-click 속성을 가진 아이템에 대해 클릭 이벤트 발생하면 callBack을 실행합니다.

```js
myModel.onclick("list", function () {
    console.log(this);
    /*
    el: domElement
    jquery: jQueryObject
    item: Object - repeat item
    item_index: "0" - index of item
    item_path: "list[0]" - repeat data_path
    repeat_path: "list"
    tagname: "button"
    value: "add"
    */
});
```



### Model.add(repeat_path, Object) : Model
data-ax-repeat="list" 하위아이템을 추가합니다.
```js
myModel.add("list", {a:1});
```

### Model.remove(repeat_path, index) : Model
data-ax-repeat="list" 하위 아이템을 제거합니다. 단! 이 때 __ADDED__ 값을 가진 아이템은 제거하고 그렇지 않은 아이템은 __DELETED__ 값을 아이템에 추가합니다.
```js
myModel.remove("list", 0);
```
### Model.update(repeat_path[, index, Object]) : Model
data-ax-repeat="list" 하위 아이템을 교체합니다.
```js
myModel.update("list", 0, {a:1});
```

### Model.child_add(repeat_path, repeat_item_index, child_key, Object) : Model
data-ax-repeat="list" 하위 아이템중 child_key의 하위아이템을 추가합니다.
```js
myModel.child_add("list", 0, "child", {a:1});
```

### Model.child_remove(repeat_path, repeat_item_index, child_key, child_index) : Model
data-ax-repeat="list" 하위 아이템중 child_key의 하위아이템을 제거합니다. 단! 이 때 __ADDED__ 값을 가진 아이템은 제거하고 그렇지 않은 아이템은 __DELETED__ 값을 아이템에 추가합니다.
```js
myModel.child_remove("list", 0, "child", 0);
```
### Model.child_update(repeat_path, repeat_item_index, child_key, child_index, Object) : Model
data-ax-repeat="list" 하위 아이템중 child_key의 하위 아이템을 교체합니다.
```js
myModel.child_update("list", 0, "child", 0, {a:1});
```

### Model.validate() : Object
data-ax-validate 를 가진 엘리먼트에 대해 값을 검사하고 값이 없거나 짦은 경우 error를 리턴합니다.
```html
<input type="text" data-ax-path="q" data-ax-validate="required" 
    title="이름" maxlength="8" class="AXInput W150" value=""/>
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