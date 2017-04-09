## Classes

<dl>
<dt><a href="#ax5autocomplete">ax5autocomplete</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#jQueryExtends">jQueryExtends</a> : <code>object</code></dt>
<dd><p>autocomplete jquery extends</p>
</dd>
</dl>

<a name="ax5autocomplete"></a>

## ax5autocomplete
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5autocomplete](#ax5autocomplete)
    * [.setConfig(config)](#ax5autocomplete.setConfig) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
    * [.bind(item)](#ax5autocomplete.bind) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
    * [.open(boundID, [tryCount])](#ax5autocomplete.open) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
    * [.setValue(_boundID, _value)](#ax5autocomplete.setValue) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
    * [.setText(_boundID, _text)](#ax5autocomplete.setText) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
    * [.getSelectedOption(_boundID)](#ax5autocomplete.getSelectedOption) ⇒ <code>Array</code>
    * [.close()](#ax5autocomplete.close) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
    * [.blur(_boundID)](#ax5autocomplete.blur) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
    * [.enable(_boundID)](#ax5autocomplete.enable) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
    * [.disable(_boundID)](#ax5autocomplete.disable) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
    * [.align()](#ax5autocomplete.align)

<a name="ax5autocomplete.setConfig"></a>

### ax5autocomplete.setConfig(config) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
Preferences of autocomplete UI

**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | 클래스 속성값 |

**Example**  
```
```
<a name="ax5autocomplete.bind"></a>

### ax5autocomplete.bind(item) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
bind autocomplete

**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 
| [item.id] | <code>String</code> | 
| [item.theme] | <code>String</code> | 
| [item.multiple] | <code>Boolean</code> | 
| item.target | <code>Element</code> | 

<a name="ax5autocomplete.open"></a>

### ax5autocomplete.open(boundID, [tryCount]) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
open the optionBox of autocomplete

**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  

| Param | Type |
| --- | --- |
| boundID | <code>String</code> &#124; <code>Number</code> &#124; <code>Element</code> | 
| [tryCount] | <code>Number</code> | 

<a name="ax5autocomplete.setValue"></a>

### ax5autocomplete.setValue(_boundID, _value) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 
| _value | <code>String</code> &#124; <code>Array</code> | 

**Example**  
```js
myAutocomplete.setValue($('[data-ax5autocomplete="autocomplete1"]'), {value:"test", text:"test"});
myAutocomplete.setValue($('[data-ax5autocomplete="autocomplete1"]'), [{value:"test1", text:"test1"}, {value:"test2", text:"test2"}]);
myAutocomplete.setValue($('[data-ax5autocomplete="autocomplete1"]'), null);
```
<a name="ax5autocomplete.setText"></a>

### ax5autocomplete.setText(_boundID, _text) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 
| _text | <code>String</code> &#124; <code>Array</code> | 

**Example**  
```js
myAutocomplete.setText($('[data-ax5autocomplete="autocomplete1"]'), "string");
myAutocomplete.setText($('[data-ax5autocomplete="autocomplete1"]'), ["substring", "search"]);
```
<a name="ax5autocomplete.getSelectedOption"></a>

### ax5autocomplete.getSelectedOption(_boundID) ⇒ <code>Array</code>
**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 

<a name="ax5autocomplete.close"></a>

### ax5autocomplete.close() ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  
<a name="ax5autocomplete.blur"></a>

### ax5autocomplete.blur(_boundID) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 

<a name="ax5autocomplete.enable"></a>

### ax5autocomplete.enable(_boundID) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 

<a name="ax5autocomplete.disable"></a>

### ax5autocomplete.disable(_boundID) ⇒ <code>[ax5autocomplete](#ax5autocomplete)</code>
**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 

<a name="ax5autocomplete.align"></a>

### ax5autocomplete.align()
**Kind**: static method of <code>[ax5autocomplete](#ax5autocomplete)</code>  
<a name="jQueryExtends"></a>

## jQueryExtends : <code>object</code>
autocomplete jquery extends

**Kind**: global namespace  
<a name="jQueryExtends.ax5autocomplete"></a>

### jQueryExtends.ax5autocomplete(methodName, [arguments], [arguments])
**Kind**: static method of <code>[jQueryExtends](#jQueryExtends)</code>  

| Param | Type |
| --- | --- |
| methodName | <code>String</code> | 
| [arguments] |  | 
| [arguments] |  | 

**Example**  
```html
<div data-ax5autocomplete="ax1" data-ax5autocomplete-config='{
 multiple: true,
 editable: true,
 size: "",
 theme:""
 }'></div>
<script>
jQuery('[data-ax5autocomplete="ax1"]').ax5autocomplete();
$('[data-ax5autocomplete="ax1"]').ax5autocomplete("getSelectedOption");
$('[data-ax5autocomplete="ax1"]').ax5autocomplete("setValue", {value:"test", text:"test"});
$('[data-ax5autocomplete="ax1"]').ax5autocomplete("enable");
$('[data-ax5autocomplete="ax1"]').ax5autocomplete("disable");
</script>
```
