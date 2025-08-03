/**
 * vatSchema is an array of objects, each representing a column schema.
 * Each object contains:
 *   - field: string (the field name)
 *   - header: string (the column header)
 *   - type: the data type, e.g., "decimal" or "string"
 * 
 * @type {{ field: string, header: string, type: string }[]}
 */
const vatSchema = [
    { field: "vatValue", header: "Verokanta", type: "decimal" },
    { field: "description", header: "Kuvaus", type: "string" }
]

export default vatSchema;