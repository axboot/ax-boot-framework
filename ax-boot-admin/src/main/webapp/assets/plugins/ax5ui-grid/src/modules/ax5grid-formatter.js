// ax5.ui.grid.formatter
(function () {

    const GRID = ax5.ui.grid;

    const U = ax5.util;

    const money = function () {
        return U.number(this.value, {"money": true});
    };

    GRID.formatter = {
        money: money
    };

})();