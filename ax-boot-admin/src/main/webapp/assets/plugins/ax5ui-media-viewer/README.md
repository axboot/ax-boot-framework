[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)

# ax5ui-media-viewer

> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_

### Install by bower
```sh
bower install ax5ui-media-viewer
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
npm install ax5ui-media-viewer
```

After you download the file in npm install, you will need to copy to the location where you want to use as a resource for the project.
If the inconvenience in the process that you want to copy the file and can be easily copied by using a `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-media-viewer Github releases](https://github.com/ax5ui/ax5ui-media-viewer/releases)


### Insert the "ax5media-viewer" in the HTML HEAD.

Location of the folder can be determined freely in your project. But be careful not to accidentally caused
exactly the path.
```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.css" />
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.min.js"></script>
```

**CDN urls**
It is CDN url of ax5ui-select. ax5ui offers the CDN services through the rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.css
https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.js
https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.min.js
```

### Basic Usages
```html
<div id="media-viewer-target-0"></div>
```

```js
$(document.body).ready(function () {
    var myViewer_0 = new ax5.ui.mediaViewer({
        target: $("#media-viewer-target-0"),
        loading: {
            icon: '<i class="fa fa-spinner fa-pulse fa-2x fa-fw margin-bottom" aria-hidden="true"></i>',
            text: '<div>Now Loading</div>'
        },
        media: {
            prevHandle: '<i class="fa fa-chevron-left"></i>',
            nextHandle: '<i class="fa fa-chevron-right"></i>',
            width: 36, height: 36,
            poster: '<i class="fa fa-youtube-play" style="line-height: 32px;font-size: 20px;"></i>',
            list: [
                {
                    video: {
                        html: '<iframe src="https://player.vimeo.com/video/121840700?color=fcfcfc&badge=0" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
                        poster: ''
                    }
                },
                {
                    image: {
                        src: 'http://www.improgrammer.net/wp-content/uploads/2015/11/top-20-node-js-Frameworks-1.jpg',
                        poster: 'http://www.improgrammer.net/wp-content/uploads/2015/11/top-20-node-js-Frameworks-1.jpg'
                    }
                }
            ]
        }
    });
});
```

***

### Preview
- [See Demostration](http://ax5.io/ax5ui-media-viewer/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)