[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5ui-formatter

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_


### Install by bower
```sh
bower install ax5ui-formatter
```
[bower](http://bower.io/#install-bower) is web front-end package manager.
using the `bower`, when you install the plug-in is installed to resolve the plug-in dependencies under the `bower_components` folder.  
(You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

It is recommended that you install by using the `bower`. 
If you've never used a bower is, you will be able to be used for [http://bower.io/#install-bower](http://bower.io/#install-bower).

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-formatter Github releases](https://github.com/ax5ui/ax5ui-formatter/releases)


### Insert the "ax5formatter" in the HTML HEAD.

Location of the folder can be determined freely in your project. But be careful not to accidentally caused
exactly the path.
```html
<html>
    <head>
        <link rel="stylesheet" type="text/css" 
        href="bower_components/ax5ui-formatter/dist/ax5formatter.css" />
        <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="bower_components/ax5core/dist/ax5core.min.js"></script>
        <script type="text/javascript" 
        src="bower_components/ax5ui-formatter/dist/ax5formatter.min.js"></script>
    </head>
<body>
    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">Money</span>
            <input name="1" type="text" class="form-control" placeholder="" data-ax5formatter="money" />
        </div>
    </div>
    <div class="form-group">
        <div class="input-group">
            <span class="input-group-addon">Date</span>
            <input name="3" type="text" class="form-control" placeholder="yyyy-mm-dd" data-ax5formatter="date" />
        </div>
    </div>
</body>
</html>
```

### Basic Usages
```js
$('[data-ax5formatter]').ax5formatter();
```

***

### Install by npm
If you do not use the bower, it can be downloaded by using the npm as second best.
In npm, so pile on the package manager for the front end, you need to solve the problem of plug-in dependencies.

```sh
npm install jquery
npm install ax5core
npm install ax5ui-formatter
```

After you download the file in npm install, you will need to copy to the location where you want to use as a resource for the project.
If the inconvenience in the process that you want to copy the file and can be easily copied by using a `gulp` or `grunt`.
***

### Preview
- [See Demostration](http://ax5.io/ax5ui-formatter/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)