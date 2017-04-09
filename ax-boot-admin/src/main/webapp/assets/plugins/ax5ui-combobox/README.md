[![Build Status](https://travis-ci.org/ax5ui/ax5ui-combobox.svg?branch=master)](https://travis-ci.org/ax5ui/ax5ui-combobox)
[![npm version](https://badge.fury.io/js/ax5ui-combobox.svg)](https://badge.fury.io/js/ax5ui-combobox)

# ax5ui-combobox
"combobox" lets users make a selection from a drop-down list.

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_


### Install with bower
```sh
bower install ax5ui-combobox
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
npm install ax5ui-combobox
```

After downloading the install file of npm, you will need to copy it to the location where you want to use as a resource for the project.
If the copy process is inconvenient, it also can be done easily by using `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-combobox Github releases](https://github.com/ax5ui/ax5ui-combobox/releases)

* * *

### Insert "ax5combobox" in HTML HEAD.
Folder location can be any for your project. However, please be sure to assign the right path in the project.
```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.min.js"></script>
```

**CDN urls**
This is a list of CDN urls for ax5ui-combobox. ax5ui offers the CDN services through the rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.css
https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.js
https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.min.js
```

### Basic Usage
```html
<div class="form-group">
    <input type="text" data-ax5combobox="combobox1" data-ax5combobox-config='{}'/>
</div>
```
```js
var options = [];
for (var i = 0; i < 100; i++) {
    options.push({value: "optionValue" + i, text: "optionText" + i});
}

$('[data-ax5combobox]').ax5combobox({
    options: options
});
```


***

## Preview
- [See Demonstration](http://ax5.io/ax5ui-combobox/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)


[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)
