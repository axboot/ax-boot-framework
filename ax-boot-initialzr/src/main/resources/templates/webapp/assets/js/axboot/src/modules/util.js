/**
 * Created by tom on 2016. 9. 2..
 */



axboot.addressPopup = {
    open: function(cb){
        //alert("open");
        var modalConfig = {
            width:500,
            height:600,
            iframe: {
                url: "/jsp/common/zipcode.jsp"
            },
            header: {
                title: "우편번호 찾기"
            },
            callback: cb
        } ;
        axboot.modal.open(modalConfig);
    },
    close: function(){
        axboot.modal.close();
    }
};


axboot.util = (function(){
    var setSelectionRange = function (input, pos) {
        if (typeof pos == "undefined") {
            pos = input.value.length;
        }
        if (input.setSelectionRange) {
            input.focus();
            input.setSelectionRange(pos, pos);
        }
        else if (input.createTextRange) {
            var range = input.createTextRange();
            range.collapse(true);
            range.moveEnd('character', pos);
            range.moveStart('character', pos);
            range.select();
        }
        else if (input.selectionStart) {
            input.focus();
            input.selectionStart = pos;
            input.selectionEnd = pos;
        }
    };

    return {
        setFocusPosition: setSelectionRange
    }
})();