// ax5.ui.grid.formatter
(function () {

    var GRID = ax5.ui.grid;
    var U = ax5.util;
    var money = function () {
        return U.number(this.value, {"money":true});
    };

    GRID.formatter = {
        money: money
    };

})();