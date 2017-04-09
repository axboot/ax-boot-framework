![build](https://travis-ci.org/ax5ui/ax5core.svg?branch=master)
[![npm version](https://badge.fury.io/js/ax5core.svg)](https://badge.fury.io/js/ax5core)


# ax5core
"ax5core" is a collection of utility functions which were designed to be used in ax5ui. It consists of "ax5" keys such as "ax5.info", "ax5.util" and others, and class variables can be added under "ax5.ui".

By having the build system, "ax5core" requires only a minimum amount of codes and it can guarantee safety and application-compatibility.

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_

### Install with bower
You can download ax5core by using bower.

```sh
bower install ax5core
```
[bower](http://bower.io/#install-bower) is web front-end package manager.
When you install `bower`, it will be installed under the `bower_components` folder to resolve the plug-in dependencies.  
(You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification))

It is recommended that you install by using `bower`. 
If you've never used bower, please refer to [http://bower.io/#install-bower](http://bower.io/#install-bower).

### Install with npm
If you do not use bower, it also can be installed by using npm as an alternative.
In case of npm, which is the package manager for the front end, you need to solve the problem of plug-in dependencies.

```sh
npm install jquery
npm install ax5core
```

After downloading the install file of npm, you will need to copy it to the location where you want to use as a resource for the project.
If the copy process is inconvenient, it also can be done easily by using `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [Git clone here](https://github.com/ax5ui/ax5core)


### Insert "ax5" in HTML HEAD.
Folder location can be any for your project. However, please be sure to assign the right path in the project.
```html
<script type="text/javascript" src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
```

**CDN urls**
This is a list of CDN urls for ax5core. ax5ui offers the CDN services through the rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.js
https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js
```

### Basic Usage
You can check whether ax5core is installed without any issues, by applying example codes as below.
```js
ax5.util.date("20111111");
//Fri Nov 11 2011 23:59:00 GMT+0900 (KST)
ax5.util.date("20111111", {'return':'yyyy/MM/dd'});
//"2011/11/11"

//set multi option
ax5.util.date("20111111", {'return':'yyyy/MM/dd hh:mm:ss', add:{"d":1}} );
"2011/11/12 23:59:00"
```

### API
- [See API](http://ax5.io/ax5core/info/ax5-info.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)

[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj) 
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg) 