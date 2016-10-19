(function () {
    if (axboot && axboot.def) {

        axboot.def["API"] = {
            "users": "/api/v1/users",
            "commonCodes": "/api/v1/commonCodes",
            "programs": "/api/v1/programs",
            "menu": "/api/v2/menu",
            "manual": "/api/v1/manual",
            "errorLogs": "/api/v1/errorLogs",
            "files": "/api/v1/files",
            "samples": "/api/v1/samples"
        };

        axboot.def["MODAL"] = {
            "zipcode": "/jsp/common/zipcode.jsp",
            "sample-modal": "modal.jsp",
            "system-config-common-code-modal": "/jsp/system/system-config-common-code-modal.jsp"
        };
    }
})();