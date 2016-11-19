[![npm version](https://badge.fury.io/js/ax5ui-media-viewer.svg)](https://badge.fury.io/js/ax5ui-media-viewer)

# ax5ui-media-viewer
"media-player" to display media content such as video and image.
> *Dependencies*
> * _[jQuery 1.X+](http://jquery.com/)_
> * _[ax5core](http://ax5.io/ax5core)_
> * _[bootstrap](http://getbootstrap.com/)_

### Install with bower
```sh
bower install ax5ui-media-viewer
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
npm install ax5ui-media-viewer
```

After downloading the install file of npm, you will need to copy it to the location where you want to use as a resource for the project.
If the copy process is inconvenient, it also can be done easily by using `gulp` or `grunt`.

### Download code
- [ax5core Github releases](https://github.com/ax5ui/ax5core/releases)
- [ax5ui-media-viewer Github releases](https://github.com/ax5ui/ax5ui-media-viewer/releases)


### Insert "ax5media-viewer" in HTML HEAD.

Folder location can be any for your project. However, please be sure to assign the right path in the project.

```html
<link rel="stylesheet" type="text/css" href="https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.css" />
<script type="text/javascript" src="https://code.jquery.com/jquery-1.12.3.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5core/master/dist/ax5core.min.js"></script>
<script type="text/javascript" src="https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.min.js"></script>
```

**CDN urls**
This is a list of CDN urls for ax5ui-media-viewer. ax5ui offers the CDN services through rawgit.
```
https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.css
https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.js
https://cdn.rawgit.com/ax5ui/ax5ui-media-viewer/master/dist/ax5media-viewer.min.js
```

### Basic Usage
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
- [See Demonstration](http://ax5.io/ax5ui-media-viewer/demo/index.html)

If you have any questions, please refer to the following [gitHub](https://github.com/ax5ui/ax5ui-kernel)


[![axisj-contributed](https://img.shields.io/badge/AXISJ.com-Contributed-green.svg)](https://github.com/axisj)
![](https://img.shields.io/badge/Seowoo-Mondo&Thomas-red.svg)
