<a name="ax5grid"></a>

## ax5grid
**Kind**: global class  
**Author:** tom@axisj.com  

* [ax5grid](#ax5grid)
    * [.setConfig(_config)](#ax5grid.setConfig) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.align()](#ax5grid.align) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.keyDown(_keyName, _data)](#ax5grid.keyDown) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.copySelect()](#ax5grid.copySelect) ⇒ <code>Boolean</code>
    * [.setData(_data)](#ax5grid.setData) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.getList(_type)](#ax5grid.getList) ⇒ <code>Array</code>
    * [.setHeight(_height)](#ax5grid.setHeight) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.addRow(_row, [_dindex], [_options])](#ax5grid.addRow) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.appendToList(_list)](#ax5grid.appendToList) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.removeRow([_dindex])](#ax5grid.removeRow) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.updateRow(_row, _dindex)](#ax5grid.updateRow) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.deleteRow(_dindex)](#ax5grid.deleteRow) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.setValue(_dindex, _key, _value)](#ax5grid.setValue) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.addColumn(_column, [_cindex])](#ax5grid.addColumn) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.removeCloumn([_cindex])](#ax5grid.removeCloumn) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.updateColumn(_column, _cindex)](#ax5grid.updateColumn) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.setColumnWidth(_width, _cindex)](#ax5grid.setColumnWidth) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.getColumnSortInfo()](#ax5grid.getColumnSortInfo) ⇒ <code>Object</code>
    * [.setColumnSort(_sortInfo)](#ax5grid.setColumnSort) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.select(_selectObject, _options)](#ax5grid.select) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.clearSelect()](#ax5grid.clearSelect) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.selectAll(_options)](#ax5grid.selectAll) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.exportExcel(_fileName)](#ax5grid.exportExcel) ⇒ <code>[ax5grid](#ax5grid)</code> &#124; <code>String</code>
    * [.focus(_pos)](#ax5grid.focus) ⇒ <code>[ax5grid](#ax5grid)</code>
    * [.destroy()](#ax5grid.destroy) ⇒ <code>null</code>

<a name="ax5grid.setConfig"></a>

### ax5grid.setConfig(_config) ⇒ <code>[ax5grid](#ax5grid)</code>
Preferences of grid UI

**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  
**Parem**: <code>Function</code> _config.columns[].editor.disabled - disable editor  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| _config | <code>Object</code> |  | 클래스 속성값 |
| _config.target | <code>Element</code> |  |  |
| [_config.frozenColumnIndex] | <code>Number</code> | <code>0</code> |  |
| [_config.frozenRowIndex] | <code>Number</code> | <code>0</code> |  |
| [_config.showLineNumber] | <code>Boolean</code> | <code>false</code> |  |
| [_config.showRowSelector] | <code>Boolean</code> | <code>false</code> |  |
| [_config.multipleSelect] | <code>Boolean</code> | <code>true</code> |  |
| [_config.columnMinWidth] | <code>Number</code> | <code>100</code> |  |
| [_config.lineNumberColumnWidth] | <code>Number</code> | <code>30</code> |  |
| [_config.rowSelectorColumnWidth] | <code>Number</code> | <code>25</code> |  |
| [_config.sortable] | <code>Boolean</code> | <code>false</code> |  |
| [_config.multiSort] | <code>Boolean</code> | <code>false</code> |  |
| [_config.remoteSort] | <code>function</code> | <code>false</code> |  |
| [_config.header] | <code>Object</code> |  |  |
| [_config.header.align] | <code>String</code> |  |  |
| [_config.header.columnHeight] | <code>Number</code> | <code>25</code> |  |
| [_config.header.columnPadding] | <code>Number</code> | <code>3</code> |  |
| [_config.header.columnBorderWidth] | <code>Number</code> | <code>1</code> |  |
| [_config.body] | <code>Object</code> |  |  |
| [_config.body.mergeCells] | <code>String</code> &#124; <code>Array</code> | <code>false</code> | - |
| [_config.body.align] | <code>String</code> |  |  |
| [_config.body.columnHeight] | <code>Number</code> | <code>25</code> |  |
| [_config.body.columnPadding] | <code>Number</code> | <code>3</code> |  |
| [_config.body.columnBorderWidth] | <code>Number</code> | <code>1</code> |  |
| [_config.body.grouping] | <code>Object</code> |  |  |
| [_config.body.grouping.by] | <code>Array</code> |  | list grouping keys |
| [_config.body.grouping.columns] | <code>Array</code> |  | list grouping columns |
| [_config.page] | <code>Object</code> |  |  |
| [_config.page.height] | <code>Number</code> | <code>25</code> |  |
| [_config.page.display] | <code>Boolean</code> | <code>true</code> |  |
| [_config.page.navigationItemCount] | <code>Number</code> | <code>5</code> |  |
| [_config.scroller] | <code>Object</code> |  |  |
| [_config.scroller.size] | <code>Number</code> | <code>15</code> |  |
| [_config.scroller.barMinSize] | <code>Number</code> | <code>15</code> |  |
| [_config.scroller.trackPadding] | <code>Number</code> | <code>4</code> |  |
| [_config.columnKeys] | <code>Object</code> |  |  |
| [_config.columnKeys.selected] | <code>String</code> | <code>&quot;_SELECTED&quot;</code> |  |
| _config.columns | <code>Array.&lt;Object&gt;</code> |  |  |
| _config.columns[].key | <code>String</code> |  |  |
| _config.columns[].label | <code>String</code> |  |  |
| _config.columns[].width | <code>Number</code> |  |  |
| _config.columns[].styleClass | <code>String</code> &#124; <code>function</code> |  |  |
| _config.columns[].enableFilter | <code>Boolean</code> |  |  |
| _config.columns[].sortable | <code>Boolean</code> |  |  |
| _config.columns[].align | <code>String</code> |  |  |
| _config.columns[].formatter | <code>String</code> &#124; <code>function</code> |  |  |
| _config.columns[].editor | <code>Object</code> |  |  |
| _config.columns[].editor.type | <code>String</code> |  | text,number,money,date |
| _config.columns[].editor.config | <code>Object</code> |  |  |
| _config.columns[].editor.updateWith | <code>Array</code> |  |  |

**Example**  
```js
var firstGrid = new ax5.ui.grid();

ax5.ui.grid.formatter["myType"] = function () {
    return "myType" + (this.value || "");
};
ax5.ui.grid.formatter["capital"] = function(){
    return (''+this.value).toUpperCase();
};

ax5.ui.grid.collector["myType"] = function () {
    return "myType" + (this.value || "");
};

var sampleData = [
    {a: "A", b: "A01", price: 1000, amount: 12, cost: 12000, saleDt: "2016-08-29", customer: "장기영", saleType: "A"},
    {companyJson: {"대표자명":"abcd"}, a: "A", b: "B01", price: 1100, amount: 11, cost: 12100, saleDt: "2016-08-28", customer: "장서우", saleType: "B"},
    {companyJson: {"대표자명":"abcd"}, a: "A", b: "C01", price: 1200, amount: 10, cost: 12000, saleDt: "2016-08-27", customer: "이영희", saleType: "A"},
    {companyJson: {"대표자명":"위세라"}, a: "A", b: "A01", price: 1300, amount: 8, cost: 10400, saleDt: "2016-08-25", customer: "황인서", saleType: "C"},
    {companyJson: {"대표자명":"abcd"}, a: "A", b: "B01", price: 1400, amount: 5, cost: 7000, saleDt: "2016-08-29", customer: "황세진", saleType: "D"},
    {companyJson: {"대표자명":"abcd"}, a: "A", b: "A01", price: 1500, amount: 2, cost: 3000, saleDt: "2016-08-26", customer: "이서연", saleType: "A"}
];

var gridView = {
    initView: function () {
        firstGrid.setConfig({
            target: $('[data-ax5grid="first-grid"]'),
            columns: [
                {
                    key: "companyJson['대표자명']",
                    label: "필드A",
                    width: 80,
                    styleClass: function () {
                        return "ABC";
                    },
                    enableFilter: true,
                    align: "center",
                    editor: {type:"text"}
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
        return this;
    },
    setData: function (_pageNo) {

        firstGrid.setData(sampleData);

        return this;
    }
};
```
<a name="ax5grid.align"></a>

### ax5grid.align() ⇒ <code>[ax5grid](#ax5grid)</code>
align grid size

**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  
<a name="ax5grid.keyDown"></a>

### ax5grid.keyDown(_keyName, _data) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _keyName | <code>String</code> | 
| _data | <code>Event</code> &#124; <code>Object</code> | 

<a name="ax5grid.copySelect"></a>

### ax5grid.copySelect() ⇒ <code>Boolean</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  
**Returns**: <code>Boolean</code> - copysuccess  
<a name="ax5grid.setData"></a>

### ax5grid.setData(_data) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _data | <code>Array</code> | 

**Example**  
```js
ax5Grid.setData({
 list: [],
 page: {
     currentPage: 0,
     pageSize: 50,
     totalElements: 500,
     totalPages: 100
 }
});

// onlyList
ax5Grid.setData([]);
```
<a name="ax5grid.getList"></a>

### ax5grid.getList(_type) ⇒ <code>Array</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _type | <code>String</code> | 

**Example**  
```js
ax5Grid.getList();
ax5Grid.getList("modified");
ax5Grid.getList("deleted");
```
<a name="ax5grid.setHeight"></a>

### ax5grid.setHeight(_height) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _height | <code>Number</code> | 

**Example**  
```js
ax5Grid.setHeight(height);
```
<a name="ax5grid.addRow"></a>

### ax5grid.addRow(_row, [_dindex], [_options]) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| _row | <code>Object</code> |  |  |
| [_dindex] | <code>Number</code> &#124; <code>String</code> | <code>last</code> |  |
| [_options] | <code>Object</code> |  | options of addRow |
| [_options.sort] | <code>Boolean</code> |  | sortData |

**Example**  
```js
ax5Grid.addRow($.extend({}, {...}), "first");
```
<a name="ax5grid.appendToList"></a>

### ax5grid.appendToList(_list) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param |
| --- |
| _list | 

**Example**  
```js
ax5Grid.appendToList([{},{},{}]);
ax5Grid.appendToList([{},{},{}]);
```
<a name="ax5grid.removeRow"></a>

### ax5grid.removeRow([_dindex]) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [_dindex] | <code>Number</code> &#124; <code>String</code> | <code>last</code> | 

**Example**  
```js
ax5Grid.removeRow();
ax5Grid.removeRow("first");
ax5Grid.removeRow("last");
ax5Grid.removeRow(1);
```
<a name="ax5grid.updateRow"></a>

### ax5grid.updateRow(_row, _dindex) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _row | <code>Object</code> | 
| _dindex | <code>Number</code> | 

<a name="ax5grid.deleteRow"></a>

### ax5grid.deleteRow(_dindex) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _dindex | <code>Number</code> &#124; <code>String</code> | 

**Example**  
```js
ax5Grid.deleteRow("first");
ax5Grid.deleteRow("last");
ax5Grid.deleteRow(1);
ax5Grid.deleteRow("selected");
```
<a name="ax5grid.setValue"></a>

### ax5grid.setValue(_dindex, _key, _value) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param |
| --- |
| _dindex | 
| _key | 
| _value | 

**Example**  
```js
ax5Grid.setValue(0, "price", 100);
```
<a name="ax5grid.addColumn"></a>

### ax5grid.addColumn(_column, [_cindex]) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type | Default |
| --- | --- | --- |
| _column | <code>Object</code> |  | 
| [_cindex] | <code>Number</code> &#124; <code>String</code> | <code>last</code> | 

<a name="ax5grid.removeCloumn"></a>

### ax5grid.removeCloumn([_cindex]) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type | Default |
| --- | --- | --- |
| [_cindex] | <code>Number</code> &#124; <code>String</code> | <code>last</code> | 

<a name="ax5grid.updateColumn"></a>

### ax5grid.updateColumn(_column, _cindex) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _column | <code>Object</code> | 
| _cindex | <code>Number</code> | 

<a name="ax5grid.setColumnWidth"></a>

### ax5grid.setColumnWidth(_width, _cindex) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _width | <code>Number</code> | 
| _cindex | <code>Number</code> | 

<a name="ax5grid.getColumnSortInfo"></a>

### ax5grid.getColumnSortInfo() ⇒ <code>Object</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  
**Returns**: <code>Object</code> - sortInfo  
<a name="ax5grid.setColumnSort"></a>

### ax5grid.setColumnSort(_sortInfo) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type | Description |
| --- | --- | --- |
| _sortInfo | <code>Object</code> |  |
| _sortInfo.key | <code>Object</code> |  |
| _sortInfo.key.seq | <code>Number</code> | seq of sortOrder |
| _sortInfo.key.orderBy | <code>String</code> | "desc"|"asc" |

**Example**  
```js
ax5grid.setColumnSort({a:{seq:0, orderBy:"desc"}, b:{seq:1, orderBy:"asc"}});
```
<a name="ax5grid.select"></a>

### ax5grid.select(_selectObject, _options) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type | Description |
| --- | --- | --- |
| _selectObject | <code>Number</code> &#124; <code>Object</code> |  |
| _selectObject.index | <code>Number</code> | index of row |
| _selectObject.rowIndex | <code>Number</code> | rowIndex of columns |
| _selectObject.conIndex | <code>Number</code> | colIndex of columns |
| _options | <code>Object</code> |  |
| _options.selectedClear | <code>Boolean</code> |  |
| _options.selected | <code>Boolean</code> |  |

**Example**  
```js
firstGrid.select(0);
firstGrid.select(0, {selected: true});
firstGrid.select(0, {selected: false});
firstGrid.select(0, {selectedClear: true});
```
<a name="ax5grid.clearSelect"></a>

### ax5grid.clearSelect() ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  
**Example**  
```js
firstGrid.clearSelect();
```
<a name="ax5grid.selectAll"></a>

### ax5grid.selectAll(_options) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _options | <code>Object</code> | 
| _options.selected | <code>Boolean</code> | 
| _options.filter | <code>function</code> | 

**Example**  
```js
firstGrid.selectAll();
firstGrid.selectAll({selected: true});
firstGrid.selectAll({selected: false});
firstGrid.selectAll({filter: function(){
     return this["b"] == "A01";
});
firstGrid.selectAll({selected: true, filter: function(){
     return this["b"] == "A01";
});
```
<a name="ax5grid.exportExcel"></a>

### ax5grid.exportExcel(_fileName) ⇒ <code>[ax5grid](#ax5grid)</code> &#124; <code>String</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type |
| --- | --- |
| _fileName | <code>String</code> | 

**Example**  
```js
firstGrid.exportExcel("grid-to-excel.xls");
console.log(firstGrid.exportExcel());
```
<a name="ax5grid.focus"></a>

### ax5grid.focus(_pos) ⇒ <code>[ax5grid](#ax5grid)</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  

| Param | Type | Description |
| --- | --- | --- |
| _pos | <code>String</code> &#124; <code>Number</code> | UP, DOWN, LEFT, RIGHT, HOME, END |

**Example**  
```js
firstGrid.focus("UP");
firstGrid.focus("DOWN");
firstGrid.focus("HOME");
firstGrid.focus("END");
```
<a name="ax5grid.destroy"></a>

### ax5grid.destroy() ⇒ <code>null</code>
**Kind**: static method of <code>[ax5grid](#ax5grid)</code>  
