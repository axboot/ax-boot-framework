[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj) ![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5ui-calendar

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_


### Install by bower
```sh
bower install ax5ui-calendar
```
[bower](http://bower.io/#install-bower) is web front-end package manager.
using the `bower`, when you install the plug-in is installed to resolve the plug-in dependencies under the `bower_components` folder.
(You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

It is recommended that you install by using the `bower`. 
If you've never used a bower is, you will be able to be used for [http://bower.io/#install-bower](http://bower.io/#install-bower).

### Download code

- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-calendar Github releases](https://github.com/ax5ui/ax5ui-calendar/releases)


### Insert the "ax5calendar" in the HTML HEAD.

Location of the folder can be determined freely in your project. But be careful not to accidentally caused
exactly the path.
```html
<html>
    <head>
        <link rel="stylesheet" type="text/css" 
        href="bower_components/ax5ui-calendar/dist/ax5calendar.css" />
        <script type="text/javascript" src="bower_components/jquery/dist/jquery.min.js"></script>
        <script type="text/javascript" src="bower_components/ax5core/dist/ax5core.min.js"></script>
        <script type="text/javascript" 
        src="bower_components/ax5ui-calendar/dist/ax5calendar.min.js"></script>
    </head>
<body>
....
</body>
</html>
```

### USE CDN
```
https://cdn.rawgit.com/ax5ui/ax5ui-calendar/master/dist/ax5calendar.css
https://cdn.rawgit.com/ax5ui/ax5ui-calendar/master/dist/ax5calendar.js
https://cdn.rawgit.com/ax5ui/ax5ui-calendar/master/dist/ax5calendar.min.js
```

### Basic Usages
```js
var myCalendar = new ax5.ui.calendar({
    target: document.getElementById("calendar-target"),
    displayDate: (new Date()),
    onClick: function () {
        console.log(this);
        console.log(myCalendar.getSelection());
    },
    onStateChanged: function () {
        console.log(this);
    }
});
```

- - -

### Install by npm
If you do not use the bower, it can be downloaded by using the npm as second best.
In npm, so pile on the package manager for the front end, you need to solve the problem of plug-in dependencies.

```sh
npm install jquery
npm install ax5core
npm install ax5ui-calendar
```

After you download the file in npm install, you will need to copy to the location where you want to use as a resource for the project.
If the inconvenience in the process that you want to copy the file and can be easily copied by using a `gulp` or `grunt`.

- - -


### Preview
- [See Demostration](http://ax5.io/ax5ui-calendar/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)