// ax5.ui.grid.formatter
(function () {

    const GRID = ax5.ui.grid;

    const U = ax5.util;

    const money = function () {
        if (typeof this.value !== "undefined") {
            let val = ('' + this.value).replace(/[^0-9^\.^\-]/g, ""),
                regExpPattern = new RegExp('([0-9])([0-9][0-9][0-9][,.])'),
                arrNumber = val.split('.'),
                returnValue;

            arrNumber[0] += '.';

            do {
                arrNumber[0] = arrNumber[0].replace(regExpPattern, '$1,$2');
            } while (regExpPattern.test(arrNumber[0]));

            return (arrNumber.length > 1) ? arrNumber[0] + U.left(arrNumber[1], 2) : arrNumber[0].split('.')[0];
        } else {
            return "";
        }
    };

    GRID.formatter = {
        money: money
    };

})();