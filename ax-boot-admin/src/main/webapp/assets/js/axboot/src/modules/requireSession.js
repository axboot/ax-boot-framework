axboot.requireSession = function (_cookieName) {
    if (!ax5.util.getCookie(_cookieName)) {
        if (window.opener) {
            window.close();
            window.opener.top.location.href = "/";
        } else if (top != window) {
            top.location.href = "/";
        }
    }
};