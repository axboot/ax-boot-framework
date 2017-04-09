[![Build Status](https://travis-ci.org/ax5ui/ax5ui-grid.svg?branch=master)](https://travis-ci.org/ax5ui/ax5ui-grid)
[![npm version](https://badge.fury.io/js/ax5ui-grid.svg)](https://badge.fury.io/js/ax5ui-grid)



# ax5ui-grid
"grid" displays data in a table format with various options provided for configuration.

![ax5grid](src/ax5grid.gif)

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_


### Install with bower
```sh
bower install ax5ui-grid
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
npm install ax5ui-grid
```

After downloading the install file of npm, you will need to copy it to the location where you want to use as a resource for the project.
If the copy process is inconvenient, it also can be done easily by using `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-grid Github releases](https://github.com/ax5ui/ax5ui-grid/releases)


### Insert "ax5grid" in HTML HEAD.

Folder location can be any for your project. However, please be sure to assign the right path in the project.
```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.css" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.min.js"></script>
```

**CDN urls**
This is a list of CDN urls for ax5ui-grid. ax5ui offers the CDN services through the rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.css
https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.js
https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.min.js
```

### Basic Usage
```html
<div data-ax5grid="first-grid" data-ax5grid-config='{name:"my first grid"}' style="height: 100%;"></div>
```
```js
var firstGrid = new ax5.ui.grid();
firstGrid.setConfig({
    target: $('[data-ax5grid="first-grid"]'),
    frozenColumnIndex: 2,
    frozenRowIndex: 0,
    showLineNumber: true,
    showRowSelector: true,
    multipleSelect: true,
    lineNumberColumnWidth: 40,
    rowSelectorColumnWidth: 28,
    sortable: true, 
    multiSort: false,
    header: {
        align: "center",
        columnHeight: 28
    },
    body: {
        align: "center",
        columnHeight: 28,
        onClick: function () {
            // console.log(this);
            this.self.select(this.dindex);
        }
    },
    columns: [
        {
            key: "a",
            label: "필드A",
            width: 80,
            styleClass: function () {
                return "ABC";
            },
            enableFilter: true,
            align: "center"
        },
        {key: "b", label: "필드B", align: "center"},
        {
            key: undefined, label: "필드C", columns: [
            {key: "price", label: "단가", formatter: "money", align: "right"},
            {key: "amount", label: "수량", formatter: "money", align: "right"},
            {key: "cost", label: "금액", align: "right", formatter: "money"}
        ]
        },
        {key: "saleDt", label: "판매일자", align: "center"},
        {key: "customer", label: "고객명"},
        {key: "saleType", label: "판매타입"}
    ]
});
```


***

### Preview
- [See Demonstration](http://ax5.io/ax5ui-grid/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)


[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)
