# Basic Usage
> It is a dropdown UI. It supports multi-selection, based on a html select tag

## setConfig()
`setConfig(config)`

How to initialize the properties of the UI, there are two.
You can pass the property values of the UI to `setConfig`.
Using the `new` you can pass when you initialize the UI.

```js
var select = new ax5.ui.select({
  theme: 'default',
  animateTime: 250,
  lang: {
      emptyOfSelected: '',
      multipleLabel: '"{{label}}"외 {{length}}건'
  },
  columnKeys: {
      optionValue: 'value',
      optionText: 'text',
      optionSelected: 'selected'
  }
});
// or
select.setConfig({
  theme: 'default',
  animateTime: 250,
  lang: {
      noSelected: '',
      noOptions: 'no options',
      loading: 'now loading..',
      multipleLabel: '"{{label}}"외 {{length}}건'
  },
  columnKeys: {
      optionValue: 'value',
      optionText: 'text',
      optionSelected: 'selected'
  }
});
```

### theme
Type: `String`

### animateTime
Type: `Number`

### lang
Type: `Object`

### columnKeys
Type: `Object`
This is used to define the internal name of the key. The object of the options

```js
var options = [
  {id:1, text:"text"}
];

var select = new ax5.ui.select({
  columnKeys: {
    optionValue: 'id',
    optionText: 'text',
  }
});
```

---


## bind()
`bind(Options)`

```html
<div class="form-group">
    <div data-ax5select="select1" data-ax5select-config='{}'></div>
</div>
```
```js
var select = new ax5.ui.select();

select.bind({
  target: $('[data-ax5select="select1"]'),
  options: [
    {value: "optionValue1", text: "optionText1"},
    {value: "optionValue2", text: "optionText2"}
  ]
});
```

### id

Type: `String`

select unique id

### theme

Type: `String`

### multiple

Type: `Boolean`

### target

Type: `Dom Element | jQuery Object`

element that are the target of the select, element must have "data-ax5select" attribute

### options

Type: `Array`

### onStateChanged

Type: `Function`

`onStateChanged` function can be defined in setConfig method or new ax5.ui.select initialization method.
However, you can us to define an event function after initialization, if necessary

```js
var select = new ax5.ui.select({
    onStateChanged: function(){
        console.log(this);
    }
});

select.onStateChanged = function(){
    console.log(this);
}
```

### reset

Type: `String`

multiple selected clear icon

```js
select.bind({
  target: $('[data-ax5select="select1"]'),
  reset:"<i class=\"fa fa-trash\"></i>",
  options: [
    {value: "optionValue1", text: "optionText1"},
    {value: "optionValue2", text: "optionText2"}
  ]
});
```

### onExpand

Type: `Function`

```js
select.bind({
  target: $('[data-ax5select="select1"]'),
  lang: {
      loading: '<i class="fa fa-spinner fa-pulse"></i>'
  },
  onExpand: function (callBack) {
      setTimeout(function () {
        callBack({
            options: [
                {value: "V0", text: "callBack Text 0"},
                {value: "V1", text: "callBack Text 1"},
                {value: "V2", text: "callBack Text 2"},
                {value: "V3", text: "callBack Text 3"}
            ]
        });
      }, 300);
  }
});
```

## open()
`open(boundID)`

### boundID
Type: `String|Number|Element`

```js
var el = $('[data-ax5select="select1"]').get(0);
mySelect.open(el);
mySelect.open($('[data-ax5select="select1"]'));
mySelect.open(0);
```

## update()
`update(Options)`

```js
mySelect.update({
  target: $('[data-ax5select="select1"]'),
  options: [...]
});
```

## val()
`val(boundID[, value, selected])`

```js
mySelect.val($('[data-ax5select="select1"]'), "optionValue2"); // setValue
mySelect.val($('[data-ax5select="select1"]')); // getValue
```

## close()
`close()`

## enable()
`enable(boundID)`
```js
mySelect.enable($('[data-ax5select="select1"]'));
```

## disable()
`disable(boundID)`
```js
mySelect.disable($('[data-ax5select="select1"]'));
```
***

# jQuery extends

## ax5select
`ax5select(options)`

```js
$('[data-ax5select]').ax5select({
    options: options
});
```

### open
`ax5select("open")`
```js
$('[data-ax5select]').ax5select("open");
```

### close
`ax5select("close")`
```js
$('[data-ax5select]').ax5select("close");
```

### setValue
`ax5select("setValue")`
```js
$('[data-ax5select]').ax5select("setValue", "optionValue2");
```

### getValue
`ax5select("getValue")`
```js
$('[data-ax5select]').ax5select("getValue");
```

### enable
`ax5select("enable")`
```js
$('[data-ax5select]').ax5select("enable");
```

### disable
`ax5select("disable")`
```js
$('[data-ax5select]').ax5select("disable");
```

