# ax5.mustache

> "ax5.mustache" is a modified version of mustache 
in the "https://github.com/janl/mustache.js", some of the syntax.


## ax5.mustache.render  
`ax5.mustache.render(template, view)`

 > *Argument01_template, Argument02_view, Usage, Output*


Argument01_ template:
```js
var tmpl = "{{title}} spends {{calc}}";
```
 -  It makes an expression format.

Argument02_ view:
```js
var view = {
  title: "Joe",
  calc: function () {
    return 2 + 4;
  }
};
```
-  It will be a data.

Usage_ ax5.mustache.render(template, view):
```
var output = ax5.mustache.render(template, view);
```
- You can express 'view' data as 'template' format, by "ax5.mustach.render" code

Output_ console.log(output):
```js
Joe spends 6
```

>This module is almost like as the basic usage of mustach.
>Please refer to the [Mustache API.](https://github.com/janl/mustache.js/blob/master/README.md)

>You can use all API of `mustache` in the same way.
>I will introduce the features added in the `ax5.mustache` below.


## Array

 > *Argument01_template, Argument_view, Usage, Output*



Argument01_ template:
```
var template =
"
{{#beatles}}
* {{firstName}} {{lastName}} ({{@i}}) ({{@first}})
{{/beatles}}
"
```
- '#' annotation : loop start signal at Array type.  
- '/'  annotation : loop end signal at Array type.  
- '@' annotation : loop index signal.(It can be used like as '?' with 'first'.(@first=?first))

Argument02_ view:
```js
var view = {
  "beatles": [
    { "firstName": "John", "lastName": "Lennon" },
    { "firstName": "Paul", "lastName": "McCartney" },
    { "firstName": "George", "lastName": "Harrison" },
    { "firstName": "Ringo", "lastName": "Star" }
  ]
};
```


Usage_ ax5.mustache.render(template, view):
```
var output = ax5.mustache.render(template, view);
```


Output:
```
* John Lennon (0) (true)
* Paul McCartney (1) (false)
* George Harrison (2) (false)
* Ringo Star (3) (false)
```

## Object.@each

 > *Argument01_template, Argument02_view, Usage, Output*


Argument01_ template:
```
var template=
"
{{#beatles}}
    {{#@each}}
    * {{@key}} : {{@value.firstName}} {{@value.lastName}}
    {{/@each}}
{{/beatles}}
"
```
- ':' annotation : match the key with value.   
- '.' annotation : access to child variable.


Argument02_ view
```js
var view = {
    "beatles": {
        "John": {"firstName": "John", "lastName": "Lennon"},
        "Paul": {"firstName": "Paul", "lastName": "McCartney"},
        "George": {"firstName": "George", "lastName": "Harrison"},
        "Ringo": {"firstName": "Ringo", "lastName": "Star"}
    }
}
```

Usage_ ax5.mustache.render(template, view):
```
var output = ax5.mustache.render(template, view);
```

Output:
```
* John : John Lennon
* Paul : Paul McCartney
* George : George Harrison
* Ringo : Ringo Star
```