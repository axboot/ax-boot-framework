/**
 * Created by tom on 2016. 9. 2..
 */

/**
 * 1, 2를 믹스한 새로운 오브젝트를 반환
 * @param _obj1
 * @param _obj2
 */
axboot.extend = function (_obj1, _obj2) {
    return $.extend({}, _obj1, _obj2);
};
axboot.viewExtend = function (_obj1, _obj2) {
    if (typeof _obj2 === "undefined") {
        return $.extend({}, axboot.commonView, _obj1);
    } else {
        return $.extend({}, _obj1, _obj2);
    }
};
