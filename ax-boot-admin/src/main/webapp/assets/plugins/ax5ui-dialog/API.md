<a name="ax5dialog"></a>

## ax5dialog
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5dialog](#ax5dialog)
    * [.setConfig(config)](#ax5dialog.setConfig) ⇒ <code>[ax5dialog](#ax5dialog)</code>
    * [.alert(config, [callback])](#ax5dialog.alert) ⇒ <code>[ax5dialog](#ax5dialog)</code>
    * [.confirm(config, [callback])](#ax5dialog.confirm) ⇒ <code>[ax5dialog](#ax5dialog)</code>
    * [.prompt(config, [callback])](#ax5dialog.prompt) ⇒ <code>[ax5dialog](#ax5dialog)</code>
    * [.close()](#ax5dialog.close) ⇒ <code>[ax5dialog](#ax5dialog)</code>

<a name="ax5dialog.setConfig"></a>

### ax5dialog.setConfig(config) ⇒ <code>[ax5dialog](#ax5dialog)</code>
Preferences of dialog UI

**Kind**: static method of <code>[ax5dialog](#ax5dialog)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> |  | 클래스 속성값 |
| [config.theme] | <code>String</code> | <code>&quot;default&quot;</code> |  |
| [config.width] | <code>Number</code> | <code>300</code> |  |
| [config.title] | <code>String</code> | <code>&quot;&quot;</code> |  |
| [config.zIndex] | <code>Number</code> |  |  |
| [config.onStateChanged] | <code>function</code> |  | `onStateChanged` function can be defined in setConfig method or new ax5.ui.dialog initialization method. However, you can us to define an event function after initialization, if necessary |
| [config.lang] | <code>Object</code> |  |  |
| [config.lang.ok] | <code>String</code> | <code>&quot;ok&quot;</code> |  |
| [config.lang.cancel] | <code>String</code> | <code>&quot;cancel&quot;</code> |  |
| [config.animateTime] | <code>Number</code> | <code>150</code> |  |
| [config.autoCloseTime] | <code>Number</code> | <code>0</code> | 0보다 크면 autoCloseTime 프레임후에 dialog auto close |

**Example**  
```
var dialog = new ax5.ui.dialog();
dialog.setConfig({
     title: "app dialog title",
     zIndex: 5000,
     onStateChanged: function () {
         if (this.state === "open") {
             mask.open();
         }
         else if (this.state === "close") {
             mask.close();
         }
     }
});
```
<a name="ax5dialog.alert"></a>

### ax5dialog.alert(config, [callback]) ⇒ <code>[ax5dialog](#ax5dialog)</code>
open the dialog of alert type

**Kind**: static method of <code>[ax5dialog](#ax5dialog)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> &#124; <code>String</code> |  | dialog 속성을 json으로 정의하거나 msg만 전달 |
| [config.theme] | <code>String</code> | <code>&quot;default&quot;</code> |  |
| [config.width] | <code>Number</code> | <code>300</code> |  |
| [config.title] | <code>String</code> | <code>&quot;&quot;</code> |  |
| [config.zIndex] | <code>Number</code> |  |  |
| [config.onStateChanged] | <code>function</code> |  |  |
| [config.lang] | <code>Object</code> |  |  |
| [config.lang.ok] | <code>String</code> | <code>&quot;ok&quot;</code> |  |
| [config.lang.cancel] | <code>String</code> | <code>&quot;cancel&quot;</code> |  |
| [config.animateTime] | <code>Number</code> | <code>150</code> |  |
| [config.autoCloseTime] | <code>Number</code> | <code>0</code> | 0보다 크면 autoCloseTime 프레임후에 dialog auto close |
| [config.additionalContent] | <code>function</code> &#124; <code>String</code> |  |  |
| [callback] | <code>function</code> |  | 사용자 확인 이벤트시 호출될 callback 함수 |

**Example**  
```
myDialog.alert({
 title: 'app title',
 msg: 'alert'
}, function(){});
```
<a name="ax5dialog.confirm"></a>

### ax5dialog.confirm(config, [callback]) ⇒ <code>[ax5dialog](#ax5dialog)</code>
open the dialog of confirm type

**Kind**: static method of <code>[ax5dialog](#ax5dialog)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> &#124; <code>String</code> |  | dialog 속성을 json으로 정의하거나 msg만 전달 |
| [config.theme] | <code>String</code> | <code>&quot;default&quot;</code> |  |
| [config.width] | <code>Number</code> | <code>300</code> |  |
| [config.title] | <code>String</code> | <code>&quot;&quot;</code> |  |
| [config.zIndex] | <code>Number</code> |  |  |
| [config.onStateChanged] | <code>function</code> |  |  |
| [config.lang] | <code>Object</code> |  |  |
| [config.lang.ok] | <code>String</code> | <code>&quot;ok&quot;</code> |  |
| [config.lang.cancel] | <code>String</code> | <code>&quot;cancel&quot;</code> |  |
| [config.animateTime] | <code>Number</code> | <code>150</code> |  |
| [config.autoCloseTime] | <code>Number</code> | <code>0</code> | 0보다 크면 autoCloseTime 프레임후에 dialog auto close |
| [config.additionalContent] | <code>function</code> &#124; <code>String</code> |  |  |
| [callback] | <code>function</code> |  | 사용자 확인 이벤트시 호출될 callback 함수 |

**Example**  
```
myDialog.confirm({
     title: 'app title',
     msg: 'confirm',
     additionalContent: function () {
         return "<div style='border:1px solid #ccc;border-radius: 5px;background: #eee;padding: 10px;'>추가정보</div>";
     }
}, function(){});
```
<a name="ax5dialog.prompt"></a>

### ax5dialog.prompt(config, [callback]) ⇒ <code>[ax5dialog](#ax5dialog)</code>
open the dialog of prompt type

**Kind**: static method of <code>[ax5dialog](#ax5dialog)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>Object</code> &#124; <code>String</code> |  | dialog 속성을 json으로 정의하거나 msg만 전달 |
| [config.theme] | <code>String</code> | <code>&quot;default&quot;</code> |  |
| [config.width] | <code>Number</code> | <code>300</code> |  |
| [config.title] | <code>String</code> | <code>&quot;&quot;</code> |  |
| [config.zIndex] | <code>Number</code> |  |  |
| [config.onStateChanged] | <code>function</code> |  |  |
| [config.lang] | <code>Object</code> |  |  |
| [config.lang.ok] | <code>String</code> | <code>&quot;ok&quot;</code> |  |
| [config.lang.cancel] | <code>String</code> | <code>&quot;cancel&quot;</code> |  |
| [config.animateTime] | <code>Number</code> | <code>150</code> |  |
| [config.autoCloseTime] | <code>Number</code> | <code>0</code> | 0보다 크면 autoCloseTime 프레임후에 dialog auto close |
| [config.additionalContent] | <code>function</code> &#124; <code>String</code> |  |  |
| [callback] | <code>function</code> |  | 사용자 확인 이벤트시 호출될 callback 함수 |

**Example**  
```
myDialog.prompt({
 title: 'app title',
 msg: 'alert'
}, function(){});
```
<a name="ax5dialog.close"></a>

### ax5dialog.close() ⇒ <code>[ax5dialog](#ax5dialog)</code>
close the dialog

**Kind**: static method of <code>[ax5dialog](#ax5dialog)</code>  
**Example**  
```
myDialog.close();
```
