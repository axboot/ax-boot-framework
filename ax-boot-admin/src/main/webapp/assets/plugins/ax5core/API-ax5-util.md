# Type

## ax5.util.getType()
Return argument's object type.
- argument : any type of variable.
- return : The type of argument(number, string, array, object, function, nodelist, fragment).

```js
ax5.util.getType(1); // "number"
ax5.util.getType("1"); // "string"
ax5.util.getType([0, 1, 2]); // "array"
ax5.util.getType({a: 1}); // "object"
ax5.util.getType(function () {}); // "function"
ax5.util.getType(document.querySelectorAll("div")); // "nodelist"
ax5.util.getType(document.createDocumentFragment()); // "fragment"
```
Javascript object type name is not clear. so util.getType() method is very useful.

---
## ax5.util.is`Type`()
Return Boolean value depending on the correspondence of 'does the argument is this type?'.
- argument : any type of variable.
- return : Boolean Value 1 || 0 (True || False)

```js
// return 1 || 0 (True || False)
ax5.util.isWindow(window);
ax5.util.isElement(document.getElementById("#ax5-util-is-type"));
ax5.util.isObject({});
ax5.util.isArray([]);
ax5.util.isFunction(new Function);
ax5.util.isString('');
ax5.util.isNumber(1);
ax5.util.isNodelist(document.querySelectorAll(".content"));
ax5.util.isUndefined();
ax5.util.isNothing();
ax5.util.isDate();

```

#### ax5.util.isDateFormat
`ax5.util.isDateFormat(String)`

```js
console.log(ax5.util.isDateFormat('20160101')); // true
console.log(ax5.util.isDateFormat('2016*01*01')); // true
console.log(ax5.util.isDateFormat('20161132')); // false
```

---


# Object
## ax5.util.filter
You can freely edit filter function by anonymous function when use.
The data is filtered by your customized filter function.

 - Argument 01 : Original Data.
 - Argument 02 : Anonymous function(filter function). 
 - Usage : ax5.util.filter(Argument01, function(){ return });
 - Output
 
**Example 01**

```js
var aarray = [5, 4, 3, 2, 1];
```
aarray : original data.

```js
var result = ax5.util.filter(array, function () {
    return this % 2;
});
```
edit annoymous function. it will be a filter.

```js
console.log(result);
> [5, 3, 1]
```
if the return value of filter function is false, the data is filtered.


**Example 02**
```js
var list = [
    {isdel: 1, name: "ax5-1"},
    {name: "ax5-2"},
    {isdel: 1,name: "ax5-3"},
    {name: "ax5-4"},
    {name: "ax5-5"}
];
```

```js
var result = ax5.util.filter(list, function () {
    return (this.isdel != 1);
});
```

```js
console.log(JSON.stringify(result));
> [object, object, object]
>> object0.name = ax5-2
>> object1.name = ax5-4
>> object2.name = ax5-5
```

**Example03**
```js
var filObject = {
a : 1, 
s : "string", 
oa : {pickup:true, name:"AXISJ"}, 
os : {pickup:true, name:"AX5"}
};
```

```js
var result = ax5.util.filter( filObject, function(){
	return this.pickup;
});
```

```js
console.log( ax5.util.toJson(result) );
> [{"pickup": , "name": "AXISJ"}, {"pickup": , "name": "AX5"}]
```

---

## ax5.util.search
You can freely edit search function by anonymous function when use.
The search function will return the first item which is correspondent to the function.

- Argument 01 : Original Data.
- Argument 02 : Anonymous function(search function). 
- Usage : Argument01[ ax5.util.search(Argument01, function(){ return }) ];

**Example 01**
```js
var a = ["A", "X", "5"];
```

```js
var idx = ax5.util.search(a, function () {
    return this == "X";
});
```

```js
console.log(a[idx]);
> X
```
if there is no correspondont item, it will retrun -1


**Example 02**
```js
var a = ["A", "X", "5"];
```

```js
console.log(
      a[
        ax5.util.search(a, function (idx){
            return idx == 2;
          })
      ]
    );
> 5
```

**Example 03**
```js
var b = {a: "AX5-0", x: "AX5-1", 5: "AX5-2"};
```

```js
console.log(
      b[
        ax5.util.search(b, function (k) {
            return k == "x";
        })
      ]
    );
> AX5-1
```
---

## ax5.util.map
You can freely edit mapping function by anonymous function when use.
The mapping function will return the array or object which is set by original data.
In the example I've created a simple object array as a numeric array.

 - Argument 01 : Original Data.
 - Argument 02 : Anonymous function(mapping function). 
 - Usage : ax5.util.map(Argument01, function(){ return }).
 - Output

```js
var a = [1, 2, 3, 4, 5];
```
Usage 01 :
```js
a = ax5.util.map(a, function () {
    return {id: this};
});
```

Output 01 :
```js
console.log(ax5.util.toJson(a));
> [{"id": 1},{"id": 2},{"id": 3},{"id": 4},{"id": 5}]
```

Usage 02 :
```js
console.log(
    ax5.util.map({a: 1, b: 2}, function (k, v) {
        return {id: k, value: v};
    })
);
```

Output 02 :
```js
> [object, object]
>> object0.id = a
>> object0.value = 1
>> object1.id = b
>> object1.value = 2
```
---

## ax5.util.merge
concat the 'array like' objects.
- Argument
- Usage
- Output

Argument : 
```js
var a = [1, 2, 3], b = [7, 8, 9];
```
Usage :
```js
var c = ax5.util.merge(a,b);
```

Output :
```js
> [1, 2, 3, 7, 8, 9]
```
---

## ax5.util.reduce
This method is performed by data argument and anonymous function. the anonymous function has two arguments(result value, index value). the anonymous function excute code using the data argument of index value. return value is saved at result value and index value moves to right. repeat this process for the end of data argument.

- Argument 01 : Original Data.
- Argument 02 : Anonymous function(reduce function).
- Usage : ax5.util.reduce(Argument01, function(result, index){ return }).
- Output

**Example 01**
```js
var aarray = [5, 4, 3, 2, 1];
```

```js
console.log(ax5.util.reduce(aarray, function (p, n) {
    return p * n; //This sentence is same to <return p = p*n>
}));
> 120
```
- p : result variable. The return value is saved at 'p'.(initial value = 5)
- n : 'second to last' located variable. (initial value = 4. auto move left to right)

**Example 02**
```js
console.log(ax5.util.reduce({a: 1, b: 2}, function (p, n) {
    return parseInt(p || 0) + parseInt(n);
    // This sentence is same to (return p=p+n;)
}));
> 3
```
- if the first 'p' value is object, 'p' will be undefined. So 'n' will point first index.
- p : result variable. The return value is saved at 'p'. (initial value = 0 (undefined || 0))
- n : the 'value' value of 'first to last' located variable. (initail value = 1)
- parseInt(n) : not necessiry in this example. but parsing is recommended to prevent errors.

---

## ax5.util.reduceRight
Same as "reduce" but with a different direction.
```js
var aarray = [5, 4, 3, 2, 1];
console.log(ax5.util.reduceRight(aarray, function (p, n) {
    return p - n;
}));
-13
```
---

## ax5.util.sum
You can freely edit summation function by anonymous function when use.
The summation function will add the values which corresponds to conditions of your summation function.

- Argument 01 : Original Data.
- Argument 02 : Anonymous function(summation function). 
- Usage : ax5.util.sum(Argument01, function(){ return }).
- Output

Argument :
```js
var arr = [
    {name: "122", value: 9},
    {name: "122", value: 10},
    {name: "123", value: 11}
];
```

Usage 01 :
```js
var rs = ax5.util.sum(arr, function () {
    if(this.name == "122") {
        return this.value;
    }
});
```

Output 01 :
```js
console.log(rs); 
> 19
```

Usage 02 :
```js
console.log(ax5.util.sum(arr, 10, function () {
    return this.value;
}));
```

Output 02 :
```js
> 40
```
---

## ax5.util.avg
You can freely edit averaging function by anonymous function when use.
The averaging function will get average of values which correspond to conditions of your averaging function.

- Argument 01 : Original Data.
- Argument 02 : Anonymous function(averaging function). 
- Usage : ax5.util.avg(Argument01, function(){ return }).
- Output

Argument :
```js
var arr = [
    {name: "122", value: 9},
    {name: "122", value: 10},
    {name: "123", value: 11}
];
```

Usage :
```js
var rs = ax5.util.avg(arr, function () {
    return this.value;
});
```

Output :

```js
console.log(rs); // 10
```
---


## ax5.util.first
It returns the first element in Array or Object. However, to use Array in the "Array [0]" is faster than using the "first()" method.
- Argument 01 : Original Data.
- Usage : ax5.util.first(Argument01)
- Output

Argument :
```js
var _arr = ["ax5", "axisj"];
var _obj = {k: "ax5", z: "axisj"};
```

Usage :
```js
console.log(ax5.util.first(_arr));
console.log(ax5.util.toJson(ax5.util.first(_obj)));
```

Output :
```js
> "ax5"
> {"k": "ax5"}
```
---

## ax5.util.last
It returns the last element in the or Object.

Argument :
```js
var _arr = ["ax5", "axisj"];
var _obj = {k: "ax5", z: "axisj"};
```

Usage :
```js
console.log(ax5.util.last(_arr));
console.log(ax5.util.toJson(ax5.util.last(_obj)));
```

Output :
```js
> "axisj"
> {"z": "axisj"}
```
---

## ax5.util.deepCopy
It returns deep copied Object.
```js
var obj = [
    {name:"A", child:[{name:"a-1"}]},
    {name:"B", child:[{name:"b-1"}], callBack: function(){ console.log('callBack'); }}
];
var copiedObj = ax5.util.deepCopy(obj);

obj[1].callBack();
copiedObj[1].callBack();
copiedObj[1].child[0].name = "c-1";

console.log(obj[1].child[0].name, copiedObj[1].child[0].name);
```

# String

## ax5.util.left
Return string from first index to final index of original data.

- Argument 01 : Original Data.
- Argument 02 : final index || finall character.
- Usage : ax5.util.left(Argument01, Argument02)
- Output

```js
console.log(ax5.util.left("abcd.efd", 3));
> abc
console.log(ax5.util.left("abcd.efd", "."));
> abcd
```
---

## ax5.util.right
Return string from start index to end index of original data. The arrangement is not changing.

- Argument 01 : Original Data.
- Argument 02 : start index || start character.
- Usage : ax5.util.left(Argument01, Argument02)
- Output


```js
console.log(ax5.util.right("abcd.efd", 3));
> efd
console.log(ax5.util.right("abcd.efd", "."));
> efd
```
---

## ax5.util.camelCase
Converts a string to "Camel Case". "a-b", "aB" will be the "aB".
```js
```js
console.log(ax5.util.camelCase("inner-width"));
> innerWidth
console.log(ax5.util.camelCase("innerWidth"));
> innerWidth
console.log(ax5.util.camelCase("camelCase"));
> camelCase
console.log(ax5.util.camelCase("aBc"));
> aBc
```
---

## ax5.util.snakeCase
Converts a string to "Snake Case". "aB" will be the "a-b".
```js
console.log(ax5.util.snakeCase("inner-width"));
> inner-width
console.log(ax5.util.snakeCase("camelCase"));
> camel-case 
console.log(ax5.util.snakeCase("aBc"));
> a-bc
```
---

## ax5.util.setDigit
```js
ax5.util.setDigit(1, 2);
> "01"
```

# Number

## ax5.util.number
by this method, you can modify original data to variety number-like types. there are several options such as round, money, byte, abs.

When the number covers the development, it often requires multiple steps. The syntax is very complex and it is difficult to maintain. "ax5.util.number" command to convert a number that were resolved by passing a JSON format.

- Argument 01 : Original Data.
- Option_round : set dcimal place. less than that place value will be rounded.
- Option_money : convert to money type.(shoots comma for every third digit.)
- Option_byte :  convert to byte, KB, MB, GB.
- Option_abs : set absolute value option.
- Output

```js
console.log('round(1) : ' + ax5.util.number(123456789.678, {round: 1}));
> round(1) : 123456789.7

console.log('round(1) money() : '
    + ax5.util.number(123456789.678, {round: 1, money: true}));
> round(1) money() : 123,456,789.7

console.log('round(2) byte() : '
    + ax5.util.number(123456789.678, {round: 2, byte: true}));
> round(2) byte() : 117.7MB

console.log('abs() round(2) money() : '
    + ax5.util.number(-123456789.678, {abs: true, round: 2, money: true}));
> abs() round(2) money() : 123,456,789.68

console.log('abs() round(2) money() : '
    + ax5.util.number("A-1234~~56789.8~888PX", {abs: true, round: 2, money: true}));
> abs() round(2) money() : 123,456,789.89
```
- - -

# Date
## date
`ax5.util.date(date[, cond])`
```js
ax5.util.date('2013-01-01'); // Tue Jan 01 2013 23:59:00 GMT+0900 (KST)
ax5.util.date((new Date()), {add:{d:10}, return:'yyyy/MM/dd'}); // "2015/07/01"
ax5.util.date('1919-03-01', {add:{d:10}, return:'yyyy/MM/dd hh:mm:ss'}); // "1919/03/11 23:59:00"
ax5.util.date('1919-03-15', {set: "firstDayOfMonth"}); // Sat Mar 01 1919 12:00:00 GMT+0900 (KST)
ax5.util.date('1919-03-15', {set: "lastDayOfMonth"}); // Mon Mar 31 1919 12:00:00 GMT+0900 (KST)
```

## dday
`ax5.util.dday(date[, cond])`
```js
ax5.util.dday('2016-01-29'); // 1
ax5.util.dday('2016-01-29', {today:'2016-01-28'}); // 1
ax5.util.dday('1977-03-29', {today:'2016-01-28', age:true}); // 39
```

## weeksOfMonth
`ax5.util.weeksOfMonth(date)`
```js
ax5.util.weeksOfMonth("2015-10-01"); // {year: 2015, month: 10, count: 1}
ax5.util.weeksOfMonth("2015-09-19"); // {year: 2015, month: 9, count: 3}
```

## daysOfMonth
`ax5.util.daysOfMonth(year, month)`
```js
ax5.util.daysOfMonth(2015, 11); // 31
ax5.util.daysOfMonth(2015, 1); // 28
```

- - -

# Misc.
## ax5.util.param
The parameter values may in some cases be the "Object" or "String". At this time, useing the "param", it can be the same as verifying the parameter value.
```js
console.log(ax5.util.param({a: 1, b: '123\'"2&'}, "param"));
// a=1&b=123%27%222%26
console.log(ax5.util.param("a=1&b=12'\"32", "param"));
//a=1&b=12'"32
console.log(ax5.util.toJson(util.param("a=1&b=1232")));
// {"a": "1", "b": "1232"}
```
---

## ax5.util.parseJson
parsing a little more than the less sensitive the JSON syntax "JSON.parse".
```js
console.log(ax5.util.toJson(ax5.util.parseJson("[{'a':'99'},'2','3']")[0]));
// {"a": "99"}
console.log(ax5.util.parseJson("{a:1}").a);
// 1
console.log(ax5.util.toJson(ax5.util.parseJson("{'a':1, 'b':function(){return 1;}}", false)));
// {"error": 500, "msg": "syntax error"}
console.log(ax5.util.toJson(ax5.util.parseJson("{'a':1, 'b':function(){return 1;}}", true)));
// {"a": 1, "b": "{Function}"}
```
---

## ax5.util.toJson
```js
console.log(ax5.util.toJson(1));
// 1
console.log(ax5.util.toJson("A"));
// "A"
console.log(ax5.util.toJson([1, 2, 3, 'A']));
// [1,2,3,"A"]
console.log(ax5.util.toJson({a: 'a', x: 'x'}));
// {"a": "a", "x": "x"}
console.log(ax5.util.toJson([1, {a: 'a', x: 'x'}]));
// [1,{"a": "a", "x": "x"}]
console.log(ax5.util.toJson({a: 'a', x: 'x', list: [1, 2, 3]}));
// {"a": "a", "x": "x", "list": [1,2,3]}
console.log(ax5.util.toJson(function () {}));
// "{Function}"
```
---

## ax5.util.alert
```js
ax5.util.alert({a: 1, b: 2});
```
--- 
## ax5.util.toArray
It converts 'Array-like objects' to 'Array' such as nodelist, arguments. 'Array-like objects' already have some useful properties such as "length", however they can not applied for functions defined in Array.prototype. So, if you want to use array functions, convert to Array by toArray() method. it's very easy to convert.

- Argument 01 : Original Data.
- Usgae : ax5.util.toArray(Argument);
- Output

Usage :
```js
function something() {
    var arr = ax5.util.toArray(arguments);
    console.log(ax5.util.toJson(arr));
}
something("A", "X", "I", "S", "J");
```

Output :
```js
> ["A","X","I","S","J"]
```
---

## ax5.util.setCookie
```js
ax5.util.setCookie("ax5-cookie", "abcde");
ax5.util.setCookie("ax5-cookie-path", "abcde", 2, {path: "/"});
```
---

## ax5.util.getCookie
```js
console.log(ax5.util.getCookie("ax5-cookie"));
// abcde
console.log(ax5.util.getCookie("ax5-cookie-path"));
// abcde
```
---

## ax5.util.findParentNode
```js
/*
var cond = {
    tagname: {String} - tagName (ex. a, div, span..),
    clazz: {String} - name of Class
    [, attributes]
};
*/

console.log(
    ax5.util.findParentNode(e.target, {tagname:"a", clazz:"ax-menu-handel", "data-custom-attr":"attr_value"})
);

// using cond 
jQuery('#id').bind("click.app_expand", function(e){
    var target = ax5.util.findParentNode(e.target, function(target){
        if($(target).hasClass("aside")){
            return true;
        }
        else{
            return true;
        }
    });
    //client-aside
    if(target.id !== "client-aside"){
        // some action
    }
}); 
```

## ax5.util.cssNumber
```js
console.log(ax5.util.cssNumber('100px'));
// 100px
console.log(ax5.util.cssNumber(100));
// 100px
console.log(ax5.util.cssNumber('100%'));
// 100%
console.log(ax5.util.cssNumber('##100@'));
// 100px
```

## ax5.util.css
```js
console.log(ax5.util.css({
    background: "#ccc",
    padding: "50px",
    width: "100px"
}));
// background:#ccc;padding:50px;width:100px;
console.log(ax5.util.css('width:100px;padding: 50px; background: #ccc'));
// {width: "100px", padding: "50px", background: "#ccc"}
```

## ax5.util.stopEvent
```js
ax5.util.stopEvent(e);
```

## ax5.util.selectRange
```html
<div id="select-test-0" contentEditable="true">SELECT TEST</div>
<div id="select-test-1" contentEditable="true">SELECT TEST</div>
<div id="select-test-2" contentEditable="true">SELECT TEST</div>

<script>
    $(document.body).ready(function () {
        ax5.util.selectRange($("#select-test-0"), "end"); // focus on end
        ax5.util.selectRange($("#select-test-1").get(0), [1, 5]); // select 1~5
        //ax5.util.selectRange($("#select-test-2"), "start"); // focus on start
        //ax5.util.selectRange($("#select-test-2")); // selectAll
        //ax5.util.selectRange($("#select-test-2"), "selectAll"); // selectAll
    });
</script>
```

## ax5.util.debounce
`ax5.util.debounce(func, wait[, immediately])`
```js
var debounceFn = ax5.util.debounce(function( val ) {
    console.log(val);
}, 300);

$(document.body).click(function(){
    debounceFn(new Date());
});
```

## ax5.util.string
`ax5.util.string(String).format([args]);`  
`ax5.util.string(String).escape();`  
`ax5.util.string(String).unescape();`  
`ax5.util.string(String).encode();`  
`ax5.util.string(String).decode();`   
`ax5.util.string(String).left(pos);`  
`ax5.util.string(String).right(pos);`  
`ax5.util.string(String).camelCase();`  
`ax5.util.string(String).snakeCase();`  
```js
ax5.util.string("{0} is dead, but {1} is alive! {0} {2}").format("ASP", "ASP.NET");
ax5.util.string("{0} is dead, but {1} is alive! {0} {2}").format(["ASP", "ASP.NET"]);
ax5.util.stinrg("{0} counts").format(100);
``````

## ax5.util.color
`ax5.util.color("#ff3300");`  
`ax5.util.color("rgb(255, 100, 100)");`  
`ax5.util.color("#ff3300").lighten(10).getHexValue();`  
`ax5.util.color("#ff3300").darken(10).getHexValue();`  
