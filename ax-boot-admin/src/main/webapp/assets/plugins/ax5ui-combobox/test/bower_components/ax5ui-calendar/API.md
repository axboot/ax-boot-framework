# Basic Usage
> calendar UI

How to initialize the properties of the UI, there are two.
You can pass the property values of the UI to `setConfig`.
Using the `new` you can pass when you initialize the UI.

## setConfig()
`setConfig([options, callInit=true])`

```js
var myCalendar = new ax5.ui.calendar();
myCalendar.setConfig({
    target: "target Element", // null
    theme: 'String', // default
    displayDate: "Date|String", // new Date()
    control: { // null
        left: 'String',
        yearTmpl: '%s',
        monthTmpl: '%s',
        right: 'String',
        yearFirst: 'Boolean' // false
    },
    mode: "year|month|day|y|m|d", // day
    selectMode: "year|month|day|y|m|d", // day
    dateFormat: 'String', // yyyy-mm-dd 
    dimensions: {
        height: 'Number', // null
        controlHeight: 'Number', // 40
        controlButtonWidth: 'Number', // 40
        colHeadHeight: 'Number', // 30
        itemPadding: 'Number' // 2
    },
    animateTime: 'Number', // 250
    lang: {
        yearHeading: 'String', // Choose the year
        monthHeading: 'String', // Choose the month
        yearTmpl: 'String', // %s
        months: 'Array', // ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
        dayTmpl: 'String' // %s
    },
    selectable: 'Array|Object',
    marker: 'Object',
    multipleSelect: 'false|Number', // false
    onClick: "Function", // null
    onStateChanged: "Function" // null
});
```
**Easy Way - without setConfig**
```js
new ax5.ui.calendar({options});
```

After the UI has been defined, in Calendar, to change some of the options, there is a reference to the following syntax.
```js
myCalendar.setConfig({
    mode: 'month',
    selectMode: 'month'
}, false);
```
If you pass `false` as the second argument of `setConfig` method, it is possible not to call the `init` function, 
which is started automatically after you change the UI options in `setConfig` function.


### target

Type: `DOMElement`

Display target DOMElement

### theme

Type: `String`

theme that is defined in the class attribute of the Calendar DIV tag if give me to decide the name of the theme when you try to add a theme is added to the Calendar.
Developers can define the CSS Class in `.ax5calendar.theme`, it is possible to Override the properties of the CSS.

### displayDate

Type: `String|Date` [default: new Date()]

Today that are displayed on the calendar

### control

Type: `Object'

```js
{
    left: 'String', // previous button text
    yearTmpl: 'String', // Year to be displayed on the Control bar [%s <= year]
    monthTmpl: 'String', // Month to be displayed on the Control bar [$s <= month]
    right: 'String', // next button text
    yearFirst: 'Boolean' // [default: false] - Month by default to change the output order of the year and month to Control bar will be output first.
}
```
Control bar will not be output by default in the Calendar.

### mode

Type: `year|month|day|y|m|d` [default: 'day']

The Calendar, there are three output modes.

### selectMode

Type: `year|month|day|y|m|d` [default: 'day']

The Calendar, there are three of the selected mode.

### dateFormat

Type: `String` [default: 'yyyy-mm-dd']

When the user selects a date, you will call the `onClick` function that has been defined. It will be the date that has been selected for this function as passed as a String. If you need to change the String to be transmitted, please redefine the `dateFormat`.

### dimensions

Type: `Object` [default: defaultObject]

**defaultObject**
```js
{
    controlHeight: '40px',
    controlButtonWidth: '40px',
    itemPadding: 2
}
```

`dimensions` will be able to define additional height attribute in addition to the properties that have been defined to `defaultObject`.

```js
{
    height: 'Number', // null
    controlHeight: 'Number', // 40
    controlButtonWidth: 'Number', // 40
    itemPadding: 'Number' // 2
}
```
When you define a `height`, you will want to change the date display view in Calendar.


### animateTime

Type: `Number` [default : 250]

### lang

Type: `Object` [default: defaultObject]

**defaultObject**
```js
{
    yearHeading: 'String', // Choose the year
    monthHeading: 'String', // Choose the month
    yearTmpl: 'String', // %s
    months: 'Array', // ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    dayTmpl: 'String' // %s
}
```

### selectable

Type: `Array|Object`

```js
// String array
selectable: ['2016-01-01', '2016-01-02']
// Date array
selectable: [new Date(2016, 0, 1), new Date(2016, 0, 2)]
// range
selectable: { range: [{from: '2016-01-01', to: '2016-01-02'}] }
selectable: { range: [{from: new Date(2016, 0, 1), to: new Date(2016, 0, 2)}] }
// Object
selectable: { '2016-01-01': true, '2016-01-02': true }
```

### marker

Type: `Object`

```js
marker: {
    '2016-02-07': {theme: 'holiday', label: '설날'},
    '2016-02-08': {theme: 'holiday', label: '설날'},
    '2016-02-09': {theme: 'holiday', label: '설날'},
    '2016-02-10': {theme: 'holiday', label: '대체휴일'}
}
```

### multipleSelect

Type: `false|Number` [default: false]

It defines the number of selectable date from the `Calendar`. It is determined the value of the false 1 is the same as.

### onClick

Type: `Function`  


### onStateChanged

Type: `Function`  

onStateChanged function is executed when the dialog of the state is changed,
this.state state value is passed to this time onStateChanged function.

- - -

## changeMode()
`changeMode([mode, changeDate])`

Outputs to the screen in the output mode defined in the `Calendar`. If you pass an argument, you can change the output mode and output reference date.

### mode

Type: `year|month|day|y|m|d`

### changeDate

Type: `Date`


- - - 

## getSelection()
`getSelection()`

Return: `Array` - Calendar Selection

- - -

## setSelection()
`setSelection(selection)`

Changes to state a date is selected, which is included in the `selection`.

### selection

Type: `Array`

- - -

## setSelectable()
`setSelectable(selectable[, isPrint])`

Set the date / year / month that can be selected from the `Calendar`.
`selectable` is, Array and Object(`{from: '', to: ''}`) is made up of.

```js
myCalendar.setSelectable(['2016-01-01', ...]);
myCalendar.setSelectable([new Date(), ...]);
myCalendar.setSelectable({ range: [{from: '2016-01-01', to: '2016-01-10'}] });
myCalendar.setSelectable({ range: [{from: new Date(), to: new Date()}] });
myCalendar.setSelectable({ '2016-01-01': true, '2016-01-02': true });
```

- - -

## setMarker()
`setMarker(marker[, isApply])`

```js
myCalendar.setMarker({
    '2016-02-07': {theme: 'holiday', label: '설날'},
    '2016-02-08': {theme: 'holiday', label: '설날'},
    '2016-02-09': {theme: 'holiday', label: '설날'},
    '2016-02-10': {theme: 'holiday', label: '대체휴일'}
});
```

- - -

## onStateChanged

Type: `Function`

`onStateChanged` function can be defined in setConfig method or new ax5.ui.calendar initialization method.
However, you can us to define an event function after initialization, if necessary

```js
myCalendar.onStateChanged = function(){
    console.log(this);
}
```

- - -

## onClick

Type: `Function`

`onClick` function can be defined in setConfig method or new ax5.ui.calendar initialization method.
However, you can us to define an event function after initialization, if necessary

```js
myCalendar.onClick = function(){
    console.log(this);
}
```
