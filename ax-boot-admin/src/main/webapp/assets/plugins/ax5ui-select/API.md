<a name="ax5select"></a>

## ax5select
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5select](#ax5select)
    * [.setConfig(config)](#ax5select.setConfig) ⇒ <code>[ax5select](#ax5select)</code>
    * [.bind(item)](#ax5select.bind) ⇒ <code>[ax5select](#ax5select)</code>
    * [.open(boundID, [tryCount])](#ax5select.open) ⇒ <code>[ax5select](#ax5select)</code>
    * [.update(item)](#ax5select.update) ⇒ <code>[ax5select](#ax5select)</code>
    * [.setOptions(boundID, options)](#ax5select.setOptions) ⇒ <code>[ax5select](#ax5select)</code>
    * [.val(boundID, [value], [selected])](#ax5select.val) ⇒ <code>[ax5select](#ax5select)</code>
    * [.close()](#ax5select.close) ⇒ <code>[ax5select](#ax5select)</code>

<a name="ax5select.setConfig"></a>

### ax5select.setConfig(config) ⇒ <code>[ax5select](#ax5select)</code>
Preferences of select UI

**Kind**: static method of <code>[ax5select](#ax5select)</code>  

| Param | Type | Description |
| --- | --- | --- |
| config | <code>Object</code> | 클래스 속성값 |

**Example**  
```js
var options = [];
for (var i = 0; i < 20; i++) {
    options.push({value: i, text: "optionText" + i});
}
var mySelect = new ax5.ui.select({
    theme: "danger"
});
mySelect.bind({
    theme: "primary",
    target: $('[data-ax5select="select1"]'),
    options: options,
    onChange: function () {
        console.log(this);
    },
    onClose: function () {
        console.log(this);
    },
    onStateChanged: function () {
        console.log(this);
    }
});
```
<a name="ax5select.bind"></a>

### ax5select.bind(item) ⇒ <code>[ax5select](#ax5select)</code>
bind select

**Kind**: static method of <code>[ax5select](#ax5select)</code>  

| Param | Type |
| --- | --- |
| item | <code>Object</code> | 
| [item.id] | <code>String</code> | 
| [item.theme] | <code>String</code> | 
| [item.multiple] | <code>Boolean</code> | 
| item.target | <code>Element</code> | 
| item.options | <code>Array.&lt;Object&gt;</code> | 

**Example**  
```js
var mySelect = new ax5.ui.select();
mySelect.bind({
 columnKeys: {
     optionValue: "value",
     optionText: "text"
 },
 target: $('[data-ax5select="select1"]'),
 options: [
     {value: "", text: ""}
 ],
 onChange: function(){

 },
 onClose: function(){

 },
 onStateChanged: function(){

 }
});
```
<a name="ax5select.open"></a>

### ax5select.open(boundID, [tryCount]) ⇒ <code>[ax5select](#ax5select)</code>
open the optionBox of select

**Kind**: static method of <code>[ax5select](#ax5select)</code>  

| Param | Type |
| --- | --- |
| boundID | <code>String</code> &#124; <code>Number</code> &#124; <code>Element</code> | 
| [tryCount] | <code>Number</code> | 

<a name="ax5select.update"></a>

### ax5select.update(item) ⇒ <code>[ax5select](#ax5select)</code>
**Kind**: static method of <code>[ax5select](#ax5select)</code>  

| Param | Type |
| --- | --- |
| item | <code>Object</code> &#124; <code>String</code> | 

<a name="ax5select.setOptions"></a>

### ax5select.setOptions(boundID, options) ⇒ <code>[ax5select](#ax5select)</code>
**Kind**: static method of <code>[ax5select](#ax5select)</code>  

| Param |
| --- |
| boundID | 
| options | 

<a name="ax5select.val"></a>

### ax5select.val(boundID, [value], [selected]) ⇒ <code>[ax5select](#ax5select)</code>
**Kind**: static method of <code>[ax5select](#ax5select)</code>  

| Param | Type |
| --- | --- |
| boundID | <code>String</code> &#124; <code>Number</code> &#124; <code>Element</code> | 
| [value] | <code>String</code> &#124; <code>Object</code> &#124; <code>Array</code> | 
| [selected] | <code>Boolean</code> | 

<a name="ax5select.close"></a>

### ax5select.close() ⇒ <code>[ax5select](#ax5select)</code>
**Kind**: static method of <code>[ax5select](#ax5select)</code>  
