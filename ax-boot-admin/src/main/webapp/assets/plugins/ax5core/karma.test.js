describe('ax5.util.getType TEST', function() {
    it('ax5.util.getType(1)', function() {
        if (ax5.util.getType(1) === "number") {
        } else {
            throw new Error('실패');
        }
    });
    it('ax5.util.getType("1")', function() {
        if (ax5.util.getType("1") === "string") {
        } else {
            throw new Error('실패');
        }
    });
    it('ax5.util.getType([0, 1, 2])', function() {
        if (ax5.util.getType([0, 1, 2]) === "array") {
        } else {
            throw new Error('실패');
        }
    });
    it('ax5.util.getType({a: 1})', function() {
        if (ax5.util.getType({a: 1}) === "object") {
        } else {
            throw new Error('실패');
        }
    });
    it('ax5.util.getType(function () {})', function() {
        if (ax5.util.getType(function () {}) === "function") {
        } else {
            throw new Error('실패');
        }
    });
    it('ax5.util.getType(document.querySelectorAll("div"))', function() {
        if (ax5.util.getType(document.querySelectorAll("div")) === "nodelist") {
        } else {
            throw new Error('실패');
        }
    });
    it('ax5.util.getType(document.createDocumentFragment())', function() {
        if (ax5.util.getType(document.createDocumentFragment()) === "fragment") {
        } else {
            throw new Error('실패');
        }
    });
});