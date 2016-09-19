[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5ui-grid

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_


### Install by bower
```sh
bower install ax5ui-grid
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
npm install ax5ui-grid
```

After you download the file in npm install, you will need to copy to the location where you want to use as a resource for the project.
If the inconvenience in the process that you want to copy the file and can be easily copied by using a `gulp` or `grunt`.
### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-grid Github releases](https://github.com/ax5ui/ax5ui-grid/releases)


### Insert the "ax5grid" in the HTML HEAD.

Location of the folder can be determined freely in your project. But be careful not to accidentally caused
exactly the path.
```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.css" />
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.min.js"></script>
```

**CDN urls**
It is CDN url of ax5ui-select. ax5ui offers the CDN services through the rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.css
https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.js
https://cdn.rawgit.com/ax5ui/ax5ui-grid/master/dist/ax5grid.min.js
```

### Basic Usages
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
- [See Demostration](http://ax5.io/ax5ui-grid/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)