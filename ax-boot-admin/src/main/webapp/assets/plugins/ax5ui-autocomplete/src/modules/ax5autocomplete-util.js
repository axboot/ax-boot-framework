// ax5.ui.autocomplete.util
(function () {

    var AUTOCOMPLETE = ax5.ui.autocomplete;
    var U = ax5.util;

    var nodeTypeProcessor = {
        '1': function (queIdx, node, editable) {
            var cfg = this.config;
            var textNode = node;

            if ($(node).find("span").get(0)) {
                textNode = $(node).find("span").get(0);
            }

            var text = (textNode.textContent || textNode.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            var selectedIndex, option;

            if(item.selected && item.selected.length > 0){
                if (node.getAttribute("data-ax5autocomplete-selected-text") == text) {
                    selectedIndex = node.getAttribute("data-ax5autocomplete-selected-label");
                    option = item.selected[selectedIndex];
                    return {
                        selectedIndex: {
                            index: option["@index"],
                            value: option[cfg.columnKeys.optionValue]
                        }
                    };
                }
                else {
                    selectedIndex = node.getAttribute("data-ax5autocomplete-selected-label");
                    option = item.selected[selectedIndex];
                    return {
                        removeSelectedIndex: {
                            index: option["@index"],
                            value: option[cfg.columnKeys.optionValue]
                        }
                    };
                }
            }

        },
        '3': function (queIdx, node, editable) {
            var cfg = this.config;
            var text = (node.textContent || node.innerText).replace(/^[\s\r\n\t]*|[\s\r\n\t]*$/g, '');
            var item = this.queue[queIdx];

            if (text != "") {
                if (editable) {
                    return text;
                } else {
                    var $option;
                    if (item.optionFocusIndex > -1) $option = this.activeautocompleteOptionGroup.find('[data-option-focus-index="' + item.optionFocusIndex + '"]');
                    if (item.optionFocusIndex > -1 && $option.get(0) && $option.attr("data-option-value")) {
                        return {
                            optionIndex: {
                                gindex: $option.attr("data-option-group-index"),
                                index: $option.attr("data-option-index")
                            }
                        }
                    } else {
                        return (item.editable) ? text : undefined;
                    }
                }
            } else {
                return undefined;
            }
        }
    };

    AUTOCOMPLETE.util = {
        nodeTypeProcessor: nodeTypeProcessor
    };
})();