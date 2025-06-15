class DataValidator {
    static validateInputArray(numbers) {
        if (!Array.isArray(numbers)) {
            throw new Error('Input must be an array');
        }

        for (const num of numbers) {
            if (!Number.isInteger(num) || num < 1 || num > 300) {
                throw new Error(`Invalid number: ${num}. Must be integer 1-300`);
            }
        }

        return true;
    }

    static validateCompressedString(str) {
        if (typeof str !== 'string') {
            throw new Error('Compressed data must be a string');
        }

        // Проверка base64 формата
        const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
        if (!base64Regex.test(str)) {
            throw new Error('Invalid base64 format');
        }

        return true;
    }
}

module.exports = DataValidator;
