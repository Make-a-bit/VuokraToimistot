/** 
 * The officeSchema variable is an array of objects, each representing a field definition for an office.
 * Each object has the following properties: field (string), header (string), and type (string).
 * 
 * @type {Array<{field: string, header: string, type: string}>}
 */
const officeSchema = [
    { field: "name", header: "Nimi", type: "string" },
    { field: "address", header: "Katuosoite", type: "string" },
    { field: "postalCode", header: "Postinumero", type: "string" },
    { field: "city", header: "Postitoimipaikka", type: "string" },
    { field: "country", header: "Maa", type: "string" },
    { field: "phone", header: "Puhelin", type: "string" },
    { field: "email", header: "Sähköposti", type: "string" },
];

export default officeSchema; 