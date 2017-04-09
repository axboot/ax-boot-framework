// ax5.ui.grid.formatter
(function () {

    let GRID = ax5.ui.grid,
        U = ax5.util;

    let money = function () {
        return U.number(this.value, {"money":true});
    };

    GRID.formatter = {
        money: money
    };

})();