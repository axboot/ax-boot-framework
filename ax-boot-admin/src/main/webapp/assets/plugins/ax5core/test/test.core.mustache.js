describe('ax5.mustache TEST', function() {
    it('ax5.mustache.render Object TEST', function() {
        var template = '{{title}} spends {{calc}}';
        var view = {
            title: 'Joe',
            calc: function () {
                return 2 + 4;
            }
        };
        var actual = ax5.mustache.render(template, view);

        actual.should.equal('Joe spends 6');
    });

    it('ax5.mustache.render Array TEST', function() {
        var template = '{{#beatles}}\n* {{firstName}} {{lastName}} ({{@i}}) ({{@first}})\n{{/beatles}}';
        var view = {
            "beatles": [
                { "firstName": "John", "lastName": "Lennon" },
                { "firstName": "Paul", "lastName": "McCartney" },
                { "firstName": "George", "lastName": "Harrison" },
                { "firstName": "Ringo", "lastName": "Star" }
            ]
        };
        var actual = ax5.mustache.render(template, view);

        actual.should.equal('* John Lennon (0) (true)\n* Paul McCartney (1) (false)\n* George Harrison (2) (false)\n* Ringo Star (3) (false)\n');
    });

    it('ax5.mustache.render Object.@each TEST', function() {
        var template = '{{#beatles}}\n{{#@each}}\n* {{@key}} : {{@value.firstName}} {{@value.lastName}}\n{{/@each}}\n{{/beatles}}';
        var view = {
            "beatles": {
                "John": {"firstName": "John", "lastName": "Lennon"},
                "Paul": {"firstName": "Paul", "lastName": "McCartney"},
                "George": {"firstName": "George", "lastName": "Harrison"},
                "Ringo": {"firstName": "Ringo", "lastName": "Star"}
            }
        }
        var actual = ax5.mustache.render(template, view);

        actual.should.equal('* John : John Lennon\n* Paul : Paul McCartney\n* George : George Harrison\n* Ringo : Ringo Star\n');
    });
});
