axboot.treeBuilder = (function () {
    /* http://www.treejs.cn/v3/api.php 를 참고하세요. */

    var defaultTreeSetting = {};

    var treeClass = function (_target, _setting, _zNodes) {
        this.targetId = "";
        this.$target = null;
        this.setting = {};
        this.zNodes = [];
        var callbackFlag = true;

        this.setData = function (_zNodes) {
            if (typeof _zNodes !== "undefined") this.zNodes = ax5.util.deepCopy(_zNodes);
            $.fn.zTree.init(this.$target, this.setting, this.zNodes);
        };
        this.getData = function () {
            return this.zTree.getNodes();
        };
        this.selectNode = function (_treeNode) {
            this.zTree.selectNode(_treeNode);
        };
        this.cancelSelectedNode = function () {
            this.zTree.cancelSelectedNode();
        };
        this.getSelectedNodes = function(){
            return this.zTree.getSelectedNodes();
        };
        this.editName = function(){
            var nodes = this.zTree.getSelectedNodes();
            if (nodes.length == 0) {
                alert("Please select one node at first...");
                return;
            }
            this.zTree.editName(nodes[0]);
        };
        this.removeNode = function(treeNode){
            var nodes = this.zTree.getSelectedNodes();
            if (nodes.length == 0) {
                alert("Please select one node at first...");
                return;
            }
            zTree.removeNode(nodes[0], callbackFlag);
        };
        this.addNode = function(){

        };
        this.convertList2Tree = function (_list, _config) {
            _list = JSON.parse(JSON.stringify(_list));

            var childKey = _config.childKey;
            var parentKey = _config.parentKey;
            var childrenKey = _config.childrenKey || "children";
            var labelKey = _config.labelKey;
            var seq = 0;
            var hashDigit = 3;
            var tree = [];
            var pointer = {};
            for (var i = 0, l = _list.length; i < l; i++) {
                pointer[_list[i][childKey]] = i;
                if (!_list[i][parentKey]) {
                    var item = _list[i];
                    item.pHash = ax5.util.setDigit("0", hashDigit);
                    item.hash = ax5.util.setDigit("0", hashDigit) + "_" + ax5.util.setDigit(seq, hashDigit);

                    var pushItem = {
                        id: item[childKey],
                        name: item[labelKey],
                        label: item[labelKey],
                        pHash: ax5.util.setDigit("0", hashDigit),
                        hash: ax5.util.setDigit("0", hashDigit) + "_" + ax5.util.setDigit(seq, hashDigit),
                        data: $.extend({}, item),
                        __subTreeLength: 0
                    };
                    pushItem[childrenKey] = [];

                    tree.push(pushItem);
                    seq++;
                }
            }
            for (var i = 0, l = _list.length; i < l; i++) {
                if (_list[i][parentKey]) {
                    var item = _list[i];

                    var pItem = _list[pointer[item[parentKey]]];
                    var pHash = pItem["hash"];
                    var pHashs = pHash.split(/_/g);
                    var pTree = tree;
                    var pTreeItem = {};
                    var __subTreeLength = (typeof pItem.__subTreeLength !== "undefined") ? pItem.__subTreeLength : 0;

                    pHashs.forEach(function (T, idx) {
                        if (idx > 0) {
                            pTreeItem = pTree[Number(T)];
                            pTree = pTree[Number(T)][childrenKey];
                        }
                    });

                    item[childrenKey] = [];
                    item["pHash"] = pHash;
                    item["hash"] = pHash + "_" + ax5.util.setDigit(__subTreeLength, hashDigit);

                    var pushItem = {
                        name: item[labelKey],
                        label: item[labelKey],
                        pHash: pHash,
                        hash: pHash + "_" + ax5.util.setDigit(__subTreeLength, hashDigit),
                        data: $.extend({}, item)
                    };
                    pushItem[childrenKey] = [];
                    pTree.push(pushItem);

                    if (typeof pItem.__subTreeLength === "undefined") pItem.__subTreeLength = 1;
                    else pItem.__subTreeLength++;

                    pTreeItem.__subTreeLength = pItem.__subTreeLength;
                }
            }
            return tree;
        };

        this.$target = _target;
        if (!this.$target.get(0).id) {
            this.$target.get(0).id = "axboot-tree-" + ax5.getGuid();
        }
        this.targetId = this.$target.get(0).id;
        this.setting = $.extend(true, {}, defaultTreeSetting, _setting);
        if (typeof _zNodes !== "undefined") this.zNodes = ax5.util.deepCopy(_zNodes);

        $.fn.zTree.init(this.$target, this.setting, this.zNodes);
        this.zTree = $.fn.zTree.getZTreeObj(this.targetId);
    };

    return function (_target, _setting, _zNodes) {
        return new treeClass(_target, _setting, _zNodes);
    }
})();