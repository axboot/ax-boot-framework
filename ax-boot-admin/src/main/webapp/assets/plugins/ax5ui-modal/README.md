[![Build Status](https://travis-ci.org/ax5ui/ax5ui-modal.svg?branch=master)](https://travis-ci.org/ax5ui/ax5ui-modal)
[![npm version](https://badge.fury.io/js/ax5ui-modal.svg)](https://badge.fury.io/js/ax5ui-modal)

# ax5ui-modal
"modal" to display content on a secondary window which disables interactions with the main view.

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_


### Install with bower
```sh
bower install ax5ui-mask
```
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
npm install ax5ui-modal
```

After downloading the install file of npm, you will need to copy it to the location where you want to use as a resource for the project.
If the copy process is inconvenient, it also can be done easily by using `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-modal Github releases](https://github.com/ax5ui/ax5ui-modal/releases)


### Insert "ax5modal" in HTML HEAD.

Folder location can be any for your project. However, please be sure to assign the right path in the project.

```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-modal/master/dist/ax5modal.css" />
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-modal/master/dist/ax5modal.min.js"></script>
```

**CDN urls**
This is a list of CDN urls for ax5ui-modal. ax5ui offers the CDN services through rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-modal/master/dist/ax5modal.css
https://cdn.rawgit.com/ax5ui/ax5ui-modal/master/dist/ax5modal.js
https://cdn.rawgit.com/ax5ui/ax5ui-modal/master/dist/ax5modal.min.js
```

### Basic Usage
```js
var modal = new ax5.ui.modal();
modal.setConfig({
    onStateChanged: function(){
        console.log(this);
    }
});
modal.open();
```

- - -

### Preview
- [See Demonstration](http://ax5.io/ax5ui-modal/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)


[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj) ![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)
