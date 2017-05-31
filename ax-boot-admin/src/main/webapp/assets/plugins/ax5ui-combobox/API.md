## Classes

<dl>
<dt><a href="#ax5combobox">ax5combobox</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#jQueryExtends">jQueryExtends</a> : <code>object</code></dt>
<dd><p>ax5combobox jquery extends</p>
</dd>
</dl>

<a name="ax5combobox"></a>

## ax5combobox
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5combobox](#ax5combobox)
    * [.setConfig(config)](#ax5combobox.setConfig) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.bind(item)](#ax5combobox.bind) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.open(boundID, [tryCount])](#ax5combobox.open) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.update(item)](#ax5combobox.update) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.setValue(_boundID, _value, [_selected])](#ax5combobox.setValue) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.setText(_boundID, _text, [_selected])](#ax5combobox.setText) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.getSelectedOption(_boundID)](#ax5combobox.getSelectedOption) ⇒ <code>Array</code>
    * [.close()](#ax5combobox.close) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.blur(_boundID)](#ax5combobox.blur) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.enable(_boundID)](#ax5combobox.enable) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.disable(_boundID)](#ax5combobox.disable) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.align()](#ax5combobox.align)
    * [.clear(_boundID)](#ax5combobox.clear) ⇒ <code>[ax5combobox](#ax5combobox)</code>

<a name="ax5combobox.setConfig"></a>

### ax5combobox.setConfig(config) ⇒ <code>[ax5combobox](#ax5combobox)</code>
Preferences of combobox UI

**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | 클래스 속성값 |

**Example**  
```
```
<a name="ax5combobox.bind"></a>

### ax5combobox.bind(item) ⇒ <code>[ax5combobox](#ax5combobox)</code>
bind combobox

**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 
| [item.id] | <code>String</code> | 
| [item.theme] | <code>String</code> | 
| [item.multiple] | <code>Boolean</code> | 
| item.target | <code>Element</code> | 
| item.options | <code>Array.&lt;Object&gt;</code> | 

<a name="ax5combobox.open"></a>

### ax5combobox.open(boundID, [tryCount]) ⇒ <code>[ax5combobox](#ax5combobox)</code>
open the optionBox of combobox

**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| boundID | <code>String</code> &#124; <code>Number</code> &#124; <code>Element</code> | 
| [tryCount] | <code>Number</code> | 

<a name="ax5combobox.update"></a>

### ax5combobox.update(item) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| item | <code>Object</code> &#124; <code>String</code> | 

<a name="ax5combobox.setValue"></a>

### ax5combobox.setValue(_boundID, _value, [_selected]) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 
| _value | <code>String</code> &#124; <code>Array</code> | 
| [_selected] | <code>Boolean</code> | 

**Example**  
```js
myCombo.setValue($('[data-ax5combobox="combo1"]'), "1");
myCombo.setValue($('[data-ax5combobox="combo1"]'), ["1", "2"]);
```
<a name="ax5combobox.setText"></a>

### ax5combobox.setText(_boundID, _text, [_selected]) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 
| _text | <code>String</code> &#124; <code>Array</code> | 
| [_selected] | <code>Boolean</code> | 

**Example**  
```js
myCombo.setText($('[data-ax5combobox="combo1"]'), "string");
myCombo.setText($('[data-ax5combobox="combo1"]'), ["substring", "search"]);
```
<a name="ax5combobox.getSelectedOption"></a>

### ax5combobox.getSelectedOption(_boundID) ⇒ <code>Array</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 

<a name="ax5combobox.close"></a>

### ax5combobox.close() ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  
<a name="ax5combobox.blur"></a>

### ax5combobox.blur(_boundID) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 

<a name="ax5combobox.enable"></a>

### ax5combobox.enable(_boundID) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 

<a name="ax5combobox.disable"></a>

### ax5combobox.disable(_boundID) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 

<a name="ax5combobox.align"></a>

### ax5combobox.align()
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  
<a name="ax5combobox.clear"></a>

### ax5combobox.clear(_boundID) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| _boundID | <code>jQueryObject</code> &#124; <code>Element</code> &#124; <code>Number</code> | 

<a name="jQueryExtends"></a>

## jQueryExtends : <code>object</code>
ax5combobox jquery extends

**Kind**: global namespace  
<a name="jQueryExtends.ax5combobox"></a>

### jQueryExtends.ax5combobox(methodName, [arguments], [arguments])
**Kind**: static method of <code>[jQueryExtends](#jQueryExtends)</code>  

| Param | Type |
| --- | --- |
| methodName | <code>String</code> | 
| [arguments] |  | 
| [arguments] |  | 

**Example**  
```html
<div data-ax5combobox="ax1" data-ax5combobox-config='{
 multiple: true,
 editable: true,
 size: "",
 theme:""
 }'></div>
<script>
jQuery('[data-ax5combobox="ax1"]').ax5combobox();
$('[data-ax5combobox="ax1"]').ax5combobox("getSelectedOption");
$('[data-ax5combobox="ax1"]').ax5combobox("setValue", ["string", "number"]);
$('[data-ax5combobox="ax1"]').ax5combobox("enable");
$('[data-ax5combobox="ax1"]').ax5combobox("disable");
</script>
```
