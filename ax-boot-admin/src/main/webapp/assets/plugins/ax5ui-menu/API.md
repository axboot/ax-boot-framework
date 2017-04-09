# Menu
> It is a menu UI. You can use the kind of context menu and the menu bar.

How to initialize the properties of the UI, there are two.
You can pass the property values of the UI to `setConfig`.
Using the `new` you can pass when you initialize the UI.

## setConfig
`setConfig([options, callInit=true])`

```js
var menu = new ax5.ui.menu();
menu.setConfig({
  theme: 'default',
  //width: 200,
  offset: {left: 0, top: 0},
  position: "absolute",
  icons: {
      'arrow': '<i class="fa fa-caret-right"></i>'
  },
  items: [
    {label:"label"},
    {divide: true},
    {label:"label", items: [
      {label:"label"}
    ]}
  ]
});
```
**Easy Way - without setConfig**
```js
var menu = new ax5.ui.menu({
  theme: 'default',
  //width: 200,
  position: "absolute",
  icons: {
      'arrow': '<i class="fa fa-caret-right"></i>'
  },
  items: [
    {label:"label"},
    {divide: true},
    {label:"label", items: [
      {label:"label"}
    ]}
  ]
});
```

### theme
Type: `String`
default, primary, info, warning, danger

### position
Type: `String`
abslute, fixed

### width
Type: `Number`


### iconWidth
Type: `Number`

### acceleratorWidth
Type: `Number`

### offset
Type: `Object`

```js
{left: 10, top: 10}
```

### itemClickAndClose
Type: `Boolean`
When you click on an item on the menu, whether to close the menu

### icons
Type: `Object`

```js
{'arrow': '<i class="fa fa-caret-right"></i>'}
```

### items
Type: `Array`

### onStateChanged
Type: `Function`

```js
var menu = new ax5.ui.menu({
  items: [
    {label:"label"}
  ],
  onStateChanged: function(){
    console.log(this);
  }
});
```
or
```js
var menu = new ax5.ui.menu({});
menu.onStateChanged = function(){
  console.log(this);
};
```

### onClick
Type: `Function`
```js
var menu = new ax5.ui.menu({
  items: [
    {label:"label"}
  ],
  onClick: function(){
    console.log(this);
  }
});
```
or
```js
var menu = new ax5.ui.menu({});
menu.onClick = function(){
  console.log(this);
};
```

### onLoad
Type: `Function`
```js
var menu = new ax5.ui.menu({
  items: [
    {label:"label"}
  ],
  onLoad: function(){
    console.log(this);
  }
});
```
or
```js
var menu = new ax5.ui.menu({});
menu.onLoad = function(){
  console.log(this);
};
```


- - -

## popup
`popup(event|position, opts)`
```js
$(document).bind("contextmenu", function (e) {
    menu.popup(e);
    ax5.util.stopEvent(e);
});
```
or use custom position
```js
menu.popup({left:0, top:0, width:200});
$(document).bind("contextmenu", function (e) {
    menu.popup(e, {theme:"basic", filter:function(){
        return true;
    }});
    ax5.util.stopEvent(e);
});
```

- - -
## close
`close()`

- - -

## getCheckValue
`getCheckValue()`
```js
menu.getCheckValue();
// {}
```

- - -

## attach
`attach(Element)`
```html
<div id="attachedMenu-target"
     style="width:100%;height:36px;background: #cccccc;border-bottom:1px solid #000;padding: 0px 20px;"></div>
```

```js
var attachedMenu = new ax5.ui.menu({});
attachedMenu.attach($("#attachedMenu-target"));
```