const DataValidator = require('./validator');

class DataCompressor {
    static serialize(numbers) {
        DataValidator.validateInputArray(numbers);

        const maskSize = Math.ceil(300 / 8);
        const mask = new Uint8Array(maskSize);

        // Убираем дубликаты и сортируем для оптимизации
        const uniqueNumbers = [...new Set(numbers)];

        for (const num of uniqueNumbers) {
            const byteIndex = Math.floor((num - 1) / 8);
            const bitIndex = (num - 1) % 8;
            mask[byteIndex] |= (1 << bitIndex);
        }

        let binaryString = '';
        for (let i = 0; i < mask.length; i++) {
            binaryString += String.fromCharCode(mask[i]);
        }

        return btoa(binaryString);
    }

    static deserialize(compressedStr) {
        DataValidator.validateCompressedString(compressedStr);

        try {
            const binaryString = atob(compressedStr);

            // Проверяем, что длина декодированных данных соответствует нашему формату
            const expectedLength = Math.ceil(300 / 8); // 38 байт
            if (binaryString.length !== expectedLength) {
                throw new Error(`Invalid decoded length: expected ${expectedLength}, got ${binaryString.length}`);
            }

            const mask = new Uint8Array(binaryString.length);

            for (let i = 0; i < binaryString.length; i++) {
                mask[i] = binaryString.charCodeAt(i);
            }

            const numbers = [];
            for (let i = 0; i < 300; i++) {
                const byteIndex = Math.floor(i / 8);
                const bitIndex = i % 8;

                if (byteIndex < mask.length && (mask[byteIndex] & (1 << bitIndex))) {
                    numbers.push(i + 1);
                }
            }

            return numbers;
        } catch (error) {
            throw new Error(`Deserialization failed: ${error.message}`);
        }
    }
}

module.exports = DataCompressor;
