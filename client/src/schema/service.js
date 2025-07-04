const serviceSchema = [
    { field: "name", header: "Nimi", type: "string" },
    { field: "unit", header: "Yksikkö", type: "string" },
    { field: "price", header: "Hinta", type: "decimal" },
    { field: "vat", header: "ALV %", type: "decimal" },
]

export default serviceSchema;