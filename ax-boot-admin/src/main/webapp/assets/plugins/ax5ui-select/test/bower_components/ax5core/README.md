[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj) ![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5core
"ax5core" is a collection of utility functions, designed for use in ax5ui. "ax5core" consist of "ax5" keys.(ax5.info, ax5.util ...) class variable will be added under "ax5.ui".

By these build system, "ax5core" needs only a minimal code and "ax5core" can guarantee the safety, application-compatibility.

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_

### Install by bower
You can download ax5core by using bower.


```sh
bower install ax5core
```
[bower](http://bower.io/#install-bower) is web front-end package manager. using bower, you can resolve the plug-in dependencies under the `bower_components` folder. (You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

To install ax5core by `bower` is recomended. 
[http://bower.io/#install-bower](http://bower.io/#install-bower)  will help you. 
### Install by npm
Otherwise you can download ax5core by using npm.

```sh
npm install jquery
npm install ax5core
```

In npm, you need to solve the problem of plug-in dependencies.

After you download the file by npm install, you have to copy the file where you want to use as a resource for the project.
this process(managing project files) can be optimize by ['gulp'](http://gulpjs.com/) or ['grunt'](http://gruntjs.com/).


### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [Git clone here](https://github.com/ax5ui/ax5core)


### Insert the "ax5" in the HTML HEAD.
You can determine folder location freely in you project. But be careful not to accidentally caused exactly the path.
```html
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
```
***

**CDN urls**
It is CDN url of ax5ui-select. ax5ui offers the CDN services through the rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.js
https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js
```

### Basic Usage
You can check whether ax5core is correctly installed, by these basic example code.
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