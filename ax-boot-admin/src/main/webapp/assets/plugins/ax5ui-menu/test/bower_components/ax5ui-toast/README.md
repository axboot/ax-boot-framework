[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj) ![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# bootstrap-ax5toast

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_


### Install by bower
```sh
bower install bootstrap-ax5toast
```
[bower](http://bower.io/#install-bower) is web front-end package manager.
using the `bower`, when you install the plug-in is installed to resolve the plug-in dependencies under the `bower_components` folder.
(You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

It is recommended that you install by using the `bower`. 
If you've never used a bower is, you will be able to be used for [http://bower.io/#install-bower](http://bower.io/#install-bower).

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [bootstrap-ax5toast Github releases](https://github.com/ax5ui/bootstrap-ax5toast/releases)


### Insert the "ax5toast" in the HTML HEAD.

Location of the folder can be determined freely in your project. But be careful not to accidentally caused
exactly the path.
```html
<html>
    <head>
        <link rel="stylesheet" type="text/css" href="bower_components/bootstrap-ax5toast/dist/ax5toast.css" />
        <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="bower_components/ax5core/dist/ax5core.min.js"></script>
        <script type="text/javascript" src="bower_components/bootstrap-ax5toast/dist/ax5toast.min.js"></script>
    </head>
<body>
....
</body>
</html>
```

### Basic Usages
```js
var myToast = new ax5.ui.toast({
    icon: '<i class="fa fa-bug"></i>',
    containerPosition: "bottom-right",
    closeIcon: '<i class="fa fa-times"></i>'
});

myToast.push('Toast message');
```

- - -

### Install by npm
If you do not use the bower, it can be downloaded by using the npm as second best.
In npm, so pile on the package manager for the front end, you need to solve the problem of plug-in dependencies.

```sh
npm install jquery
npm install ax5core
npm install bootstrap-ax5toast
```

After you download the file in npm install, you will need to copy to the location where you want to use as a resource for the project.
If the inconvenience in the process that you want to copy the file and can be easily copied by using a `gulp` or `grunt`.

- - -


### Preview
- [See Demostration](http://ax5.io/bootstrap-ax5toast/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)