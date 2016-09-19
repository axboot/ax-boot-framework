// ax5.ui.grid.collector
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;
    var sum = function () {
        var value = 0;
        var i = this.list.length;
        while (i--) {
            if(!("__groupingList" in this.list[i])) {
                value += U.number(this.list[i][this.key]);
            }
        }
        return value;
    };
    var avg = function () {
        var value = 0;
        var i = this.list.length, listLength = 0;
        while (i--) {
            if(!("__groupingList" in this.list[i])) {
                value += U.number(this.list[i][this.key]);
                listLength++;
            }
        }
        return U.number(value / (listLength || 1), {"round": 2});
    };

    GRID.collector = {
        sum: sum,
        avg: avg
    };

})();