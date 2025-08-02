/**
 * deviceSchema is an array of objects describing the schema for a device.
 * Each object contains a field name, a header label, and a type.
 * The type annotation is Array<{field: string, header: string, type: string}>.
 *
 * @type {Array<{field: string, header: string, type: string}>}
 */
const deviceSchema = [
    { field: "officeName", header: "Kohde", type: "string" },
    { field: "name", header: "Nimi", type: "string" },
    { field: "price", header: "Hinta", type: "decimal" },
    { field: "vat", header: "ALV %", type: "decimal" },
]

export default deviceSchema;