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
**Version**: 0.1.6  
**Author:** tom@axisj.com  

* [ax5combobox](#ax5combobox)
    * [.setConfig(config)](#ax5combobox.setConfig) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.bind(item)](#ax5combobox.bind) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.open(boundID, [tryCount])](#ax5combobox.open) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.update(item)](#ax5combobox.update) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.val(boundID, [value], [Selected])](#ax5combobox.val) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.close()](#ax5combobox.close) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.enable(boundID)](#ax5combobox.enable) ⇒ <code>[ax5combobox](#ax5combobox)</code>
    * [.disable(boundID)](#ax5combobox.disable) ⇒ <code>[ax5combobox](#ax5combobox)</code>

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

<a name="ax5combobox.val"></a>

### ax5combobox.val(boundID, [value], [Selected]) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param | Type |
| --- | --- |
| boundID | <code>String</code> &#124; <code>Number</code> &#124; <code>Element</code> | 
| [value] | <code>String</code> &#124; <code>Object</code> &#124; <code>Array</code> | 
| [Selected] | <code>Boolean</code> | 

<a name="ax5combobox.close"></a>

### ax5combobox.close() ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  
<a name="ax5combobox.enable"></a>

### ax5combobox.enable(boundID) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param |
| --- |
| boundID | 

<a name="ax5combobox.disable"></a>

### ax5combobox.disable(boundID) ⇒ <code>[ax5combobox](#ax5combobox)</code>
**Kind**: static method of <code>[ax5combobox](#ax5combobox)</code>  

| Param |
| --- |
| boundID | 

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
<div data-ax5combobox="combo1" data-ax5combobox-config='{
 multiple: true,
 editable: true,
 size: "",
 theme:""
 }'></div>
<script>
jQuery('[data-ax5combobox="ax1"]').ax5combobox();
$('[data-ax5combobox="ax1"]').ax5combobox("getValue");
$('[data-ax5combobox="ax1"]').ax5combobox("setValue", ["string", "number"]);
$('[data-ax5combobox="ax1"]').ax5combobox("enable");
$('[data-ax5combobox="ax1"]').ax5combobox("disable");
</script>
```
