/**
 * Validates that all required fields in the object are filled (non-empty after trim).
 * Optionally, validates that specified fields are valid decimals (dot as separator, up to two decimals).
 * @param {Object} data - The object to validate (e.g., a form state).
 * @param {Array<string>} requiredFields - List of keys that are required.
 * @param {Array<string>} [decimalFields] - List of keys that must be valid decimals.
 * @returns {boolean} - True if all required fields are valid.
 */
const inputValidation = (data, requiredFields, decimalFields = []) => {
    const decimalRegex = /^\d+(\.\d{1,2})?$/;
    return requiredFields.every(key => {
        const value = String(data[key] || "").trim();
        if (value === "") return false;
        if (decimalFields.includes(key) && !decimalRegex.test(value)) {
            console.log(`Decimal validation failed for key: ${key}, value: "${value}"`);
            return false;
        }
        return true;
    });
};
export default inputValidation;