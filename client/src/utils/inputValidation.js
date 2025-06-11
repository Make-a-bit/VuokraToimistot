/**
 * Validates that all required fields in the object are filled (non-empty after trim).
 * @param {Object} data - The object to validate (e.g., a form state).
 * @param {Array<string>} requiredFields - List of keys that are required.
 * @returns {boolean} - True if all required fields are valid.
 */
const inputValidation = (data, requiredFields) => {
    return requiredFields.every(
        key => String(data[key] || "").trim() !== ""
    );
};

export default inputValidation;
