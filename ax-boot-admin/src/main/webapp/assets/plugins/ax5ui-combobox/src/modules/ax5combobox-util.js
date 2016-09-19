/*
 * Copyright (c) 2016. tom@axisj.com
 * - github.com/thomasjang
 * - www.axisj.com
 */

// ax5.ui.combobox.util
(function () {

    var COMBOBOX = ax5.ui.combobox;
    var U = ax5.util;

    var nodeTypeProcessor = {
        '1': function (queIdx, node, editable) {
            var cfg = this.config;
            var textNode = node;
            //// 임시..
            if ($(node).find("span").get(0)) {
                textNode = $(node).find("span").get(0);
            }

            var text = (textNode.textContent || textNode.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            var selectedIndex, option;
            if (item.selected && item.selected.length > 0 && node.getAttribute("data-ax5combobox-selected-text") == text) {
                selectedIndex = node.getAttribute("data-ax5combobox-selected-label");
                option = item.selected[selectedIndex];
                return {
                    index: {
                        gindex: option["@gindex"],
                        index: option["@index"],
                        value: option[cfg.columnKeys.optionValue]
                    }
                };
            }
            else if (!node.getAttribute("data-ax5combobox-selected-text")) {
                if (text != "") {
                    if (!editable) {

                    }

                    var option;
                    if (item.optionFocusIndex > -1 && (option = item.indexedOptions[item.optionFocusIndex]) && option[cfg.columnKeys.optionText].substr(0, text.length) === text) {
                        return {
                            index: {
                                gindex: option["@gindex"],
                                index: option["@index"],
                                value: option[cfg.columnKeys.optionValue]
                            }
                        }
                    } else {
                        return (this.queue[queIdx].editable || editable) ? text : undefined;
                    }
                } else {
                    return undefined;
                }
            }
            else {
                return text;
            }
        },
        '3': function (queIdx, node, editable) {
            var cfg = this.config;
            var text = (node.textContent || node.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            if (text != "") {
                var $option;
                if (item.optionFocusIndex > -1) $option = this.activecomboboxOptionGroup.find('[data-option-focus-index="' + item.optionFocusIndex + '"]');
                if (item.optionFocusIndex > -1 && $option.get(0) && $option.attr("data-option-value")) {
                    return {
                        index: {
                            gindex: $option.attr("data-option-group-index"),
                            index: $option.attr("data-option-index")
                        }
                    }
                } else {
                    return (item.editable || editable) ? text : undefined;
                }
            } else {
                return undefined;
            }
        }
    };

    COMBOBOX.util = {
        nodeTypeProcessor: nodeTypeProcessor
    };
})();