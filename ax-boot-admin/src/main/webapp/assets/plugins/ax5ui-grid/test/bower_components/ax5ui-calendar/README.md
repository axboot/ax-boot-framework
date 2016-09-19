[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj) ![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5ui-calendar

> *Dependencies*
* _[jQuery 1.X+](http://jquery.com/)_
* _[ax5core](http://ax5.io/ax5core)_
* _[bootstrap](http://getbootstrap.com/)_



You can download ax5core by using bower.


```sh
bower install ax5ui-calendar
```
[bower](http://bower.io/#install-bower) is web front-end package manager. using bower, you can resolve the plug-in dependencies under the `bower_components` folder. (You can change the folder location. [.bowerrc](http://bower.io/docs/config/#bowerrc-specification) )

To install ax5ui-calendar by `bower` is recomended. 
[http://bower.io/#install-bower](http://bower.io/#install-bower)  will help you. 
### Install by npm
Otherwise you can download ax5core by using npm.

```sh
npm install jquery
npm install ax5core
npm install ax5ui-calendar
```

In npm, you need to solve the problem of plug-in dependencies.

After you download the file by npm install, you have to copy the file where you want to use as a resource for the project.
this process(managing project files) can be optimize by ['gulp'](http://gulpjs.com/) or ['grunt'](http://gruntjs.com/).


### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-calendar Github releases](https://github.com/ax5ui/ax5ui-calendar/releases)

### Insert the "ax5calendar" in the HTML HEAD.
You can determine folder location freely in you project. But be careful not to accidentally caused exactly the path.
```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-calendar/master/dist/ax5calendar.css">
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-calendar/master/dist/ax5calendar.min.js"></script>
```
***

**CDN urls**
It is CDN url of ax5ui-select. ax5ui offers the CDN services through the rawgit.
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


### Preview
- [See Demostration](http://ax5.io/ax5ui-calendar/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)