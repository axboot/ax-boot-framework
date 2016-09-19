[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5ui-combobox

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_


### Install by bower
```sh
bower install ax5ui-combobox
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
npm install ax5ui-combobox
```

After you download the file in npm install, you will need to copy to the location where you want to use as a resource for the project.
If the inconvenience in the process that you want to copy the file and can be easily copied by using a `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-combobox Github releases](https://github.com/ax5ui/ax5ui-combobox/releases)


* * *

## USE ax5slect

### Insert the "ax5combobox" in the HTML HEAD.

Location of the folder can be determined freely in your project. But be careful not to accidentally caused exactly the path.
```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.css" />
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.min.js"></script>
```

**CDN urls**
It is CDN url of ax5ui-combobox. ax5ui offers the CDN services through the rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.css
https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.js
https://cdn.rawgit.com/ax5ui/ax5ui-combobox/master/dist/ax5combobox.min.js
```

### Basic Usages
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
- [See Demostration](http://ax5.io/ax5ui-combobox/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)