const DataValidator = require('../../src/validator');

describe('DataValidator', () => {
    describe('validateInputArray', () => {
        test('должен принимать валидные массивы', () => {
            expect(DataValidator.validateInputArray([])).toBe(true);
            expect(DataValidator.validateInputArray([1, 2, 3])).toBe(true);
            expect(DataValidator.validateInputArray([1, 300])).toBe(true);
        });

        test('должен отклонять не-массивы', () => {
            expect(() => DataValidator.validateInputArray(null)).toThrow('Input must be an array');
            expect(() => DataValidator.validateInputArray({})).toThrow('Input must be an array');
            expect(() => DataValidator.validateInputArray('string')).toThrow('Input must be an array');
        });

        test('должен отклонять числа вне диапазона', () => {
            expect(() => DataValidator.validateInputArray([0])).toThrow('Invalid number: 0');
            expect(() => DataValidator.validateInputArray([301])).toThrow('Invalid number: 301');
            expect(() => DataValidator.validateInputArray([-1])).toThrow('Invalid number: -1');
        });

        test('должен отклонять не-целые числа', () => {
            expect(() => DataValidator.validateInputArray([1.5])).toThrow('Invalid number: 1.5');
            expect(() => DataValidator.validateInputArray(['1'])).toThrow('Invalid number: 1');
        });
    });

    describe('validateCompressedString', () => {
        test('должен принимать валидные base64 строки', () => {
            expect(DataValidator.validateCompressedString('AAAA')).toBe(true);
            expect(DataValidator.validateCompressedString('SGVsbG8=')).toBe(true);
            expect(DataValidator.validateCompressedString('')).toBe(true);
        });

        test('должен отклонять не-строки', () => {
            expect(() => DataValidator.validateCompressedString(null)).toThrow('Compressed data must be a string');
            expect(() => DataValidator.validateCompressedString(123)).toThrow('Compressed data must be a string');
            expect(() => DataValidator.validateCompressedString([])).toThrow('Compressed data must be a string');
        });

        test('должен отклонять невалидный base64', () => {
            expect(() => DataValidator.validateCompressedString('invalid!')).toThrow('Invalid base64 format');
            expect(() => DataValidator.validateCompressedString('тест')).toThrow('Invalid base64 format');
        });
    });
});
