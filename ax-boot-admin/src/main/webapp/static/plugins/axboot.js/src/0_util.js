(function(){

    var axboot = {
        getJSON: (function(){

            return function(json){
                return (json) ? json : false;
            }
        })()
    };

    this.axboot = axboot;

}).call(window);