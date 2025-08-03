/**
 * @typedef {Object} NavigationLink
 * @property {string} [path] - The URL path for the navigation link.
 * @property {string} label - The display label for the navigation link.
 * @property {boolean} [dropdownParent] - Indicates if this link has a dropdown menu.
 * @property {NavigationLink[]} [dropdown] - The dropdown links if this is a parent.
 */

/**
 * navigationLinks is an array of navigation link objects.
 * Each object can represent a simple link or a dropdown parent with nested links.
 * 
 * @type {NavigationLink[]}
 */
const navigationLinks = [
    { path: "/", label: "Etusivu" },
    { path: "/asiakkaat/", label: "Asiakkaat" },
    {
        label: "Vuokrakohteet",
        dropdownParent: true,
        dropdown: [
            { path: "/tilahallinta/kohteet", label: "Kohteet" },
            { path: "/tilahallinta/vuokratilat", label: "Vuokratilat" },
            { path: "/tilahallinta/laitteet", label: "Vuokralaitteet" },
            { path: "/tilahallinta/palvelut", label: "Lisäpalvelut" },
        ]
    },
    {
        path: "/varaushallinta", label: "Varaushallinta"
    },
    {
        path: "/laskutus", label: "Laskutus"
    },
    {
        path: "/verot", label: "Verokannat"
    }
]

export default navigationLinks;