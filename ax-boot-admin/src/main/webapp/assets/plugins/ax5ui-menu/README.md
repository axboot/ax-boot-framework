[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5ui-menu

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_


### Install with bower
```sh
bower install ax5ui-menu
```
[bower](http://bower.io/#install-bower) is web front-end package manager.
[bower](http://bower.io/#install-bower) is web front-end package manager.
When you install `bower`, it will be installed under the `bower_components` folder to resolve the plug-in dependencies.  
(You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

It is recommended that you install by using `bower`. 
If you've never used bower, please refer to [http://bower.io/#install-bower](http://bower.io/#install-bower).

### Install with npm
If you do not use bower, it also can be installed by using npm as an alternative.
In case of npm, which is the package manager for the front end, you need to solve the problem of plug-in dependencies.

```sh
npm install jquery
npm install ax5core
npm install ax5ui-menu
```

After downloading the install file of npm, you will need to copy it to the location where you want to use as a resource for the project.
If the copy process is inconvenient, it also can be done easily by using `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-menu Github releases](https://github.com/ax5ui/ax5ui-menu/releases)


### Insert "ax5menu" in HTML HEAD.
Folder location can be any for your project. However, please be sure to assign the right path in the project.

```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-menu/master/dist/ax5menu.css" />
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-menu/master/dist/ax5menu.min.js"></script>
```

**CDN urls**
This is a list of CDN urls for ax5ui-menu. ax5ui offers the CDN services through rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-menu/master/dist/ax5menu.css
https://cdn.rawgit.com/ax5ui/ax5ui-menu/master/dist/ax5menu.js
https://cdn.rawgit.com/ax5ui/ax5ui-menu/master/dist/ax5menu.min.js
```

### Basic Usage
```js
var menu = new ax5.ui.menu({
    theme: 'primary',
    items: [
        {label: "Menu 0"},
        {label: "Menu 1"}
    ]
});

$(document).bind("contextmenu", function (e) {
    menu.popup(e); // e || {left: 'Number', top: 'Number', direction: '', width: 'Number'}
    ax5.util.stopEvent(e);
});
```

***

### Preview
- [See Demostration](http://ax5.io/ax5ui-menu/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)