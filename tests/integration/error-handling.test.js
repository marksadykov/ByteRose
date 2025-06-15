const DataCompressor = require('../../src/compressor');

describe('Error Handling Integration', () => {
    test('должен обрабатывать цепочку ошибок валидации', () => {
        const invalidInputs = [
            null,
            undefined,
            'string',
            123,
            { array: [1, 2, 3] },
            [0, 1, 2], // содержит 0
            [1, 2, 301], // содержит 301
            [1.5, 2, 3], // содержит дробное число
        ];

        invalidInputs.forEach(input => {
            expect(() => DataCompressor.serialize(input)).toThrow();
        });
    });

    test('должен обрабатывать поврежденные данные при десериализации', () => {
        const corruptedData = [
            null,
            undefined,
            123,
            [],
            {},
            'not-base64-@#$%',
            'truncated-base64',
        ];

        corruptedData.forEach(data => {
            expect(() => DataCompressor.deserialize(data)).toThrow();
        });
    });
});
