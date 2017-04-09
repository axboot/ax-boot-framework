# Basic Usage
> picker will be able to enter a value for the input element through the other UI.

## bind()
`bind(Options)`

```js
var picker = new ax5.ui.picker();

picker.bind({
    target: $("#input"),
    direction: "top",
    contentWidth: 200,
    content: function (callback) {
        var html = ''
                + 'HTML CONTENT'
            ;
        callback(html);
    }
);

picker.bind({
    zIndex: 5000,
    id: "my-picker-01",
    target: $("#input"),
    direction: "top",
    contentWidth: 200,
    content: {
        width: 270,
        margin: 10,
        type: 'date',
        config: {
            // calendar UI config
        },
        formatter: {
            pattern: 'date'
        }
    },
    btns: {
        ok: {label: "확인", theme: "default"}
    }
);
```

### zIndex
Type: `Number`

### id

Type: `String` 

picker unique id

### target

Type: `Dom Element | jQuery Object`

".input-Group" elements that are the target of the picker

### direction

Type: `String` "top|left|right|bottom|auto"

### content

Type: `Function|Object`

- **Function**
```js
function (callback) {
    var html = 'HTML CONTENT';
    callback(html);
}
```
- **Object**
```js
{
    width: 270,
    margin: 10,
    type: 'date',
    config: {
        // calendar UI config
    },
    formatter: {
        // formatter UI config
    }
}
```
- **width** `Number`
- **margin** `Number`
- **type** `String`
  - date
  - secure-num

- **config** `Object`
- **formatter** `Object`

#### contentType : 'date'
```js
{
    width: 270,
    margin: 10,
    type: 'date',
    config: {
        control: {
            left: '<i class="fa fa-chevron-left"></i>',
            yearTmpl: '%s',
            monthTmpl: '%s',
            right: '<i class="fa fa-chevron-right"></i>'
        },
        lang: {
            yearTmpl: "%s년",
            months: ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'],
            dayTmpl: "%s"
        }
    },
    formatter: {
        pattern: 'date'
    }
}
```

#### contentType : 'secure-num'
```js
{
    width: 200,
    margin: 10,
    type: 'secure-num',
    config: {
        btnWrapStyle: "padding:3px;width:25%;",
        btnStyle: "width:100%",
        btnTheme: "info btn-sm",
        specialBtnTheme: " btn-sm"
    },
    formatter: {
        pattern: 'number'
    }
}
```

### contentWidth

Type: `Number`

If the content type of the function, recommended to set this value.

### btns

Type: `Object`

```js
{
    ok: {label: "확인", theme: "default"}
}
```

- - -

## onStateChanged

Type: `Function`

`onStateChanged` function can be defined in setConfig method or new ax5.ui.picker initialization method.
However, you can us to define an event function after initialization, if necessary

```js
var picker = new ax5.ui.picker({
    onStateChanged: function(){
        console.log(this);
    }
});

picker.onStateChanged = function(){
    console.log(this);
}
```

- - -

## setContentValue()

`setContentValue(boundObjectId, inputSeq, value)`

### boundObjectId

Type: `String`

picker unique id

### inputSeq

.input-group's input seq

- - -

## open()

`open(boundObjectId)`

### boundObjectId

Type: `String`

picker unique id

- - -

## close()

`close()`

***

# jQuery extends

## ax5picker
`ax5picker({bindConfigs})`
```js
$('[data-ax5picker="date"]').ax5picker({
    direction: "top",
    content: {
        width: 270,
        margin: 10,
        type: 'date'
    }
});
```

### open
`ax5picker("open")`
```js
$('[data-ax5picker]').ax5picker("open");
```

### close
`ax5picker("close")`
```js
$('[data-ax5picker]').ax5picker("close");
```

### setValue
`ax5select("setValue", inputSeq, value)`
```js
$('[data-ax5picker]').ax5picker("setValue", 0, "optionValue2");
```

