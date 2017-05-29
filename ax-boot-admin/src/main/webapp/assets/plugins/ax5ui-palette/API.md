<a name="ax5palette"></a>

## ax5palette
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5palette](#ax5palette)
    * [.setConfig(config)](#ax5palette.setConfig) ⇒ <code>[ax5palette](#ax5palette)</code>
    * [.repaint()](#ax5palette.repaint) ⇒ <code>[ax5palette](#ax5palette)</code>
    * [.setSelectedColor(selectedColor)](#ax5palette.setSelectedColor) ⇒ <code>[ax5palette](#ax5palette)</code>

<a name="ax5palette.setConfig"></a>

### ax5palette.setConfig(config) ⇒ <code>[ax5palette](#ax5palette)</code>
Preferences of palette UI

**Kind**: static method of <code>[ax5palette](#ax5palette)</code>  

| Param | Type | Default |
| --- | --- | --- |
| config | <code>Object</code> |  | 
| config.target | <code>Element</code> |  | 
| [config.selectedColor] | <code>String</code> |  | 
| [config.colors] | <code>Object</code> |  | 
| [config.colors.preview] | <code>Object</code> |  | 
| [config.colors.preview.width] | <code>Number</code> | <code>24</code> | 
| [config.colors.preview.height] | <code>Number</code> | <code>24</code> | 
| [config.colors.preview.cellWidth] | <code>Number</code> | <code>30</code> | 
| [config.colors.label] | <code>Object</code> |  | 
| [config.colors.label.width] | <code>Number</code> | <code>80</code> | 
| [config.colors.slider] | <code>Object</code> |  | 
| [config.colors.slider.trackHeight] | <code>Number</code> | <code>8</code> | 
| [config.colors.slider.amount] | <code>Number</code> | <code>32</code> | 
| [config.colors.slider.handleWidth] | <code>Number</code> | <code>18</code> | 
| [config.colors.slider.handleHeight] | <code>Number</code> | <code>18</code> | 
| [config.colors.list] | <code>Array.&lt;Object&gt;</code> | <code>[red,orange,yellow,green,blue,purple,black,white]</code> | 
| config.colors.list[].label | <code>String</code> |  | 
| config.colors.list[].value | <code>String</code> |  | 
| [config.controls] | <code>Object</code> |  | 
| [config.controls.height] | <code>Number</code> | <code>0</code> | 

**Example**  
```js
myPalette = new ax5.ui.palette({
 target: $('[data-ax5palette="01"]'),
 onClick: function (hexColor) {
     alert(hexColor);
 }
});

myPalette = new ax5.ui.palette({
 target: $('[data-ax5palette="01"]'),
 colors: {
     list: [
         {label: "red", value: "#ff0000"},
         {label: "orange", value: "#ff9802"},
         {label: "yellow", value: "#ffff00"},
         {label: "skyblue", value: "#84e4ff"},
         {label: "white", value: "#ffffff"}
     ]
 }
 onClick: function (hexColor) {
 }
});
```
<a name="ax5palette.repaint"></a>

### ax5palette.repaint() ⇒ <code>[ax5palette](#ax5palette)</code>
**Kind**: static method of <code>[ax5palette](#ax5palette)</code>  
<a name="ax5palette.setSelectedColor"></a>

### ax5palette.setSelectedColor(selectedColor) ⇒ <code>[ax5palette](#ax5palette)</code>
**Kind**: static method of <code>[ax5palette](#ax5palette)</code>  

| Param |
| --- |
| selectedColor | 

