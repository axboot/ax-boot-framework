"use strict";

(function () {

    var axboot = {
        getJSON: function () {

            return function (json) {
                return json ? json : false;
            };
        }()
    };

    this.axboot = axboot;
}).call(window);
(function () {

    var builder = {};

    if (!this.axboot) {
        this.axboot = {};
    }

    this.axboot.builder = builder;
}).call(window);