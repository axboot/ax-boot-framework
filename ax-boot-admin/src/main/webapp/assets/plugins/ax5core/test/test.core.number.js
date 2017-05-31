describe('ax5.util.number TEST', function () {
    var testCases = [
        {
            args: [
                123456789.678,
                {
                    round: 1
                }
            ],
            expect: 123456789.7,
            explanation: 123456789.678 + ', { round: 1 }'
        },
        {
            args: [
                123456789.678,
                {
                    round: 1,
                    money: true
                }
            ],
            expect: '123,456,789.7',
            explanation: 123456789.678 + ', { round: 1, money: true }'
        },
        {
            args: [
                123456789.678,
                {
                    round: 2,
                    byte: true
                }
            ],
            expect: '117.7MB',
            explanation: 123456789.678 + ', { round: 2, byte: true }'
        },
        {
            args: [
                -123456789.678,
                {
                    abs: true,
                    round: 2,
                    money: true
                }
            ],
            expect: '123,456,789.68',
            explanation: -123456789.678 + ',{ abs: true, round: 2, money: true }'
        },
        {
            args: [
                -123456789.678,
                {
                    abs: true,
                    ceil: true,
                    money: true
                }
            ],
            expect: '123,456,790',
            explanation: -123456789.678 + ',{ abs: true, ceil: true, money: true }'
        },
        {
            args: [
                -123456789.678,
                {
                    abs: true,
                    floor: true,
                    money: true
                }
            ],
            expect: '123,456,789',
            explanation: -123456789.678 + ',{ abs: true, floor: true, money: true }'
        },
        {
            args: [
                1023,
                {
                    byte: true
                }
            ],
            expect: '1KB',
            explanation: 1023 + ',{byte: true}'
        },
        {
            args: [
                1024 * 1024,
                {
                    byte: true
                }
            ],
            expect: '1024KB',
            explanation: 1024 * 1024 + ',{byte: true}'
        },
        {
            args: [
                1024 * 1024 * 5,
                {
                    byte: true
                }
            ],
            expect: '5MB',
            explanation: 1024 * 1024 * 5 + ',{byte: true}'
        },
        {
            args: [
                1024 * 1024 * 1024,
                {
                    byte: true
                }
            ],
            expect: '1024MB',
            explanation: 1024 * 1024 * 1024 + ',{byte: true}'
        },
        {
            args: [
                1024 * 1024 * 1024 * 5,
                {
                    byte: true
                }
            ],
            expect: '5GB',
            explanation: 1024 * 1024 * 1024 + ',{byte: true}'
        },
        {
            args: [
                'A-1234~~56789.8~888PX',
                {
                    abs: true,
                    round: 2,
                    money: true
                }
            ],
            expect: '123,456,789.89',
            explanation: 'A-1234~~56789.8~888PX , { abs: true, round: 2, money: true }'
        }
    ];

    testCases.forEach(function (testCase) {
        it('ax5.util.number(' + testCase.explanation + ') expect ' + testCase.expect, function () {
            var actual = ax5.util.number.apply(this, testCase.args);

            actual.should.deepEqual(testCase.expect);
        });
    });
});
