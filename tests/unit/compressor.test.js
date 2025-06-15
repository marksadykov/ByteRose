const DataCompressor = require('../../src/compressor');

describe('DataCompressor', () => {
    describe('serialize', () => {
        test('должен сериализовать пустой массив', () => {
            const result = DataCompressor.serialize([]);
            expect(typeof result).toBe('string');
            expect(result.length).toBe(52);
        });

        test('должен возвращать строку фиксированной длины', () => {
            const testCases = [
                [],
                [1],
                [1, 2, 3, 4, 5],
                Array.from({length: 100}, (_, i) => i + 1),
                Array.from({length: 300}, (_, i) => i + 1)
            ];

            testCases.forEach(testCase => {
                const result = DataCompressor.serialize(testCase);
                expect(result.length).toBe(52);
            });
        });

        test('должен обрабатывать дубликаты', () => {
            const original = [1, 1, 2, 2, 3];
            const result = DataCompressor.serialize(original);
            const restored = DataCompressor.deserialize(result);
            expect(restored.sort()).toEqual([1, 2, 3]);
        });

        test('должен выбрасывать ошибку для невалидных данных', () => {
            expect(() => DataCompressor.serialize([301])).toThrow('Invalid number: 301');
            expect(() => DataCompressor.serialize(['string'])).toThrow();
            expect(() => DataCompressor.serialize(null)).toThrow('Input must be an array');
            expect(() => DataCompressor.serialize({})).toThrow('Input must be an array');
        });

        test('должен обрабатывать граничные значения', () => {
            const minMax = [1, 300];
            const result = DataCompressor.serialize(minMax);
            const restored = DataCompressor.deserialize(result);
            expect(restored.sort()).toEqual([1, 300]);
        });
    });

    describe('deserialize', () => {
        test('должен корректно восстанавливать данные', () => {
            const original = [1, 50, 100, 200, 300];
            const compressed = DataCompressor.serialize(original);
            const restored = DataCompressor.deserialize(compressed);

            expect(restored.sort()).toEqual(original.sort());
        });

        test('должен выбрасывать ошибку для невалидной строки', () => {
            expect(() => DataCompressor.deserialize(123)).toThrow('Compressed data must be a string');
            expect(() => DataCompressor.deserialize('invalid!')).toThrow('Invalid base64 format');
            // Удаляем тест с пустой строкой - она валидна для base64
        });

        test('должен генерировать данные корректной длины', () => {
            const testCases = [[], [1], [1, 2, 3], Array.from({length: 300}, (_, i) => i + 1)];

            testCases.forEach(testCase => {
                const compressed = DataCompressor.serialize(testCase);
                const decoded = atob(compressed);
                expect(decoded.length).toBe(38); // Math.ceil(300 / 8) = 38
            });
        });

        test('должен обрабатывать пустую строку как некорректную', () => {
            // Пустая строка декодируется в 0 байт, что не соответствует нашему формату (38 байт)
            expect(() => DataCompressor.deserialize('')).toThrow('Deserialization failed');
        });

        test('должен обрабатывать корректные base64 строки нашего формата', () => {
            // Используем реальную строку из сериализации пустого массива
            const emptyArraySerialized = DataCompressor.serialize([]);
            expect(() => DataCompressor.deserialize(emptyArraySerialized)).not.toThrow();

            // Тестируем с реальными данными
            const testData = [1, 2, 3];
            const serialized = DataCompressor.serialize(testData);
            expect(() => DataCompressor.deserialize(serialized)).not.toThrow();
        });

        test('должен выбрасывать ошибку для некорректного base64 содержимого', () => {
            // Валидная base64 строка, но неправильной длины для нашего формата
            const wrongLength = 'SGVsbG8gV29ybGQ='; // "Hello World" в base64 - 11 байт вместо 38
            expect(() => DataCompressor.deserialize(wrongLength)).toThrow('Deserialization failed');

            // Дополнительная проверка с другой некорректной длиной
            const tooShort = 'SGVsbG8='; // "Hello" в base64 - 5 байт
            expect(() => DataCompressor.deserialize(tooShort)).toThrow('Deserialization failed');

            // Слишком длинная строка
            const tooLong = 'SGVsbG8gV29ybGQhIFRoaXMgaXMgYSB2ZXJ5IGxvbmcgc3RyaW5nIHRoYXQgaXMgbW9yZSB0aGFuIDM4IGJ5dGVz';
            expect(() => DataCompressor.deserialize(tooLong)).toThrow('Deserialization failed');
        });

    });

    describe('цикл сериализация-десериализация', () => {
        test('должен сохранять данные через полный цикл', () => {
            const testCases = [
                [],
                [1],
                [1, 2, 3],
                [299, 300],
                Array.from({length: 50}, () => Math.floor(Math.random() * 300) + 1)
            ];

            testCases.forEach(original => {
                const compressed = DataCompressor.serialize(original);
                const restored = DataCompressor.deserialize(compressed);
                const uniqueOriginal = [...new Set(original)].sort((a, b) => a - b);

                expect(restored.sort((a, b) => a - b)).toEqual(uniqueOriginal);
            });
        });

        test('должен обрабатывать edge cases', () => {
            const edgeCases = [
                [1], // минимальное значение
                [300], // максимальное значение
                [1, 300], // границы диапазона
                Array.from({length: 300}, (_, i) => i + 1) // все возможные числа
            ];

            edgeCases.forEach(testCase => {
                const compressed = DataCompressor.serialize(testCase);
                const restored = DataCompressor.deserialize(compressed);
                expect(restored.sort((a, b) => a - b)).toEqual(testCase.sort((a, b) => a - b));
            });
        });
    });
});
