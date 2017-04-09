<a name="ax5modal"></a>

## ax5modal
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5modal](#ax5modal)
    * [.setConfig(config)](#ax5modal.setConfig) ⇒ <code>[ax5modal](#ax5modal)</code>
    * [.open()](#ax5modal.open) ⇒ <code>[ax5modal](#ax5modal)</code>
    * [.close()](#ax5modal.close) ⇒ <code>[ax5modal](#ax5modal)</code>
    * [.minimize()](#ax5modal.minimize) ⇒ <code>[ax5modal](#ax5modal)</code>
    * [.restore()](#ax5modal.restore) ⇒ <code>[ax5modal](#ax5modal)</code>
    * [.css(css)](#ax5modal.css) ⇒ <code>[ax5modal](#ax5modal)</code>
    * [.setModalConfig(_config)](#ax5modal.setModalConfig) ⇒ <code>ax5.ui.ax5modal</code>
    * [.align(position, e)](#ax5modal.align) ⇒ <code>[ax5modal](#ax5modal)</code>

<a name="ax5modal.setConfig"></a>

### ax5modal.setConfig(config) ⇒ <code>[ax5modal](#ax5modal)</code>
Preferences of modal UI

**Kind**: static method of <code>[ax5modal](#ax5modal)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | 클래스 속성값 |
| [config.zIndex] | <code>Number</code> |  |  |
| [config.position] | <code>Object</code> |  |  |
| [config.position.left] | <code>String</code> | <code>&quot;center&quot;</code> |  |
| [config.position.top] | <code>String</code> | <code>&quot;middle&quot;</code> |  |
| [config.position.margin] | <code>Number</code> | <code>10</code> |  |
| [config.minimizePosition] | <code>String</code> | <code>&quot;bottom-right&quot;</code> |  |
| [config.width] | <code>Number</code> | <code>300</code> |  |
| [config.height] | <code>Number</code> | <code>400</code> |  |
| [config.closeToEsc] | <code>Boolean</code> | <code>true</code> |  |
| [config.absolute] | <code>Boolean</code> | <code>false</code> |  |
| [config.disableDrag] | <code>Boolean</code> | <code>false</code> |  |
| [config.disableResize] | <code>Boolean</code> | <code>false</code> |  |
| [config.animateTime] | <code>Number</code> | <code>250</code> |  |
| [config.fullScreen] | <code>function</code> |  |  |
| [config.onStateChanged] | <code>function</code> |  |  |
| [config.onResize] | <code>function</code> |  |  |

**Example**  
```
```
<a name="ax5modal.open"></a>

### ax5modal.open() ⇒ <code>[ax5modal](#ax5modal)</code>
open the modal

**Kind**: static method of <code>[ax5modal](#ax5modal)</code>  
**Example**  
```
my_modal.open();
```
<a name="ax5modal.close"></a>

### ax5modal.close() ⇒ <code>[ax5modal](#ax5modal)</code>
close the modal

**Kind**: static method of <code>[ax5modal](#ax5modal)</code>  
**Example**  
```
my_modal.close();
```
<a name="ax5modal.minimize"></a>

### ax5modal.minimize() ⇒ <code>[ax5modal](#ax5modal)</code>
**Kind**: static method of <code>[ax5modal](#ax5modal)</code>  
<a name="ax5modal.restore"></a>

### ax5modal.restore() ⇒ <code>[ax5modal](#ax5modal)</code>
**Kind**: static method of <code>[ax5modal](#ax5modal)</code>  
<a name="ax5modal.css"></a>

### ax5modal.css(css) ⇒ <code>[ax5modal](#ax5modal)</code>
setCSS

**Kind**: static method of <code>[ax5modal](#ax5modal)</code>  

| Param | Type | Description |
| --- | --- | --- |
| css | <code>Object</code> | - |

<a name="ax5modal.setModalConfig"></a>

### ax5modal.setModalConfig(_config) ⇒ <code>ax5.ui.ax5modal</code>
**Kind**: static method of <code>[ax5modal](#ax5modal)</code>  

| Param |
| --- |
| _config | 

<a name="ax5modal.align"></a>

### ax5modal.align(position, e) ⇒ <code>[ax5modal](#ax5modal)</code>
**Kind**: static method of <code>[ax5modal](#ax5modal)</code>  

| Param |
| --- |
| position | 
| e | 

