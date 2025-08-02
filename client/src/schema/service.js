/**
 * serviceSchema is an array of objects, each describing a property field.
 *  Each object contains:
 *   - field: string (the property key)
 *   - header: string (the display name)
 *   - type: the data type, e.g., "string" or "decimal"

 * @type {Array<{field: string, header: string, type: string}>}
 */
const serviceSchema = [
    { field: "officeName", header: "Kohde", type: "string" },
    { field: "name", header: "Nimi", type: "string" },
    { field: "unit", header: "Yksikkö", type: "string" },
    { field: "price", header: "Hinta", type: "decimal" },
    { field: "vat", header: "ALV %", type: "decimal" },
]

export default serviceSchema;