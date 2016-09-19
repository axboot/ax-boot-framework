# Basic Usage
> formatting the value of the bound Input in the desired format. And, to limit to enter the only permitted string.

## bind()
`bind(Options)`

```js
var formatter = new ax5.ui.formatter();

formatter.bind({
    target: $("#input"),
    pattern: "date"
});

formatter.bind({
    target: $("#input"),
    pattern: "custom",
    getEnterableKeyCodes: function(){},
    getPatternValue: function(){}
});
```

### id

Type: `String` 

formatter unique id

### target

Type: `Dom Element | jQuery Object`

".input-Group" elements that are the target of the picker

### pattern

Type: `String` "money | money(int) | number | date | date(time) | time | bizno | phone | custom"

### getEnterableKeyCodes

Type: `Function`

You can define the keyCode collection to allow input.

### getPatternValue

Type: `Function`

It can be converted to the format required the entered value.


- - -

# jQuery widget

`ax5formatter()`