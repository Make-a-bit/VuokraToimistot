const propertySchema = [
    { field: "officeName", header: "Kohde", type: "string" },
    { field: "name", header: "Nimi", type: "string" },
    { field: "area", header: "Pinta-ala (m2)", type: "string" },
    { field: "price", header: "Hinta / vrk", type: "decimal" },
    { field: "vat", header: "ALV %", type: "decimal" },
];

export default propertySchema;