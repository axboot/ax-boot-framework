# Basic Usage
> mediaViewer UI

How to initialize the properties of the UI, there are two.
You can pass the property values of the UI to `setConfig`.
Using the `new` you can pass when you initialize the UI.


## setConfig()
`setConfig([options, callInit=true])`

```js
var myViewer = new ax5.ui.mediaViewer();
myViewer.setConfig({
    target: "target Element", // null
    theme: 'String', // default
    loading: {
      icon: '<i class="fa fa-spinner fa-pulse fa-2x fa-fw margin-bottom" aria-hidden="true"></i>',
      text: '<div>Now Loading</div>'
    },
    viewer: {
      ratio: 16/9
    },
    media: {
      prevHandle: '<i class="fa fa-chevron-left"></i>',
      nextHandle: '<i class="fa fa-chevron-right"></i>',
      width: 36, height: 36,
      poster: '<i class="fa fa-youtube-play" style="line-height: 32px;font-size: 20px;"></i>',
      list: [
        {video:{html:'', poster:''}},
        {image:{src: '', poster:''}}
      ]
    }
});
```

**Easy Way - without setConfig**

```js
var myViewer = new ax5.ui.mediaViewer({});
```


### target

Type: `DOMElement`

Display target DOMElement

### theme

Type: `String`


- - -

## setMediaList()
`setMediaList(Object Array)`