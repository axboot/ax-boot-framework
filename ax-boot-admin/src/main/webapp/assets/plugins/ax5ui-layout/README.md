[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5ui-layout

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_

### Install by bower
```sh
bower install ax5ui-layout
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
npm install ax5ui-layout
```

After you download the file in npm install, you will need to copy to the location where you want to use as a resource for the project.
If the inconvenience in the process that you want to copy the file and can be easily copied by using a `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-layout Github releases](https://github.com/ax5ui/ax5ui-layout/releases)


### Insert the "ax5layout" in the HTML HEAD.

Location of the folder can be determined freely in your project. But be careful not to accidentally caused
exactly the path.
```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-layout/master/dist/ax5layout.css" />
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-layout/master/dist/ax5layout.min.js"></script>
```

**CDN urls**
It is CDN url of ax5ui-select. ax5ui offers the CDN services through the rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-layout/master/dist/ax5layout.css
https://cdn.rawgit.com/ax5ui/ax5ui-layout/master/dist/ax5layout.js
https://cdn.rawgit.com/ax5ui/ax5ui-layout/master/dist/ax5layout.min.js
```

### Basic Usages
```html
<div data-ax5layout="ax1" data-config='{layout:"dock-panel"}' style="height: 100%;border:1px solid #ccc;">
    <div data-dock-panel='{dock:"top", split:true, height: 200, maxHeight: 300}'></div>
    <div data-dock-panel='{dock:"bottom", split:"true", height: 200, minHeight: 50, maxHeight: 300}'></div>
    <div data-dock-panel='{dock:"left", split:true, width: 200, minWidth: 50, maxWidth: 300}'></div>
    <div data-dock-panel='{dock:"right", split:true, width: "10%", minWidth: 50, maxWidth: 300}'>

    </div>
    <div data-dock-panel='{dock:"center"}' style="padding: 5px;">

    </div>
</div>
```

```js
$(document.body).ready(function () {
    jQuery('[data-ax5layout="ax1"]').ax5layout();
});
```

***

### Preview
- [See Demostration](http://ax5.io/ax5ui-layout/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)