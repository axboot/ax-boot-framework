# Basic Usage
> dialog is a UI that can be used as an alternative means of window.alert, window.confirm and window.prompt

How to initialize the properties of the UI, there are two.
You can pass the property values of the UI to `setConfig`.
Using the `new` you can pass when you initialize the UI.

## setConfig()
`setConfig([options, callInit=true])`
 
```js
var myDialog = new ax5.ui.dialog();
myDialog.setConfig({
    title: [String],
    theme: [String],
    width: [Number], 
    onStateChanged: [Function],
    btns: [Object],
    input: [Object]
});
```

**Easy Way - without setConfig**
```js
var myDialog = new ax5.ui.dialog({
    title: [String],
    theme: [String],
    width: [Number], 
    onStateChanged: [Function],
    btns: [Object],
    input: [Object]
});
```

### title

Type: `String`  

Title of dialog.


### theme

Type: `String`  

Theme of dialog, ax5dialog themes using six colors defined by the bootstrap is provided.


### width

Type: `Number`  

Dialog width


### onStateChanged

Type: `Function`  

onStateChanged function is executed when the dialog of the state is changed,
this.state state value is passed to this time onStateChanged function.


### btns

Type: `Object`  

You can re-define the user's selection button in dialog.confirm.

```json
btns: {
    del: {
        label:'Delete', theme:'warning', onClick: function(key){
            console.log(key, this);
            confirmDialog.close();
        }
    },
    cancel: {
        label:'Cancel', onClick: function(key){
            console.log(key, this);
            confirmDialog.close();
        }
    },
    other: {
        label:'Other', onClick: function(key){
            console.log(key, this);
            confirmDialog.close();
        }
    }
}
```


### input

Type: `Object`  

You can re-define the user's input value in dialog.prompt.

```json
input: {
    name: {label:"1. Name", placeholder: "Input your name"},
    age: {label:"2. Age", type:"number", value: "22"}
}
```

***

## alert()
`alert(String|Options[, callback])`

If this is String in the first argument and recognizes the first argument to `msg`.  
it is possible to redefine all of the options that can be used in setConfig.  
If after the alert, user clicks the [OK] button, you need to pass an anonymous function as the second argument of the alert if there is a need of any such actions.

```js
dialog.alert('Alert message', function () {
    console.log(this);
});

dialog.alert({
    title: 'TITLE',
    theme: 'danger',
    msg:'Alert message'
}, function () {
    console.log(this);
});
```

## confirm()
`confirm(String|Options[, callback])`

alert and use the way is similar. Remember only the portion that determines the input of users in callback function confirm is if you can.

```js
confirmDialog.confirm({
    title: "Confirm Title",
    msg: 'Confirm message'
}, function(){
    if(this.key == "ok"){
        alert('OK');
    }
    else if(this.key == "cancel"){
        alert('CANCEL');
    }
});
```

## prompt()
`prompt(String|Options[, callback])`

alert and use the way is similar. 

```js
promptDialog.prompt({
    title: "Confirm Title",
    msg: 'Confirm message'
}, function(){
    console.log(this);
    // {key: "ok", value: [User Input Data]}
});

promptDialog.prompt({
    input: {
        name: {label:"1. Name", placeholder: "Input your name"},
        age: {label:"2. Age", type:"number", value: "22"}
    }
}, function(){
    console.log(this);
    // this.name, this.age
});
```

## close()
`close()`

### onStateChanged

Type: `Function`

`onStateChanged` function can be defined in setConfig method or new ax5.ui.dialog initialization method.
However, you can us to define an event function after initialization, if necessary

```js
myDialog.onStateChanged = function(){
    console.log(this);
}
```