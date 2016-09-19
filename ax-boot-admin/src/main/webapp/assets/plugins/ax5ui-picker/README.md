[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5ui-picker

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_
> * _[ax5calendar](http://ax5.io/ax5calendar)_
> * _[ax5formatter](http://ax5.io/ax5formatter)_


### Install by bower
```sh
bower install ax5ui-picker
```
[bower](http://bower.io/#install-bower) is web front-end package manager.
using the `bower`, when you install the plug-in is installed to resolve the plug-in dependencies under the `bower_components` folder.  
(You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

It is recommended that you install by using the `bower`. 
If you've never used a bower is, you will be able to be used for [http://bower.io/#install-bower](http://bower.io/#install-bower).

### Install by npm
If you do not use the bower, it can be downloaded by using the npm as second best.
In npm, so pile on the package manager for the front end, you need to solve the problem of plug-in dependencies.

```sh
npm install jquery
npm install ax5core
npm install ax5ui-calendar
npm install ax5ui-formatter
npm install ax5ui-picker
```

After you download the file in npm install, you will need to copy to the location where you want to use as a resource for the project.
If the inconvenience in the process that you want to copy the file and can be easily copied by using a `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-picker Github releases](https://github.com/ax5ui/ax5ui-picker/releases)


### Insert the "ax5picker" in the HTML HEAD.

Location of the folder can be determined freely in your project. But be careful not to accidentally caused
exactly the path.
```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-picker/master/dist/ax5picker.css" />
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-calendar/master/dist/ax5calendar.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-formatter/master/dist/ax5formatter.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-picker/master/dist/ax5picker.min.js"></script>
```

### USE CDN
```
https://cdn.rawgit.com/ax5ui/ax5ui-picker/master/dist/ax5picker.css
https://cdn.rawgit.com/ax5ui/ax5ui-picker/master/dist/ax5picker.js
https://cdn.rawgit.com/ax5ui/ax5ui-picker/master/dist/ax5picker.min.js
```

### Basic Usages
```html
<div class="input-group" id="pickerTarget">
    <input type="text" class="form-control" placeholder="" />
    <span class="input-group-addon"><i class="fa fa-calendar-o"></i></span>
</div>
```

```js
var picker = new ax5.ui.picker();
picker.bind({
    target: $("#pickerTarget"),
    direction: "top",
    contentWidth: 200,
    content: function (callBack) {
        var html = ''
                + 'picker contents'
                + '<div style="padding: 10px;">'
                + '<button class="btn btn-default">FN 1</button>'
                + '</div>'
            ;
        callBack(html);
    }
});
```

***

### Preview
- [See Demostration](http://ax5.io/ax5ui-picker/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)