## Classes

<dl>
<dt><a href="#ax5layout">ax5layout</a></dt>
<dd></dd>
</dl>

## Objects

<dl>
<dt><a href="#jQueryExtends">jQueryExtends</a> : <code>object</code></dt>
<dd><p>ax5layout jquery extends</p>
</dd>
</dl>

<a name="ax5layout"></a>

## ax5layout
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5layout](#ax5layout)
    * [.setConfig(config)](#ax5layout.setConfig) ⇒ <code>[ax5layout](#ax5layout)</code>
    * [.bind(item)](#ax5layout.bind) ⇒ <code>[ax5layout](#ax5layout)</code>
    * [.align(boundID, [callback], [windowResize])](#ax5layout.align) ⇒ <code>[ax5layout](#ax5layout)</code>
    * [.onResize(boundID, fn)](#ax5layout.onResize) ⇒ <code>[ax5layout](#ax5layout)</code>
    * [.resize(boundID, resizeOption, [callback])](#ax5layout.resize) ⇒ <code>[ax5layout](#ax5layout)</code>
    * [.tabOpen(boundID, tabIndex)](#ax5layout.tabOpen) ⇒ <code>ax5.ui.ax5layout</code>

<a name="ax5layout.setConfig"></a>

### ax5layout.setConfig(config) ⇒ <code>[ax5layout](#ax5layout)</code>
Preferences of layout UI

**Kind**: static method of <code>[ax5layout](#ax5layout)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | 클래스 속성값 |
| [config.animateTime] | <code>Number</code> | <code>250</code> |  |
| [config.splitter] | <code>Object</code> |  |  |
| [config.splitter.size] | <code>Number</code> | <code>4</code> |  |
| [config.autoResize] | <code>Boolean</code> | <code>true</code> |  |

**Example**  
```js
```
<a name="ax5layout.bind"></a>

### ax5layout.bind(item) ⇒ <code>[ax5layout](#ax5layout)</code>
**Kind**: static method of <code>[ax5layout](#ax5layout)</code>  

| Param | Type | Default |
| --- | --- | --- |
| item | <code>Object</code> |  | 
| [item.layout] | <code>String</code> |  | 
| [item.theme] | <code>String</code> |  | 
| item.target | <code>Element</code> |  | 
| item.options | <code>Array.&lt;Object&gt;</code> |  | 
| [item.splitter] | <code>Object</code> |  | 
| [item.splitter.size] | <code>Number</code> | <code>4</code> | 
| [item.autoResize] | <code>Boolean</code> | <code>true</code> | 

<a name="ax5layout.align"></a>

### ax5layout.align(boundID, [callback], [windowResize]) ⇒ <code>[ax5layout](#ax5layout)</code>
**Kind**: static method of <code>[ax5layout](#ax5layout)</code>  

| Param | Type |
| --- | --- |
| boundID |  | 
| [callback] | <code>function</code> | 
| [windowResize] | <code>String</code> | 

<a name="ax5layout.onResize"></a>

### ax5layout.onResize(boundID, fn) ⇒ <code>[ax5layout](#ax5layout)</code>
**Kind**: static method of <code>[ax5layout](#ax5layout)</code>  

| Param |
| --- |
| boundID | 
| fn | 

<a name="ax5layout.resize"></a>

### ax5layout.resize(boundID, resizeOption, [callback]) ⇒ <code>[ax5layout](#ax5layout)</code>
**Kind**: static method of <code>[ax5layout](#ax5layout)</code>  

| Param | Type |
| --- | --- |
| boundID |  | 
| resizeOption | <code>Object</code> | 
| [callback] | <code>function</code> | 

<a name="ax5layout.tabOpen"></a>

### ax5layout.tabOpen(boundID, tabIndex) ⇒ <code>ax5.ui.ax5layout</code>
**Kind**: static method of <code>[ax5layout](#ax5layout)</code>  

| Param |
| --- |
| boundID | 
| tabIndex | 

<a name="jQueryExtends"></a>

## jQueryExtends : <code>object</code>
ax5layout jquery extends

**Kind**: global namespace  
<a name="jQueryExtends.ax5layout"></a>

### jQueryExtends.ax5layout(methodName)
**Kind**: static method of <code>[jQueryExtends](#jQueryExtends)</code>  

| Param | Type |
| --- | --- |
| methodName | <code>String</code> | 

**Example**  
```js
jQuery('[data-ax5layout="ax1"]').ax5layout();
```
