# Basic Usage
> Modal UI, hold does not exceed the current page, you can use in order to process a simple user input and information. In some cases, by the other page so as to output in the modal, it can also handle the task of more diverse forms.

How to initialize the properties of the UI, there are two.
You can pass the property values of the UI to `setConfig`.
Using the `new` you can pass when you initialize the UI.

## setConfig()
`setConfig([options, callInit=true])`
 
```js
var myModal = new ax5.ui.modal();
myModal.set_config({
    width: "Number",
    height: "Number",
    position: {
        left: "left|center|right|Number", 
        top: "top|middle|bottom|Number", 
        margin: "Number"
    },
    iframeLoadingMsg: "",
    iframe: {
        method: "get|post", 
        url: "String", 
        param: "paramString|Object"
    },
    closeToEsc: "Boolean",
    onStateChanged: "Function",
    animateTime: "Number",
    zIndex: "Number",
    fullScreen: "Boolean",
    header: {
        title: "",
        btns: {
            close: {
                label: '<i class="fa fa-times-circle" aria-hidden="true"></i>', onClick: function(){
                    myModal.close();
                }
            }
        }
    }
});
```

### width

Type: `Number` [default: 300]

Modal width

### height

Type: `Number` [default: 400]

Modal height

### position

Type: `Object` 

**default**
```json
{
    left: "center", // left|center|right|Number
    top: "middle", // top|middle|bottom|Number
    margin: 10
}
```

### iframe

Type: `Object` 

**default**
```json
{
    method: "get", // get|post
    url: "", // iframe src url
    param: "" // parameter
}
```

### closeToEsc

Type: `Boolean`

### onStateChanged

Type: `Function`  

onStateChanged function is executed when the modal of the state is changed,
this.state state value is passed to this time onStateChanged function.

### animateTime

Type: `Number` [default : 300]

### zIndex

Type: `Number`


### fullScreen

Type: `Boolean`  

```json
fullScreen : true
```

### header

Type: `Object'

```json
{
    title:"MODAL TITLE",
    btns: {
        minimize: {
            label: '<i class="fa fa-minus-circle" aria-hidden="true"></i>', onClick: function(){
                modal.minimize();
            }
        },
        maximize: {
            label: '<i class="fa fa-plus-circle" aria-hidden="true"></i>', onClick: function(){
                modal.maximize();
            }
        },
        close: {
            label: '<i class="fa fa-times-circle" aria-hidden="true"></i>', onClick: function(){
                modal.close();
            }
        }
    }
}
```

- - -

## open()
`open(Options[, callBack])`

it is possible to redefine all of the options that can be used in setConfig.  

```js
modal.open();
modal.open({
    width: 500,
    height: 500
});
modal.open({}, function(){
    console.log(this);
});
```

- - -

## css()
`css(Object)`

```js
modal.css({
    width: 400,
    height: 600
});
```

- - -

## align()
`align(Object)`

```js
modal.align({left:"center", top:"middle"});
modal.align({left:"left", top:"top", margin: 20});
```

- - - 

## close()
`close()`


- - -

## minimize()
`minimize()`


- - -

## maximize()
`maximize()`

- - -

## onStateChanged

Type: `Function`

`onStateChanged` function can be defined in setConfig method or new ax5.ui.modal initialization method.
However, you can us to define an event function after initialization, if necessary

```js
modal.onStateChanged = function(){
    console.log(this);
}
```