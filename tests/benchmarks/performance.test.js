const DataCompressor = require('../../src/compressor');

describe('Performance benchmarks', () => {
    test('должен обрабатывать 1000 чисел за разумное время', () => {
        const largeArray = Array.from({length: 1000}, () =>
            Math.floor(Math.random() * 300) + 1
        );

        const start = performance.now();
        const compressed = DataCompressor.serialize(largeArray);
        const restored = DataCompressor.deserialize(compressed);
        const end = performance.now();

        expect(end - start).toBeLessThan(100); // Меньше 100ms
        expect(restored.length).toBeGreaterThan(0);
    });
});
